// const Database = require('better-sqlite3');

// // Création de la connexion à la base de données
// const db = new Database('database.sqlite');

// // Requête SQL pour créer la table "demandeur"
// const createDemandeurTableQuery = `
// CREATE TABLE IF NOT EXISTS demandeur (
//   ID INTEGER PRIMARY KEY AUTOINCREMENT,
//   Nom TEXT NOT NULL,
//   Prénom TEXT NOT NULL,
//   Mail TEXT NOT NULL,
//   Date_naissance DATE NOT NULL,
//   Lieu_de_naissance TEXT NOT NULL ,
//   Password TEXT NOT NULL,
//   ID_adresse INTEGER,
//   FOREIGN KEY (ID_adresse) REFERENCES adresse(ID)
// )`;

// // Requête SQL pour créer la table "entreprise"
// const createEntrepriseTableQuery = `
// CREATE TABLE IF NOT EXISTS entreprise (
//   ID INTEGER PRIMARY KEY AUTOINCREMENT,
//   Nom TEXT NOT NULL,
//   Mail TEXT NOT NULL,
//   Password TEXT NOT NULL,
//   ID_adresse INTEGER,
//   FOREIGN KEY (ID_adresse) REFERENCES adresse(ID),
// )`;

// // Requête SQL pour créer la table "adresse"
// const createAdresseTableQuery = `
// CREATE TABLE IF NOT EXISTS adresse (
//   ID INTEGER PRIMARY KEY AUTOINCREMENT,
//   Numéro_de_téléphone VARCHAR(20) NOT NULL,
//   Adresse TEXT NOT NULL,
//   Arrondissement TEXT NOT NULL,
//   Commune TEXT NOT NULL,
//   Ville TEXT NOT NULL,
//   Region TEXT NOT NULL
// )`;

// // Requête SQL pour créer la table "annonce"
// const createAnnonceTableQuery = `
// CREATE TABLE IF NOT EXISTS annonce (
//   ID_annonce INTEGER PRIMARY KEY AUTOINCREMENT,
//   titre TEXT NOT NULL,
//   date_creation DATE NOT NULL,
//   description TEXT NOT NULL,
//   adresse TEXT NOT NULL,
//   id_entreprise INTEGER,
//   photo TEXT,
//   FOREIGN KEY (id_entreprise) REFERENCES entreprise(ID)
// )`;

// // Requête SQL pour créer la table "CV"
// const createCVTableQuery = `
// CREATE TABLE IF NOT EXISTS CV (
//   cv_id INTEGER PRIMARY KEY AUTOINCREMENT,
//   demandeur_id INTEGER,
//   chemin_fichier TEXT,
//   FOREIGN KEY (demandeur_id) REFERENCES demandeur(ID)
// )`;

// // Requête SQL pour créer la table "photo"
// const createPhotoTableQuery = `
// CREATE TABLE IF NOT EXISTS photo (
//   photo_id INTEGER PRIMARY KEY AUTOINCREMENT,
//   demandeur_id INTEGER,
//   chemin_fichier TEXT,
//   FOREIGN KEY (demandeur_id) REFERENCES demandeur(ID)
// )`;

// // Requête SQL pour créer la table "document"
// const createDocumentTableQuery = `
// CREATE TABLE IF NOT EXISTS document (
//   document_id INTEGER PRIMARY KEY AUTOINCREMENT,
//   demandeur_id INTEGER,
//   chemin_fichier TEXT,
//   FOREIGN KEY (demandeur_id) REFERENCES demandeur(ID)
// )`;

// // Requête SQL pour créer la table "demande"
// const createDemandeTableQuery = `
// CREATE TABLE IF NOT EXISTS demande (
//   id_dm INTEGER PRIMARY KEY AUTOINCREMENT,
//   id_demandeur INTEGER,
//   id_annonce INTEGER,
//   state TEXT,
//   FOREIGN KEY (id_demandeur) REFERENCES demandeur(ID),
//   FOREIGN KEY (id_annonce) REFERENCES annonce(ID_annonce)
// )`;

// // const createShareLink =`
// // CREATE TABLE share (
// //   id INT AUTO_INCREMENT PRIMARY KEY,
// //   shared_by INT,
// //   share_link VARCHAR(255),
// //   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// //   FOREIGN KEY (shared_by) REFERENCES users(id),
// // )`;

// CREATE TABLE categories (
//     id INTEGER PRIMARY KEY,
//     name TEXT NOT NULL
//   );
//   CREATE TABLE subcategories (
//     id INTEGER PRIMARY KEY,
//     name TEXT NOT NULL,
//     category_id INTEGER NOT NULL,
//     FOREIGN KEY (category_id) REFERENCES categories (id)
//   );
    


// // Exécution des requêtes SQL pour créer les tables
// db.exec(createDemandeurTableQuery);
// db.exec(createEntrepriseTableQuery);
// db.exec(createAdresseTableQuery);
// db.exec(createAnnonceTableQuery);
// db.exec(createCVTableQuery);
// db.exec(createPhotoTableQuery);
// db.exec(createDocumentTableQuery);
// db.exec(createDemandeTableQuery);

// console.log('Tables créées avec succès.');

// // Fermeture de la connexion à la base de données
// db.close();