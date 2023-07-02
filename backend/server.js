var express = require('express');
var mustache = require('mustache-express');
const cookieSession = require('cookie-session');
var models = require('./models');
var app = express();


app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', '../views');

// parse form arguments in POST requests
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware pour gérer les sessions avec des cookies
app.use(cookieSession({
    name: 'session',
    keys: ['your-session-keys'],
    maxAge: 24 * 60 * 60 * 1000, // Durée de validité du cookie (ici, 24 heures)
  }));

  // Middleware d'authentification
  const Authentification = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'veuillez vous authentifier !!' });
    }
    // L'utilisateur est authentifié, vous pouvez continuer la requête
    next();
  };
  app.get('/',(req,res)=>{
    res.render('home');
  });
  app.get('/signup' ,(req,res)=>{
    res.render('signup');
  });
  app.get('/sign_in' ,(req,res)=>{
    res.render('sign_in');
  });
  app.post('/demandeurs', async (req, res) => {
    const { nom, prenom, mail, dateNaissance, password, idAdresse } = req.body;
    
    try {
      const newDemandeur = await models.Demandeur.create(nom, prenom, mail, dateNaissance, password, idAdresse);
      res.status(200).json({ message: 'Nouveau demandeur créé avec succès', demandeur: newDemandeur });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création du demandeur' });
    }
  });
  
  // Route pour obtenir les détails d'un demandeur
  app.get('/demandeurs/:id', async (req, res) => {
    const demandeurId = req.params.id;
    
    try {
      const demandeur = await models.Demandeur.getDemandeur(demandeurId);
      res.status(200).json(demandeur);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des détails du demandeur' });
    }
  });
  
  // Route pour mettre à jour les informations d'un demandeur
  app.put('/demandeurs/:id', async (req, res) => {
    const demandeurId = req.params.id;
    const { nom, prenom, mail, dateNaissance, password, idAdresse } = req.body;
    
    try {
      await models.Demandeur.updateDemandeur(demandeurId, nom, prenom, mail, dateNaissance, password, idAdresse);
      res.status(200).json({ message: 'Demandeur mis à jour avec succès' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour du demandeur' });
    }
  });
  
  // Route pour supprimer un demandeur
  app.delete('/demandeurs/:id', async (req, res) => {
    const demandeurId = req.params.id;
    
    try {
      await models.Demandeur.deleteDemandeur(demandeurId);
      res.status(200).json({ message: 'Demandeur supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression du demandeur' });
    }
  });
  
  // Route pour créer une nouvelle entreprise
  app.post('/entreprises', async (req, res) => {
    const { nom, mail, password, idAdresse } = req.body;
    
    try {
      const newEntreprise = await models.Entreprise.create(nom, mail, password, idAdresse);
      res.status(200).json({ message: 'Nouvelle entreprise créée avec succès', entreprise: newEntreprise });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création de l\'entreprise' });
    }
  });
  
  // Route pour obtenir les détails d'une entreprise
  app.get('/entreprises/:id', async (req, res) => {
    const entrepriseId = req.params.id;
    
    try {
      const entreprise = await models.Entreprise.get(entrepriseId);
      res.status(200).json(entreprise);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des détails de l\'entreprise' });
    }
  });
 
    
  
  // Route pour mettre à jour les informations d'une entreprise
  app.put('/entreprises/:id', async (req, res) => {
    const entrepriseId = req.params.id;
    const { nom, mail, password, idAdresse } = req.body;
    
    try {
      await models.Entreprise.update(entrepriseId, nom, mail, password, idAdresse);
      res.status(200).json({ message: 'Entreprise mise à jour avec succès' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'entreprise' });
    }
  });
  
  // Route pour supprimer une entreprise
  app.delete('/entreprises/:id', async (req, res) => {
    const entrepriseId = req.params.id;
    
    try {
      await models.Entreprise.delete(entrepriseId);
      res.status(200).json({ message: 'Entreprise supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'entreprise' });
    }
  });


//creer une annonce


  app.post('/annonces', async (req, res) => {
    const { titre, date_creation, description, adresse, id_entreprise, photo, share_link } = req.body;
  
    try {
      const annonceId = await models.Annonce.create(titre, date_creation, description, adresse, id_entreprise, photo, share_link);
      res.json({ message: 'Annonce créée avec succès', annonceId });
    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
  // supprimer une annonce
  app.delete('/annonces/:id', async (req, res) => {
    const annonceId = req.params.id;
  
    try {
      const annonce = await models.Annonce.get(annonceId);
      if (!annonce) {
        return res.status(404).json({ error: 'Annonce non trouvée' });
      }
  
      await models.Annonce.delete(annonceId);
  
      res.json({ message: 'Annonce supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'annonce :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
  // mettre a jour une annonce
  app.put('/annonces/:id', async (req, res) => {
    const annonceId = req.params.id;
    const { titre, dateCreation, description, adresse, idEntreprise, photo, shareLink } = req.body;
  
    try {
      const annonce = await models.Annonce.get(annonceId);
      if (!annonce) {
        return res.status(404).json({ error: 'Annonce non trouvée' });
      }
  
      await models.Annonce.update(annonceId, titre, dateCreation, description, adresse, idEntreprise, photo, shareLink);
  
      res.json({ message: 'Annonce mise à jour avec succès' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'annonce :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
  
  //partager une annonce
  app.post('/annonces/:idAnnonce/partager', (req, res) => {
    const idAnnonce = req.params.idAnnonce;
    const idEntreprise = req.body.idEntreprise;
  
    models.Annonce.share(idAnnonce, idEntreprise)
      .then(annonceURL => {
        res.status(200).json({
          success: true,
          message: 'Annonce partagée avec succès',
          annonceURL: annonceURL
        });
      })
      .catch(error => {
        res.status(500).json({
          success: false,
          message: 'Erreur lors du partage de l\'annonce',
          error: error.message
        });
      });
  });

  //poster une demande
  
  app.post('/annonces/:idAnnonce/demandes', (req, res) => {
    const idAnnonce = req.params.idAnnonce;
    const idDemandeur = req.body.idDemandeur;
    const state = "pending";
  
    models.Demande.create(idDemandeur, idAnnonce, state)
      .then(demandeId => {
        res.status(200).json({
          success: true,
          message: 'Demande effectuée avec succès',
          demandeId: demandeId
        });
      })
      .catch(error => {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la demande',
          error: error.message
        });
      });
  });

  app.get('/toutes-les-annonces',(req,res)=>{
    const annonces =  models.Annonce.getAnnon_Enter_Name();
    if(annonces){
      res.render('annonces',{annonces});
    }
    else {
      res.send("Aucune annonce dispo ");
    }
  });
  
  //recuperer les infos d'un demandeur
  app.get('/annonces/:idAnnonce/demandes', async (req, res) => {
    const idAnnonce = req.params.idAnnonce;
  
    try {
      // Récupérer les demandes liées à l'annonce
      const demandes = await models.Demande.get(idAnnonce);
  
      // Récupérer les informations (nom, prénom) du demandeur pour chaque demande
      const demandesAvecDemandeurs = await Promise.all(demandes.map(async demande => {
        const demandeur = await models.Demandeur.get(demande.demandeurId);
        return {
          demandeId: demande.demandeId,
          nomDemandeur: demandeur.nom,
          prenomDemandeur: demandeur.prenom,
          statut: demande.statut
        };
      }))
      res.render('demandes',{demandeur})

    } catch (error) {
      console.error('Erreur lors de la récupération des demandes :', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  });
  //mettre a jour une demande 
  app.put('/demandes/:idDemande', (req, res) => {
    const idDemande = req.params.idDemande;
    const { idDemandeur, state } = req.body;
  
    models.Demande.update(idDemande, idDemandeur, state)
      .then(() => {
        res.status(200).json({
          success: true,
          message: 'Demande mise à jour avec succès'
        });
      })
      .catch(error => {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la mise à jour de la demande',
          error: error.message
        });
      });
  });

  //supprimer une demande
  
  app.delete('/demandes/:idDemande', (req, res) => {
    const idDemande = req.params.idDemande;
  
    models.Demande.delete(idDemande)
      .then(() => {
        res.status(200).json({
          success: true,
          message: 'Demande supprimée avec succès'
        });
      })
      .catch(error => {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la suppression de la demande',
          error: error.message
        });
      });
  });
  
  app.post('/cv', (req, res) => {
    const { demandeurId, cheminFichier } = req.body;
  
    models.CV.save(demandeurId, cheminFichier)
      .then(cvId => res.json({ cvId }))
      .catch(error => res.status(500).json({ error: error.message }));
  });
  
  app.delete('/cv/:cvId', (req, res) => {
    const cvId = req.params.cvId;
  
    models.CV.deleteCV(cvId)
      .then(() => res.sendStatus(204))
      .catch(error => res.status(500).json({ error: error.message }));
  });
  
  app.put('/cv/:cvId', (req, res) => {
    const cvId = req.params.cvId;
    const { demandeurId, cheminFichier } = req.body;
  
    models.CV.update(cvId, demandeurId, cheminFichier)
      .then(() => res.sendStatus(204))
      .catch(error => res.status(500).json({ error: error.message }));
  });
  
  app.get('/cv/:cvId', (req, res) => {
    const cvId = req.params.cvId;
  
    models.CV.getCVFilePath(cvId)
      .then(cv => res.json({ cv }))
      .catch(error => res.status(500).json({ error: error.message }));
  });
  
  app.post('/photo', (req, res) => {
    const { demandeurId, cheminFichier } = req.body;
  
    models.Photo.ajouterPhotoDemandeur(demandeurId, cheminFichier)
      .then(photoId => res.json({ photoId }))
      .catch(error => res.status(500).json({ error: error.message }));
  });
  
  app.delete('/photo/:photoId', (req, res) => {
    const photoId = req.params.photoId;
  
    models.Photo.delete(photoId)
      .then(() => res.sendStatus(204))
      .catch(error => res.status(500).json({ error: error.message }));
  });
  
  app.put('/photo/:photoId', (req, res) => {
    const photoId = req.params.photoId;
    const { demandeurId, cheminFichier } = req.body;
  
    models.Photo.update(photoId, demandeurId, cheminFichier)
      .then(() => res.sendStatus(204))
      .catch(error => res.status(500).json({ error: error.message }));
  });
  
  app.get('/photo/:photoId', (req, res) => {
    const photoId = req.params.photoId;
  
    models.Photo.get(photoId)
      .then(photo => res.json({ photo }))
      .catch(error => res.status(500).json({ error: error.message }));
  });
  
  app.post('/demandeurs', (req, res) => {
    const {
      nom,
      prenom,
      birthdate,
      placeBirth,
      numeroTelephone,
      mail,
      password
    } = req.body;
  
    models.Demandeur.create({
      Nom: nom,
      Prénom: prenom,
      Mail: mail,
      Date_naissance: birthdate,
      password: password,
    })
      .then(demandeur => {
        res.json({ message: 'Informations du demandeur enregistrées avec succès.', demandeurId: demandeur.ID });
      })
      .catch(error => {
        res.status(500).json({ message: 'Une erreur est survenue lors de l\'enregistrement des informations du demandeur.' });
      });
  });
  
  app.post('/entreprises', (req, res) => {
    const {
      entreprise,
      mail,
      adresse,
      ville,
      commune,
      arrondissement,
    } = req.body;
  
    models.Entreprise.create({
      Nom: entreprise,
      Mail: mail,
    })
      .then(() => {
        res.json({ message: 'Inscription de l\'entreprise réussie !' });
      })
      .catch(error => {
        res.status(500).json({ message: 'Une erreur est survenue lors de l\'inscription de l\'entreprise.' });
      });
  });
  
  













app.listen(3000, () => console.log('listening on http://localhost:3000'));
