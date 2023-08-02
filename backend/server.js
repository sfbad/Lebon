const express = require('express');
// const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const app = express();
const  model = require('./models') ;
var mustache = require('mustache-express');
app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', './views');


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
    }
    return next();
  });
  // Middleware pour vérifier l'authentification
  function is_authenticated(req, res, next) {
    if (req.session.user !== undefined) {
      return next();
    }
    res.status(401).send('Authentication required');
  }
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
  app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email ,password);
    const user = model.login(email,password);
    if(user != -1){
      req.session.user = user.user_id;
      req.session.name = user.username;
      req.session.type = user.role_name;
      res.redirect('/');
    } else {
      
      res.render('sign_in');
    }
  });
  
  app.get('/', (req, res) => {
    let annonces = model.Annonce.getAll();
    let categoriesWithSubcategories = model.Categorie.getCategoriesWithSubcategories();
  
    // Regrouper les sous-catégories sous leur catégorie respective
    let categories = [];
    categoriesWithSubcategories.forEach((item) => {
      let existingCategory = categories.find((cat) => cat.category === item.category);
      if (existingCategory) {
        existingCategory.subcategories.push(item.subcategory);
      } else {
        categories.push({ category: item.category, subcategories: [item.subcategory] });
      }
    });
  
    res.render('home', { annonces, categories });
  });; 

  app.get('/auth/log',(req,res)=>{
    res.render('sign_in');
  })
  app.get('/nouvel_utilsateur/inscription',(req,res)=>{
    res.render('signup');
  })
  app.get('/annonces/annonce/:id',(req, res)=>{
    const annonce = model.Annonce.get(req.params.id);
    if(annonce){
          res.render('read_annonce',{annonce}) ;

    }else{
      res.status(404).send('annonce not found');
    }
  })
  app.get('/entreprise/:id/read_my_annonces', (req, res) => {
    const myann = model.Annonce.getAnEntrepriseAllAno(req.params.id);

    if (myann !== 0) {
    
      res.render('read_ann_from_entrepri', { myann });
    } else {
      res.status(404).send("Nous n'avons trouvé aucune annonce pour vous.");
    }
  });

  // Importez les dépendances nécessaires

// Route pour la catégorie "Immobilier"
app.get('/categories/immobilier', (req, res) => {
  // Récupérez les annonces de la catégorie "Immobilier" depuis la base de données
  const annonces = model.getAnnoncesByCategory('Immobilier');
  res.render('annonces', { annonces });
});

// Route pour la catégorie "Emploi"
app.get('/categories/emploi', (req, res) => {
  // Récupérez les annonces de la catégorie "Emploi" depuis la base de données
  const annonces = model.getAnnoncesByCategory('Emploi');
  res.render('annonces', { annonces });
});

// Route pour la catégorie "Vehicule"
app.get('/categories/vehicule', (req, res) => {
  // Récupérez les annonces de la catégorie "Vehicule" depuis la base de données
  const annonces = model.getAnnoncesByCategory('Vehicule');
  res.render('annonces', { annonces });
});

// Route pour la catégorie "Maison"
app.get('/categories/maison', (req, res) => {
  // Récupérez les annonces de la catégorie "Maison" depuis la base de données
  const annonces = model.getAnnoncesByCategory('Maison');
  res.render('annonces', { annonces });
});

// Route pour la catégorie "Autres"
app.get('/categories/autres', (req, res) => {
  // Récupérez les annonces de la catégorie "Autres" depuis la base de données
  const annonces = model.Categorie.getAnnoncesByCategory('Autres');
  res.render('annonces', { annonces });
});

  
app.get('/categories/:category/:subcategory', (req, res) => {
  const category = req.params.category;
  const subcategory = req.params.subcategory;
  
  // Ici, vous pouvez charger les données de la catégorie et sous-catégorie spécifiées
  // à partir de votre modèle, puis les passer à votre template pour les afficher.

  // Exemple : Charger les annonces pour la catégorie et sous-catégorie spécifiées
  const annonces = model.getAnnoncesByCategoryAndSubcategory(category, subcategory);

  // Passez les données à votre template
  res.render('category', { category, subcategory, annonces });
});

