const Sqlite = require('better-sqlite3');

let db = new Sqlite('database.sqlite');


// Modèle "Demandeur"
const Demandeur = {
  create: (nom, prenom, mail, dateNaissance, password, idAdresse, type) => {
    const query = `INSERT INTO demandeur (Nom, Prenom, Mail, DateNaissance, Password, ID_adresse, Type) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const statement = db.prepare(query);
    const result = statement.run(nom, prenom, mail, dateNaissance, password, idAdresse, type);

    return result.lastInsertRowid;
  },

  get: (idDemandeur) => {
    const query = `SELECT * FROM demandeur WHERE ID = ?`;
    const statement = db.prepare(query);
    const result = statement.get(idDemandeur);

    return result;
  },
  getAll: () => {
    const query = `SELECT * FROM demandeur`;
    const statement = db.prepare(query);
    const result = statement.all();
    return result;
  },

  update: (idDemandeur, nom, prenom, mail, dateNaissance, password, idAdresse) => {
    const query = `UPDATE demandeur SET Nom = ?, Prenom = ?, Mail = ?, DateNaissance = ?, Password = ?, ID_adresse = ? WHERE ID = ?`;
    const statement = db.prepare(query);
    statement.run(nom, prenom, mail, dateNaissance, password, idAdresse, idDemandeur);
  },

  delete: (idDemandeur) => {
    const query = `DELETE FROM demandeur WHERE ID = ?`;
    const statement = db.prepare(query);
    statement.run(idDemandeur);
  },
};

// Modèle "Entreprise"
const Entreprise = {
  create: (nom, mail, password, idAdresse, type) => {
    const query = `INSERT INTO entreprise (Nom, Mail, Password, ID_adresse, Type) VALUES (?, ?, ?, ?, ?)`;
    const statement = db.prepare(query);
    const result = statement.run(nom, mail, password, idAdresse, type);

    return result.lastInsertRowid;
  },

  get: (idEntreprise) => {
    const query = `SELECT * FROM entreprise WHERE ID = ?`;
    const statement = db.prepare(query);
    const result = statement.get(idEntreprise);

    return result;
  },

  update: (idEntreprise, nom, mail, password, idAdresse) => {
    const query = `UPDATE entreprise SET Nom = ?, Mail = ?, Password = ?, ID_adresse = ? WHERE ID = ?`;
    const statement = db.prepare(query);
    statement.run(nom, mail, password, idAdresse, idEntreprise);
  },

  delete: (idEntreprise) => {
    const query = `DELETE FROM entreprise WHERE ID = ?`;
    const statement = db.prepare(query);
    statement.run(idEntreprise);
  },
};

// Modèle "Annonce"
const Annonce = {
  create: (titre, dateCreation, description, adresse, idEntreprise, photo, shareLink) => {
    const query = `INSERT INTO annonce (titre, date_creation, description, adresse, id_entreprise, photo, share_link) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const statement = db.prepare(query);
    const result = statement.run(titre, dateCreation, description, adresse, idEntreprise, photo, shareLink);

    return result.lastInsertRowid;
  },
  getAnnon_Enter_Name : () =>{
        const query = `
          SELECT a.titre, a.date_creation, a.description, a.adresse, a.photo, e.nom AS entreprise
          FROM annonce a
          JOIN entreprise e ON a.id_entreprise = e.id
        `;
        const statement = db.prepare(query).all();
        return statement ;
  },

  get: (idAnnonce) => {
    const query = `SELECT * FROM annonce WHERE ID_annonce = ?`;
    const statement = db.prepare(query);
    const result = statement.get(idAnnonce);

    return result;
  },
  getAll: () => {
    const query = `SELECT titre, date_creation, description,adresse ,photo FROM annonce`;
    const statement = db.prepare(query);
    const result = statement.all();
    return result;
  },

  update :(idAnnonce, titre, description, adresse, photo, shareLink) => {
    const query = `UPDATE annonce SET titre = ?, description = ?, adresse = ?, photo = ?, share_link = ? WHERE ID_annonce = ?`;
    const statement = db.prepare(query);
    statement.run(titre, description, adresse, photo, shareLink, idAnnonce);
  },

  delete: (idAnnonce) => {
    const query = `DELETE FROM annonce WHERE ID_annonce = ?`;
    const statement = db.prepare(query);
    statement.run(idAnnonce);
  },
};

// Modèle "Demande"
const Demande = {
  create: (idDemandeur, idAnnonce, datePostulation) => {
    const query = `INSERT INTO demande (ID_demandeur, ID_annonce, date_postulation) VALUES (?, ?, ?)`;
    const statement = db.prepare(query);
    const result = statement.run(idDemandeur, idAnnonce, datePostulation);

    return result.lastInsertRowid;
  },

  get: (idDemande) => {
    const query = `SELECT * FROM demande WHERE ID_demande = ?`;
    const statement = db.prepare(query);
    const result = statement.get(idDemande);

    return result;
  },

  update: (idDemande, idDemandeur, idAnnonce, datePostulation) => {
    const query = `UPDATE demande SET ID_demandeur = ?, ID_annonce = ?, date_postulation = ? WHERE ID_demande = ?`;
    const statement = db.prepare(query);
    statement.run(idDemandeur, idAnnonce, datePostulation, idDemande);
  },

  delete: (idDemande) => {
    const query = `DELETE FROM demande WHERE ID_demande = ?`;
    const statement = db.prepare(query);
    statement.run(idDemande);
  },
};

// Modèle "CV"
const CV = {
  save: (idDemandeur, contenu) => {
    const query = `INSERT INTO CV (ID_demandeur, contenu) VALUES (?, ?)`;
    const statement = db.prepare(query);
    const result = statement.run(idDemandeur, contenu);

    return result.lastInsertRowid;
  },

  get: (idDemandeur) => {
    const query = `SELECT * FROM CV WHERE ID_demandeur = ?`;
    const statement = db.prepare(query);
    const result = statement.get(idDemandeur);

    return result;
  },

  delete: (idDemandeur) => {
    const query = `DELETE FROM CV WHERE ID_demandeur = ?`;
    const statement = db.prepare(query);
    statement.run(idDemandeur);
  },
};

// Modèle "Photo"
const Photo = {
  add: (idDemandeur, path) => {
    const query = `INSERT INTO photo (ID_demandeur, path) VALUES (?, ?)`;
    const statement = db.prepare(query);
    const result = statement.run(idDemandeur, path);

    return result.lastInsertRowid;
  },

  get: (idDemandeur) => {
    const query = `SELECT * FROM photo WHERE ID_demandeur = ?`;
    const statement = db.prepare(query);
    const result = statement.get(idDemandeur);

    return result;
  },

  update: (idDemandeur, path) => {
    const query = `UPDATE photo SET path = ? WHERE ID_demandeur = ?`;
    const statement = db.prepare(query);
    statement.run(path, idDemandeur);
  },

  delete: (idDemandeur) => {
    const query = `DELETE FROM photo WHERE ID_demandeur = ?`;
    const statement = db.prepare(query);
    statement.run(idDemandeur);
  },
};

// Export des modèles
module.exports = {
  Demandeur,
  Entreprise,
  Annonce,
  Demande,
  CV,
  Photo,
};
