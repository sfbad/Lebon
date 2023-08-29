const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const app = express();
const  model = require('./models') ;
var mustache = require('mustache-express');
const multer = require('multer');
const path = require('path');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({ storage: storage });


app.post('/upload', upload.array('photos', 3), (req, res) => {
  const files = req.files;
  const demandeurId = req.body.demandeurId;

  files.forEach(file => {
    const cheminFichier = '/images/' + file.filename;
    model.insertPhoto(demandeurId, cheminFichier, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });  

  res.redirect('/');
});


// Configurez cookie-session
app.use(cookieSession({
    name: 'sqdfkjdsdsj',
    secret: 'vdczdsun#ZJ222398IONU8Z0S3sc,iidi',
  }));

  // Middleware pour parser le corps des requêtes HTTP
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Middleware pour gérer les données utilisateur dans les vues
  app.use(function(req, res, next) {
    if (req.session.user !== undefined) {
      res.locals.authenticated = true;
      res.locals.name = req.session.name;
      res.locals.user = req.session.user;
      res.locals.roleIsEntreprise = req.session.role === 'entreprise';
      res.locals.roleIsDemandeur = req.session.role === 'demandeur';
    } else {
      res.locals.authenticated = false;
    }
    return next();
  });
  

  
  // Middleware pour vérifier l'authentification
  function is_authenticated(req, res, next) {
    if (req.session.user !== undefined) {
      return next();
    } 
    res.redirect('/auth/log'); // Rediriger vers la page de connexion
  }

  //route pour un nouvel user 
  app.post('/new_user', (req, res) => {
    const { username, email, password } = req.body;
    
    // Vérifier si l'utilisateur existe déjà dans la base de données
    getUserByEmail(email)
      .then((user) => {
        if (user) {
          // L'utilisateur existe déjà
          res.status(409).json({ success: false, message: 'Cet utilisateur existe déjà.' });
        } else {
          // L'utilisateur n'existe pas, on peut le créer
  
          // Récupérer le rôle depuis le formulaire
          const roleName = req.body.type;
  
          // Utiliser la fonction createUser pour créer un nouvel utilisateur avec le rôle
          Users.createUser(username, email, password, roleName)
            .then((userId) => {
              if (userId !== -1) {
                // L'utilisateur a été créé avec succès
  
                // Ouvrir une session pour l'utilisateur
                req.session.user = userId;
                req.session.name = username;
  
                // Rediriger vers la page d'accueil de l'utilisateur
                res.redirect('/home');
              } else {
                // La création de l'utilisateur a échoué
                res.status(500).json({ success: false, message: 'Échec de la création de l\'utilisateur.' });
              }
            })
            .catch((err) => {
              // Une erreur s'est produite lors de la création de l'utilisateur
              console.error(err);
              res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de la création de l\'utilisateur.' });
            });
        }
      })
      .catch((err) => {
        // Une erreur s'est produite lors de la vérification de l'utilisateur
        console.error(err);
        res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de la vérification de l\'utilisateur.' });
      });
  });


  
  // route pour se connecter
  app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    const userEntreprise = model.loginEntreprise(email, password);
    const userDemandeur = model.loginDemandeur(email, password);
  
    if (userEntreprise !== -1) {
      req.session.user = userEntreprise.ID;
      req.session.name = userEntreprise.Nom;
      req.session.role = 'entreprise';
      res.redirect('/');
    } else if (userDemandeur !== -1) {
      req.session.user = userDemandeur.ID;
      req.session.name = userDemandeur.Nom;
      req.session.role = 'demandeur';
      res.redirect('/');
    } else {
      res.render('sign_in')
    }
  });
  

  //route pour se deconnecter
  app.get("/logout",(req,res)=>{
    req.session =null ;
    res.redirect('/')
  })
  
  //route de la page d'acceuil 
  


  app.get('/', async (req, res) => {
    try {
      const annonces =  model.Annonce.getAll();
      const categoriesWithSubcategories = await model.Categorie.getCategoriesWithSubcategories();
  
      // Créer un objet de catégories avec leurs sous-catégories
      let categories = [];
    categoriesWithSubcategories.forEach((item) => {
      let existingCategory = categories.find((cat) => cat.category === item.category);
      if (existingCategory) {
        existingCategory.subcategories.push(item.subcategory);
      } else {
        categories.push({ category: item.category, subcategories: [item.subcategory] });
      }
    });
      console.log(categories)
      res.render('home', { annonces, categories });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  
//route qui mene vers / apres s'etre identifier 
  app.get('/home',is_authenticated,(req,res)=>{
    res.render('home', { name: req.session.name });

  });



  
  //route pour voir les parametres du compte de l'utilisateur 
  app.get('/compte/user',is_authenticated,(req,res)=>{
    let annonces = model.Annonce.getAll();
    let categoriesWithSubcategories = model.Categorie.getCategoriesWithSubcategories();
    let categories = [];
    categoriesWithSubcategories.forEach((item) => {
      let existingCategory = categories.find((cat) => cat.category === item.category);
      if (existingCategory) {
        existingCategory.subcategories.push(item.subcategory);
      } else {
        categories.push({ category: item.category, subcategories: [item.subcategory] });
      }
    });
   res.render('compte',{ annonces, categories });
  });



//route pour avoir le formulaire de connexion
  app.get('/auth/log',(req,res)=>{
    res.render('sign_in');
  });


  //route pour avoir le formulaire d'inscription
  app.get('/nouvel_utilsateur/inscription',(req,res)=>{
    res.render('signup');
  })

  
  //route pour avoir l'annonce d'identifiant id 
  app.get('/annonces/annonce',is_authenticated,(req, res)=>{
    const annonce = model.Annonce.get(req.session.user);
    if(annonce){
          res.render('read_annonce',{annonce}) ;

    }else{
      res.status(404).send('annonce not found');
    }
  });

  app.get('/entreprise/read_my_annonces',is_authenticated, (req, res) => {
    const myann = model.Annonce.getAnEntrepriseAllAno(req.session.user);

    if (myann !== 0) {
    
      res.render('read_ann_from_entrepri', { myann });
    } else {
      res.status(404).send("Nous n'avons trouvé aucune annonce pour vous.");
    }
  });

//route pour deposer une annonce
app.get('/deposer-annonce',(req,res)=>{
  let categories = model.Categorie.getCat() ;
 
    res.render('poster_annonce',{categories}) ;

    console.log(categories)
 
}) ;

//obtenir toutes les annonces de toutes les categories 
app.get('/annonces/:categorie',(req, res)=>{
  let categorie = req.params.categorie ;
  let annonces = null ;
  if(categorie=="Emplois") {
    annonces = model.Emploi.getAll() ;
    if(annonces ==-1) res.json('No datas')
    res.render('all' ,{annonces});

  } else if (categorie =="Immobilier"){

    if(annonces ==-1) res.json('No datas')
    annonces = model.Immobiliere.getAll();
    res.render('all',{annonces})


  } else if (categorie == "Vehicules"){

    if(annonces ==-1) res.json('No datas')
    annonces = model.Vehicule.getAll() ;
    res.render('all',{annonces})

  }else {
    if(annonces ==-1) res.json('No datas');
    annonces = model.Maison.getAll();
    res.render('all',{annonces})
  }

})
//route pour obtenir les annonces d'emplois par type 
app.get('/Emplois/:subcategory', async (req, res) => {
  try {
    const subcategory = req.params.subcategory;
    const subcategory_id = model.getSubcategoryIdByName(subcategory);
    console.log(subcategory ,subcategory_id)
    
    // Obtenir les annonces en fonction de la sous-catégorie 
    const annonces =  model.Emploi.getBySubCname(subcategory_id);
    // Récupérer les sous-catégories spécifiques à la catégorie "Emplois"
    console.log(annonces)
  
    res.render('annon_emplois', {annonces });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error ref code ');
  }
});

//Pour obtenir la page des sous categories de la categorie Véhicules
app.get('/Vehicules/:subcategory', async (req, res) => {
  try {
    const subcategory = req.params.subcategory;
    const subcategory_id = model.getSubcategoryIdByName(subcategory);
    
    // Obtenez les annonces de la sous-catégorie et du type spécifiés
    const annonces =  model.Vehicule.getTypesofVehicule(subcategory);
    
    // Obtenez les sous-catégories spécifiques à la catégorie "Véhicules"
    const subcategories =  model.Vehicule.getSub();
  
    res.render('annonce_vehicule', { subcategory, annonces, subcategories });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/Vehicules/:subcategory/:typeofvehicule', async (req, res) => {
  try {
    const subcategory = req.params.subcategory;
    const typevehicule  = req.params.typeofvehicule ;
    const subcategory_id = model.getSubcategoryIdByName(subcategory);

    
    // Obtenez les annonces de la sous-catégorie et du type spécifiés
    const Vehicules =  model.Vehicule.getTypesofVehiculeBysubcatId(subcategory_id ,typevehicule);
        
      res.render('annonce_vehicule',{Vehicules});
    
      } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/Immobilier/:subcategory', async (req, res) => {
  try {
    const subcategory = req.params.subcategory;
    const subcategory_id = model.getSubcategoryIdByName(subcategory);
    const subcategories =  model.Immobiliere.getSub();
    res.render('annonce_immo', { subcategory, subcategories });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/Immobilier/:subcategory/:type', async (req, res) => {
  try {
    const subcategory = req.params.subcategory;
    const type  = req.params.type ;
    const subcategory_id = model.getSubcategoryIdByName(subcategory);

    const subcategories =  model.Immobiliere.getSub();

    res.render('annonce_immo', { subcategory, type, annonces, subcategories });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
//route pour les sous categories de Maison 

app.get('/Maison/:subcategory', async (req, res) => {
  try {
    const subcategory = req.params.subcategory;
    const subcategory_id = model.getSubcategoryIdByName(subcategory);

    // Obtenez les annonces de la sous-catégorie et du type spécifiés
    const annonces =  model.Maison.getTypesofMaison(subcategory);

    // Obtenez les sous-catégories spécifiques à la catégorie "Immobilier"
    const subcategories = await model.Maison.getSub();

    res.render('annonce_maison', { subcategory, annonces, subcategories });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});




app.get('/search', (req, res) => {
  const searchTerm = req.query.term.toLowerCase();
  const annonces = model.Annonce.getAll(); // Récupérer toutes les annonces
  const categories = model.Categorie.getAll(); // Récupérer toutes les catégories
  const subcategories = model.Categorie.getAllSub(); // Récupérer toutes les sous-catégories

  const autocompleteResults = [];

  // Filtrer les annonces par le terme de recherche
  annonces.forEach((annonce) => {
    if (
      annonce.titre.toLowerCase().includes(searchTerm) ||
      annonce.description.toLowerCase().includes(searchTerm)
    ) {
      autocompleteResults.push(annonce.titre);
    }
  });

  // Filtrer les catégories par le terme de recherche
  categories.forEach((categorie) => {
    if (categorie.nom.toLowerCase().includes(searchTerm)) {
      autocompleteResults.push(categorie.nom);
    }
  });

  // Filtrer les sous-catégories par le terme de recherche
  subcategories.forEach((subcategory) => {
    if (subcategory.name.toLowerCase().includes(searchTerm)) {
      autocompleteResults.push(subcategory.name);
    }
  });

  // Utiliser Mustache pour rendre la vue search avec les résultats de l'autocomplétion

  const template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <!-- Autres balises meta et liens CSS -->

        <!-- Bootstrap Icons CSS link -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">

        <title>Résultats de recherche</title>
    </head>
    <body>
      <!-- Votre code pour afficher les résultats de la recherche ici -->
      <h1>Résultats de recherche</h1>
      <ul>
        {{#autocompleteResults}}
          <li>{{.}}</li>
        {{/autocompleteResults}}
      </ul>
    </body>
    </html>
  `;
  const renderedView = mustache.render(template, viewData);
  res.send(renderedView);
});


// Afficher la page des demandes liées à l'annonce pour une entreprise 
app.get('/annonces/:annonceId/demandes', (req, res) => {
  const annonce = model.Annonce.get(req.params.annonceId);
  const demandes = model.Demande.getAnnDemande(req.params.annonceId) ;
  console.log(demandes);
  res.render('demandes', { titre: annonce.titre,id : annonce.ID_annonce, demandes: demandes });
});

// Route pour afficher toutes les demandes d'un client
app.get('/voir_mes_demandes/', (req, res) => {
  const demandes = model.Demande.get(req.session.user);

  console.log(demandes)
  demandes.forEach(demande => {
    demande.stateRefused = demande.state === 'refuse' ? true : false;
    demande.stateAccepted = demande.state === 'accepte' ? true : false;
  });
  
  res.render('dm_client', { demandes: demandes });
});
//route pour voir la  reponse
app.get('/ma_reponse/:id_dm', (req, res) => {
  const idDm = req.params.id_dm;
  const titre = model.Demande.getDmTitle(idDm);
  const  id_ann = titre.ID_annonce ;
  const entreprise = model.Entreprise.getFromIdAnnonce(id_ann)
  // const adresse = model.Reponse.adresseEnt(idDm);
  const reponse = model.Reponse.get(idDm);
  const state = model.Demande.getState(idDm);
  const candidat = model.Demandeur.get(idDm)
  console.log(titre,entreprise  ,reponse ,state,candidat)

  if (!reponse) {
    const msg = "Pas de données";
    res.send(msg);
  } else {
    res.render('show_answer_candidature',{ titre : titre.titre ,entreprise , reponse ,state,candidat });
  }
});


app.get('/answering_candidature/demande_number/:id', (req, res) => {
  const titre = model.Demande.getDmTitle(req.params.id);
  const  id_ann = titre.ID_annonce ;
  const entreprise = model.Entreprise.getFromIdAnnonce(id_ann)
  // const adresse = model.Reponse.adresseEnt(req.params.id);
  const state = model.Demande.getState(req.params.id);
  const candidat = model.Demandeur.get(titre.id_demandeur)
  console.log(titre,id_ann,entreprise  ,state,candidat)
  res.render('justifyAnswer', { titre : titre.titre ,ID : entreprise.ID,id_dm :titre.id_dm ,entreprise  ,state,candidat });
});
 
app.get('/jystify_answer_number/:id/entreprise/:id_ent',(req,res)=>{
  const answer = req.body.answer ;
  const entrepriseid =req.params.id_ent ;
  console.log(answer)
  const inserted = model.Reponse.answer(req.params.id,entrepriseid,answer);
  if(inserted){
    res.setTimeout(3000, () => {
      res.json({
        message: 'Votre réponse a été soumise.',
        redirect: '/'
      });
    });    
}else{
  res.status(500).json('Une erreur s\'est produite lors de la soumission de votre réponse.');
}

});



// Mettre à jour le statut d'une demande
app.post('/annonce/:annonceId/demandes/:demandeId/miseajour', (req, res) => {
  const idann = req.params.annonceId ;
  const demandeId = req.params.demandeId;
  const nouveauStatut = req.body.statut;
  const setstate = model.Demande.setState(demandeId,nouveauStatut);
  res.redirect(`/annonces/${idann}/demandes`);
});


  app.post('/addCategory', async (req, res) => {
    const categorieName = req.body.name;
    try {
      const categoryId = await model.Categorie.addCategorie(categorieName);
      res.json({ message: 'Catégorie ajoutée avec succès', categoryId });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie :', error.message);
      res.status(500).json({ error: 'Erreur lors de l\'ajout de la catégorie' });
    }
  });



  function createObjectFromRequest(req, fields) {
    const obj = { id_user: req.session.user };
    fields.forEach(field => {
      obj[field] = req.body[field];
    });
    return obj;
  }

// Fonction qui facilite la création d'un objet
function post_data_to_OfferEmploi(req) {
  const EmploiFields = [
    'titrePoste', 'descriptionPoste', 'entreprise', 'localisation', 'typeContrat',
    'niveauExperience', 'niveauEtudes', 'competencesRequises', 'salaireAvantages',
    'dateDebut', 'modalitesCandidature'
  ];
  return createObjectFromRequest(req, EmploiFields);
}

function post_data_to_DemandeEmploi(req) {
  const DemandeEmploiFields = [
    'typePosteRecherche', 'domaineActivite', 'niveauExperienceCandidat',
    'niveauEtudesCandidat', 'competencesQualifications', 'disponibilite',
    'lieuTravailSouhaite', 'typeContratSouhaite', 'salaireSouhaite',
    'languesParlees', 'mobiliteGeographique'
  ];
  return createObjectFromRequest(req, DemandeEmploiFields);
}

function post_data_to_Immobilier(req) {
  const fields = [
    'titre', 
    'typeAnnonce', 
    'surfaceHabitable', 
    'surfaceTerrain', 
    'prix', 
    'nbPieces',
    'description',
    'adresse',
    'anneeConstruction',
    'etage',
    'ascenseur',
    'balconTerrasse',
    'nbSallesDeBains',
    'nbChambres',
    'typeChauffage',
    'typeClimatisation',
    'parkingGarage',
    'etatBien',
    'disponibilite'
  ];
    return createObjectFromRequest(req, fields);
}
function post_data_to_Voiture(req) {
  const vehiculeFields = [
    'typeVehicule', 'marque', 'modele', 'model_year', 'circulation', 'kilometrage', 'carburant',
    'typeVehiculeVoiture', 'marqueMoto', 'modeleMoto', 'model_yearMoto', 'kilometrageMoto', 'prixMoto', 'cylindreMoto',
    'carburantMoto', 'etatMoto'
  ];
    return createObjectFromRequest(req,vehiculeFields);
}
function post_data_to_Moto(req) {
  const venteMotoFields = [
    'marqueMoto', 'modeleMoto', 'model_yearMoto', 'kilometrageMoto', 'prixMoto', 'cylindreMoto',
    'carburantMoto', 'etatMoto'
  ];
    return createObjectFromRequest(req,venteMotoFields);
}
function post_data_to_LocationMoto(req) {
  const fields = ['marqueMotoLocation', 'modeleMotoLocation', 'model_yearMotoLocation', 'kilometrageMotoLocation',
  'prixMotoLocation', 'cautionMotoLocation', 'periodeLocation', 'carburantMotoLocation', 'etatMotoLocation'
];
  
    return createObjectFromRequest(req,fields);
}



function post_data_to_Maison(req) {
  const fields = ['titre', 'type', 'marque', 'description', 'model', 'model_year', 'circulation', 'kilometrage', 'carburant', 'cylindree'];
  return createObjectFromRequest(req, fields);
}
function post_data_to_LocationVoiture(req){
  const vehiculeFields = [
    'marqueVoiture', 'modeleVoiture', 'anneeModelVoiture', 'kilometrageVoiture', 'prixLocation', 'caution',
    'periodeLocation', 'carburantVoiture', 'nombrePlaces', 'descriptionVoiture', 'photosVoiture', 'disponibiliteVoiture'
  ];
  
}


// Route pour la soumission du formulaire de dépôt d'annonce
app.post('/deposer_annonce/:categorie', (req, res) => {
  const categorie = req.params.categorie ;
  res.render(`form`+`${categorie}`);

});

app.get('/annonces-emploi', async (req, res) => {
  try {
   
    res.render('annonce_emploies');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});
app.get('/offres_emploie', (req, res) => {
  const offres = model.Emploi.getOffres() // Récupérez les offres depuis la base de données
  res.render('offres', { offres });
});

app.get('/demandes_emploie', (req, res) => {
  const demandes = model.AnnonceEmploi.getDemandes(); // Récupérez les demandes depuis la base de données
  res.render('annonce_emploies', { demandes });
});


  const port = 3000;

  app.listen(port, () => {
    console.log(`Serveur Express démarré surlocalhost :${port}`);
});
    