app.get('/deposer-annonce',(req,res)=>{
  res.render('poster_annonce') ;
}) ;
  
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

  res.render('search',autocompleteResults);
});

// Afficher la page des demandes liées à l'annonce
app.get('/annonces/:annonceId/demandes', (req, res) => {
  const annonce = model.Annonce.get(req.params.annonceId);
  const demandes = model.Demande.getAnnDemande(req.params.annonceId) ;
  console.log(demandes);
  res.render('demandes', { titre: annonce.titre,id : annonce.ID_annonce, demandes: demandes });
});

// Route pour afficher toutes les demandes d'un client
app.get('/voir_mes_demandes/:demandeurId', (req, res) => {
  const demandes = model.Demande.get(1);
  console.log(demandes)
  res.render('dm_client', { demandes: demandes });
});
//route pour voir la  reponse
app.get('/ma_reponse/:id_dm', (req, res) => {
  const idDm = req.params.id_dm;
  const demandeur = model.Demandeur.get(idDm);
  const reponse = model.Reponse.get(idDm);
  console.log(reponse)

  if (!reponse) {
    const msg = "Pas de données";
    res.send(msg);
  } else {
    res.render('show_answer_candidature',{reponse : reponse.reponse});
  }
});
;

app.get('/answering_candidature/entreprise/:id_enterprise/demande_number/:id', (req, res) => {
  const idEntreprise = req.params.id_enterprise; // Utiliser "idEntreprise" au lieu de "Id_entreprise"
  const titre = model.Demande.getDmTitle(req.params.id);
  const entreprise = model.Entreprise.get(idEntreprise); // Utiliser "idEntreprise" ici aussi
  console.log(titre, idEntreprise ,entreprise);
  res.render('justifyAnswer', { titre });
});
 
app.post('/jystifyanswer/:id',(req,res)=>{
  const answer = req.body.answer ;
  const inserted = model.Reponse.answer(req.params.id,answer);
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

})


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

  app.post('/deposer_annonce/offreD_emploie',(req,res)=>{

  })

// Fonction qui facilite la création d'un objet
function post_data_to_offer(req) {
    return {
        id_user: req.session.user,
        titre: req.body.type,
        salaire: req.body.salaire,
        level: req.body.level,
        description: req.body.description,
        experience : req.body.experience ,
        travailA :req.body.travailA ,
        adresse : req.body.adresse
    };
}

function post_data_to_Vehicule(req) {
  return {
      id_user: req.session.user,
      titre: req.body.titre,
      type: req.body.type,
      marque: req.body.marque,
      description: req.body.description,
      model : req.body.model ,
      model_year :req.body.model_year,
      circulation : req.body.circulation,
      kilometrage : req.body.kilometrage ,
      carburant  : req.body.carburant ,
      cylindree :req.body.cylindree 
  };
}


// Route pour la soumission du formulaire de dépôt d'annonce
app.post('/deposer-annonce', (req, res) => {
  // Récupérez les informations du formulaire
  const titre = req.body.titre;
  const description = req.body.description;
  // Obtenez l'ID de l'entreprise à partir de la session ou de l'utilisateur connecté
  const entrepriseId = 123; // Remplacez 123 par l'ID de l'entreprise réelle
  // Enregistrez l'annonce dans la base de données avec l'ID de l'entreprise
  // ...

  // Redirigez l'utilisateur vers sa page personnelle après avoir déposé l'annonce
  res.redirect(`/entreprise/${entrepriseId}`);
});













  const port = 3000;

  app.listen(port, () => {
    console.log(`Serveur Express démarré surlocalhost :${port}`);
  });
    