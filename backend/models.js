// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'sidy',
//   password: 'B@dji78sidyF',
//   database: 'badji'
// });
// const getUserByEmail = (email) => {
//   return new Promise((resolve, reject) => {
//     const query = 'SELECT * FROM Users WHERE email = ?';
//     const values = [email];

//     connection.query(query, values, (err, results) => {
//       if (err) {
//         console.error(err);
//         reject(err);
//         return;
//       }

//       if (results.length > 0) {
//         const user = results[0];
//         resolve(user);
//       } else {
//         resolve(null); // Aucun utilisateur trouvé
//       }
//     });
//   });
// };
// const login = (email, password) => {
//   return new Promise((resolve, reject) => {
//     const query = 'SELECT email, password FROM Users WHERE email = ? AND password = ?';
//     const values = [email, password];
  
//     connection.query(query, values, (err, results) => {
//       if (err) {
//         console.error(err);
//         reject(err);
//         return;
//       }
      
//       if (results.length > 0) {
//         const user = results[0];
//         resolve(user); // Les identifiants sont valides, renvoie l'objet utilisateur
//       } else {
//         resolve(-1); // Les identifiants sont invalides
//       }
//     });
//   });
// };


// const Users = {

// createUser :(username, email, password, roleName) => {
//     return new Promise((resolve, reject) => {
//         const query = `INSERT INTO Users (username, email, password)
//             VALUES (?, ?, ?)`;
//         const values = [username, email, password];

//         connection.query(query, values, (err, results) => {
//         if (err) {
//         console.error(err);
//         reject(err);
//         return;
//         }
//         const roleQuery = `INSERT INTO UserRoles (user_id, role_id)
//         VALUES (?, (SELECT role_id FROM Roles WHERE role_name = ?))`;
//         const roleValues = [userId, roleName];

//         connection.query(roleQuery, roleValues, (err, roleResults) => {
//         if (err) {
//         console.error(err);
//         reject(err);
//         return;
//     }

//     const isCreated = roleResults.affectedRows > 0;
//     resolve(isCreated);});
//         });
//     })
// },
//   deleteUser : (userId)=>{
//      return new Promise((resolve, reject) => {
//     const query = `DELETE FROM Users WHERE user_id = ?`;
//     const values = [userId];

//     connection.query(query, values, (err, results) => {
//       if (err) {
//         console.error(err);
//         reject(err);
//         return;
//       }

//       // Vérifie si des lignes ont été affectées par la requête
//       const isDeleted = results.affectedRows > 0;
//       resolve(isDeleted);
//     });
//   });
//   },
//   updateUser :(userId)=> {
//     return new Promise((resolve, reject) => {
//     const query = `UPDATE Users SET name = ?, lastname = ?, tel = ?, email = ?, password = ? WHERE user_id = ?`;
//     const values = [updatedUser.name, updatedUser.lastname, updatedUser.tel, updatedUser.email, updatedUser.password, userId];

//     connection.query(query, values, (err, results) => {
//       if (err) {
//         console.error(err);
//         reject(err);
//         return;
//       }

//       // Vérifie si des lignes ont été affectées par la requête
//       const isUpdated = results.affectedRows > 0;
//       const status = isUpdated ? 1 : -1;
//       resolve(status);
//     });
//   });
//   },
//   getUser : (userId)=>{
//       return new Promise((resolve, reject) => {
//     const query = `SELECT name, lastname, tel, email, password FROM Users WHERE user_id = ?`;
//     const values = [userId];

//     connection.query(query, values, (err, results) => {
//       if (err) {
//         console.error(err);
//         reject(err);
//         return;
//       }
//       resolve(results[0]); // Renvoie le premier utilisateur trouvé
//     });
//   });
// }

// }


// const UserRole = {
//     getUserRole : (userId) => {
//         return new Promise((resolve, reject) => {
//           const query = `SELECT Roles.role_name
//                          FROM UserRoles
//                          INNER JOIN Roles ON UserRoles.role_id = Roles.role_id
//                          WHERE UserRoles.user_id = ?`;
//           const values = [userId];
      
//           connection.query(query, values, (err, results) => {
//             if (err) {
//               console.error(err);
//               reject(err);
//               return;
//             }
      
//             if (results.length > 0) {
//               const roleName = results[0].role_name;
//               resolve(roleName);
//             } else {
//               resolve(-1); // Aucun rôle trouvé pour l'utilisateur
//             }
//           });
//         })
//     },
//     updateUserRole : (userId, roleName) => {
//         return new Promise((resolve, reject) => {
//           const query = `UPDATE UserRoles
//                          INNER JOIN Roles ON UserRoles.role_id = Roles.role_id
//                          SET Roles.role_name = ?
//                          WHERE UserRoles.user_id = ?`;
//           const values = [roleName, userId];
      
//           connection.query(query, values, (err, results) => {
//             if (err) {
//               console.error(err);
//               reject(err);
//               return;
//             }
      
//             const isUpdated = results.affectedRows > 0;
//             resolve(isUpdated);
//           });
//         });
//     }
 
// }

// const Services = {
//   createService : (userId, serviceTitle, serviceDescription, dateStart) => {
//     return new Promise((resolve, reject) => {
//       const query = `INSERT INTO Services (user_id, service_title, service_description, date_start)
//                      VALUES (?, ?, ?, ?)`;
//       const values = [userId, serviceTitle, serviceDescription, dateStart];
  
//       connection.query(query, values, (err, results) => {
//         if (err) {
//           console.error(err);
//           reject(err);
//           return;
//         }
  
//         const serviceId = results.insertId;
//         if (serviceId) {
//           resolve(serviceId);
//         } else {
//           resolve(-1); // Échec de la création du service
//         }
//       });
//     });

//   },
//   deleteService :(serviceId) => {
//     return new Promise((resolve, reject) => {
//       const query = `DELETE FROM Services WHERE service_id = ?`;
//       const values = [serviceId];
  
//       connection.query(query, values, (err, results) => {
//         if (err) {
//           console.error(err);
//           reject(err);
//           return;
//         }
  
//         const isDeleted = results.affectedRows > 0;
//         resolve(isDeleted);
//       });
//     });
//   }
//   ,
//   updateService : (serviceId, serviceTitle, serviceDescription, dateStart) => {
//     return new Promise((resolve, reject) => {
//       const query = `UPDATE Services
//                      SET service_title = ?, service_description = ?, date_start = ?
//                      WHERE service_id = ?`;
//       const values = [serviceTitle, serviceDescription, dateStart, serviceId];
  
//       connection.query(query, values, (err, results) => {
//         if (err) {
//           console.error(err);
//           reject(err);
//           return;
//         }
  
//         const isUpdated = results.affectedRows > 0;
//         resolve(isUpdated);
//       });
//     });
//   }
//   ,
//   getService : (serviceId) => {
//     return new Promise((resolve, reject) => {
//       const query = `SELECT * FROM Services WHERE service_id = ?`;
//       const values = [serviceId];
  
//       connection.query(query, values, (err, results) => {
//         if (err) {
//           console.error(err);
//           reject(err);
//           return;
//         }
  
//         if (results.length > 0) {
//           const service = results[0];
//           resolve(service);
//         } else {
//           resolve(null); // Aucun service trouvé avec cet ID
//         }
//       });
//     });
//   },
//   getAllServices : ()=>{
//     return new Promise((resolve, reject) => {
//       const query = `SELECT * FROM Services`;
  
//       connection.query(query, (err, results) => {
//         if (err) {
//           console.error(err);
//           reject(err);
//           return;
//         }
  
//         if (results.length > 0) {
//           resolve(results);
//         } else {
//           resolve([]); // Aucun service trouvé
//         }
//       });
//     });
//   },
//   shareService : (serviceId, sharedWith) => {
//     return new Promise((resolve, reject) => {
//       const query = `INSERT INTO ShareService (service_id, shared_with) VALUES (?, ?)`;
//       const values = [serviceId, sharedWith];
  
//       connection.query(query, values, (err, results) => {
//         if (err) {
//           console.error(err);
//           reject(err);
//           return;
//         }
  
//         const isShared = results.affectedRows > 0;
//         resolve(isShared);
//       });
//     });

//   }
    
// }

const Sqlite = require('better-sqlite3');
let db = new Sqlite('database.sqlite');

// Modèle "Demandeur"
const Demandeur = {
  create: (nom, prenom, mail, dateNaissance, password, idAdresse, type) => {
    const query = `INSERT INTO demandeur (Nom, Prenom, Mail, DateNaissance, Password, ID_adresse, Type) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [nom, prenom, mail, dateNaissance, password, idAdresse, type];

    const statement = db.prepare(query);
    const result = statement.run(values);

    return result.lastInsertRowid;
  },

  get: (idDemandeur) => {
    const query = `SELECT ID ,Nom ,Prénom ,Mail ,Date_naissance ,Lieu_de_naissance FROM demandeur WHERE ID = ?`;
    const statement = db.prepare(query);
    const result = statement.get(idDemandeur);

    return result || -1;
  },

  update: (idDemandeur, nom, prenom, mail, dateNaissance, password, idAdresse) => {
    const query = `UPDATE demandeur SET Nom = ?, Prenom = ?, Mail = ?, DateNaissance = ?, Password = ?, ID_adresse = ? WHERE ID = ?`;
    const values = [nom, prenom, mail, dateNaissance, password, idAdresse, idDemandeur];

    const statement = db.prepare(query);
    const result = statement.run(values);

    return result.changes > 0;
  },

  delete: (idDemandeur) => {
    const query = `DELETE FROM demandeur WHERE ID = ?`;
    const statement = db.prepare(query);
    const result = statement.run(idDemandeur);

    return result.changes > 0;
  },
};

// Modèle "Entreprise"
const Entreprise = {
  create : (nom, mail, password, idAdresse, type) => {
    const query = `INSERT INTO entreprise (Nom, Mail, Password, ID_adresse, Type) VALUES (?, ?, ?, ?, ?)`;
    const values = [nom, mail, password, idAdresse, type];

    const statement = db.prepare(query);
    const result = statement.run(values);

    return result.lastInsertRowid;
  },

  get : (idEntreprise) => {
    const query = `SELECT ID, Nom, Mail, ID_adresse FROM entreprise WHERE ID = ?`;
    const statement = db.prepare(query);
    
    const result = statement.get(idEntreprise);
    
    return result;
  },
  getFromIdAnnonce :(id_ann)=>{
    const query = `SELECT ID, Nom, Mail, ID_adresse FROM entreprise WHERE ID_annonce = ?`;
    const statement = db.prepare(query);
    
    const result = statement.get(id_ann);
    console.log(id_ann)
    return result;

  },

  update : (idEntreprise, nom, mail, password, idAdresse) => {
    const query = `UPDATE entreprise SET Nom = ?, Mail = ?, Password = ?, ID_adresse = ? WHERE ID = ?`;
    const values = [nom, mail, password, idAdresse, idEntreprise];

    const statement = db.prepare(query);
    const result = statement.run(values);

    return result.changes > 0;
  },

  delete: (idEntreprise) => {
    const query = `DELETE FROM entreprise WHERE ID = ?`;
    const statement = db.prepare(query);
    const result = statement.run(idEntreprise);

    return result.changes > 0;
  },
};

// Modèle "Annonce"
const Annonce = {
  create: (titre, dateCreation, description, adresse, idEntreprise, photo, shareLink) => {
    const query = `INSERT INTO annonce (titre, date_creation, description, adresse, id_entreprise, photo, share_link) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [titre, dateCreation, description, adresse, idEntreprise, photo, shareLink];

    const statement = db.prepare(query);
    const result = statement.run(values);

    return result.lastInsertRowid;
  },

  get: (idAnnonce) => {
    const query = `SELECT * FROM annonce WHERE ID_annonce = ?`;
    const statement = db.prepare(query);
    const result = statement.get(idAnnonce);

    return result || -1;
  },

  update: (idAnnonce, titre, dateCreation, description, adresse, idEntreprise, photo, shareLink) => {
    const query = `UPDATE annonce SET titre = ?, date_creation = ?, description = ?, adresse = ?, id_entreprise = ?, photo = ?, share_link = ? WHERE ID_annonce = ?`;
    const values = [titre, dateCreation, description, adresse, idEntreprise, photo, shareLink, idAnnonce];

    const statement = db.prepare(query);
    const result = statement.run(values);

    return result.changes > 0;
  },

  delete: (idAnnonce) => {
    const query = `DELETE FROM annonce WHERE ID_annonce = ?`;
    const statement = db.prepare(query);
    const result = statement.run(idAnnonce);

    return result.changes > 0;
  },
  getAll :()=>{
    const query = 'Select * From annonce ' ;
    const prep =db.prepare(query).all();
    return prep ;

  },
  getAnEntrepriseAllAno :(idEntreprise)=>{
    const stmt = db.prepare('select * from annonce where id_entreprise = ? ') ;
    const myAnnonces = stmt.all(idEntreprise);
    if(myAnnonces.length >0 ){
      return myAnnonces ;
    }else {
      return 0 ;
    }

  } ,

  share: (idAnnonce, idEntreprise) => {
    // Récupérer l'URL de la page de l'annonce
    const annonceURL = getAnnonceURL(idAnnonce);

    const query = `UPDATE annonce SET share_link = ? WHERE ID_annonce = ? AND id_entreprise = ?`;
    const values = [annonceURL, idAnnonce, idEntreprise];

    const statement = db.prepare(query);
    const result = statement.run(values);

    return result.changes > 0 ? annonceURL : -1;
  },
};

// Modèle "Demande"
const Demande = {
  create: (idDemandeur, idAnnonce, state) => {
    const query = `INSERT INTO demande (id_demandeur, id_annonce, state) VALUES (?, ?, ?)`;
    const values = [idDemandeur, idAnnonce, state];

    const statement = db.prepare(query);
    const result = statement.run(values);

    return result.lastInsertRowid;
  },

  get : (idDemandeur) => {
  
    const query = `
    SELECT annonce.titre, annonce.date_creation, annonce.description, annonce.adresse , demande.state,
    demande.id_dm
    FROM demande
    INNER JOIN annonce ON demande.id_annonce = annonce.ID_annonce
    WHERE demande.id_demandeur = ?;
  `;

  const annonces = db.prepare(query).all(idDemandeur);
  return annonces;
    
} ,

getState  : (id)=>{
  const query = 'select state from demande where id_dm = ? ' ;
  const stmt = db.prepare(query).get(id);
  return stmt.state;

},
getDmTitle  : (id)=>{
  const query = `
    SELECT annonce.titre,annonce.ID_annonce,
    demande.id_dm ,demande.id_demandeur
    FROM demande
    INNER JOIN annonce ON demande.id_annonce = annonce.ID_annonce
    WHERE demande.id_dm = ?;
  `;
  const annonces = db.prepare(query).get(id);
  return annonces;
 
}
  ,
  getAll :()=>{
    const stm ='select * from demande ' ;
    return db.prepare(stm).all() ;
  } ,
  getAnnDemande :(idann)=>{
    const stmt = 'SELECT * FROM demande WHERE id_annonce = ?';
    const demandeurs = db.prepare(stmt).all(idann);
    
    const stm_id_dm = 'SELECT chemin_fichier FROM CV WHERE demandeur_id = ?';
    const demandeursAvecCV = demandeurs.map((demandeur) => {
      const cheminFichierCV = db.prepare(stm_id_dm).get(demandeur.id_demandeur);
    
      // Ajoutez ici la requête pour récupérer le nom, prénom et email du demandeur
      const stm_info_demandeur = 'SELECT Nom, Prénom, Mail FROM demandeur WHERE id = ?';
      const infoDemandeur = db.prepare(stm_info_demandeur).get(demandeur.id_demandeur);
    
      return {
        ...demandeur,
        ...infoDemandeur,
        cheminCV: cheminFichierCV ? cheminFichierCV.chemin_fichier : null,
      };
    });
     return demandeursAvecCV ;
  },

  update: (idDemande, idDemandeur, idAnnonce, state) => {
    const query = `UPDATE demande SET id_demandeur = ?, id_annonce = ?, state = ? WHERE id_dm = ?`;
    const values = [idDemandeur, idAnnonce, state, idDemande];

    const statement = db.prepare(query);
    const result = statement.run(values);

    return result.changes > 0;
  },
  setState :(id_dem,state) =>{
    const stm ='Update demande set state = ? where id_dm = ?'
    const prep = db.prepare(stm).run(state,id_dem);
    return prep ? prep.changes >1 : -1 ;

  } ,

  delete: (idDemande) => {
    const query = `DELETE FROM demande WHERE id_dm = ?`;
    const statement = db.prepare(query);
    const result = statement.run(idDemande);

    return result.changes > 0;
  },
};

// Modèle "CV"
const CV = {
  save: (demandeurId, cheminFichier) => {
    const query = 'INSERT INTO CV (demandeur_id, chemin_fichier) VALUES (?, ?)';
    const values = [demandeurId, cheminFichier];

    const statement = db.prepare(query);
    const result = statement.run(values);

    return result.lastInsertRowid;
  },

  getCVFilePath: (cvId) => {
    const query = 'SELECT chemin_fichier FROM CV WHERE cv_id = ?';
    const statement = db.prepare(query);
    const result = statement.get(cvId);

    return result ? result.chemin_fichier : -1;
  },

  deleteCV: (cvId) => {
    const query = 'DELETE FROM CV WHERE cv_id = ?';
    const statement = db.prepare(query);
    const result = statement.run(cvId);

    return result.changes > 0;
  },
};

// Modèle "Photo"
const Photo = {
  ajouterPhotoDemandeur: (demandeurId, cheminFichier) => {
    const query = 'INSERT INTO photo (chemin_fichier) VALUES (?)';
    const values = [cheminFichier];

    const photoStatement = db.prepare(query);
    const photoResult = photoStatement.run(values);
    const photoId = photoResult.lastInsertRowid;

    const demandeInsertion = 'INSERT INTO demandeur_photo (demandeur_id, photo_id) VALUES (?, ?)';
    const demandeValues = [demandeurId, photoId];

    const demandeStatement = db.prepare(demandeInsertion);
    const demandeResult = demandeStatement.run(demandeValues);

    return photoResult.changes > 0 ? photoId : -1;
  },

  get: (photoId) => {
    const query = 'SELECT * FROM photo WHERE photo_id = ?';
    const statement = db.prepare(query);
    const result = statement.get(photoId);

    return result || -1;
  },

  delete: (photoId) => {
    const query = 'DELETE FROM photo WHERE photo_id = ?';
    const statement = db.prepare(query);
    const result = statement.run(photoId);

    return result.changes > 0;
  },

  update: (photoId, nouveauChemin) => {
    const query = 'UPDATE photo SET chemin_fichier = ? WHERE photo_id = ?';
    const values = [nouveauChemin, photoId];

    const statement = db.prepare(query);
    const result = statement.run(values);

    return result.changes > 0;
  },
};


const Categorie ={
  addCategorie :(categorie)=>{
    const query = 'INSERT INTO categorie(name ) VALUES (? )' ;
    db.run(query, categorie, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });

  },
  getAll: () => {
    const query = `SELECT * FROM categorie`;
    return db.prepare(query).all();
  },
  
  getAllSub: () => {
    const query = `SELECT * FROM sous_categories`;
    return db.prepare(query).all();
  } ,

  getCategoriesWithSubcategories: () => {
    const query = `
      SELECT c.name AS category, s.name AS subcategory
      FROM categorie AS c
      LEFT JOIN sous_categories AS s ON c.id = s.category_id
    `;
    return db.prepare(query).all();
  }
  
  ,
   getAnnoncesByCategory : (category) => {
    const query = 'SELECT * FROM annonces WHERE categorie = ?';
    const statement = db.prepare(query);
    const annonces = statement.all(category);
  
    return annonces;
  } ,

    // Fonction pour récupérer les annonces par catégorie et sous-catégorie

  getAnnoncesByCategoryAndSubcategory: (category, subcategory) => {
    const query = 'SELECT * FROM annonces WHERE category = ? AND subcategory = ?';
    const statement = db.prepare(query);
    const result = statement.all(category, subcategory);

    return result || [];
  }
}

// Fonction de connexion
const loginEntreprise = (email, password) => {
  const statement = db.prepare('select ID,Nom from entreprise where Mail = ? and Password  = ?  ');
  const results = statement.get(email,password);

  if (!results) {
    return -1; // Utilisateur non trouvé // info non correct 
  } 
  return results
};


const loginDemandeur = (email, password) => {
  const statement = db.prepare('select ID,Nom from demandeur where Mail = ? and Password  = ?  ');
  const results = statement.get(email,password);

  if (!results) {
    return -1; // Utilisateur non trouvé // info non correct 
  } 
  return results
};

// Fonction utilitaire pour récupérer l'URL de la page de l'annonce
function getAnnonceURL(idAnnonce) {
  // Implémentation pour récupérer l'URL de la page de l'annonce
  // ...

  return `http://example.com/annonces/${idAnnonce}`; // Exemple d'URL de la page de l'annonce
}



const Reponse = {
  Entreprise_details :(id_rep)=>{
    const query =' select id_entreprise from response where id = ?'
    const id = db.prepare(query).get(id_rep);
    console.log(id)
    const entreprise = Entreprise.get(id.id_entreprise);
  },
  get : (id_dm)=>{
    const stmt = 'select reponse from response where id_dm = ?'
    const  reponse = db.prepare(stmt).get(id_dm);
    console.log(reponse)
    return reponse ? reponse : null ;
  },

  answer: (id_dm,id_ent, rep) => {
    const query = 'INSERT INTO response (id_dm, reponse,id_entreprise) VALUES (?, ? ,?)';
    const reponseId = db.prepare(query).run(id_dm, rep,id_ent);
    return reponseId.changes > 0;
  }
  ,
  updateAnswer: (id_dm, newResponse) => {
    const query = 'UPDATE response SET reponse = ? WHERE id_dm = ?';
    const result = db.prepare(query).run(newResponse, id_dm);
    return result.changes > 0;
  }
  
,
deleteAnswer: (id_dm) => {
  const query = 'DELETE FROM response WHERE id_dm = ?';
  const result = db.prepare(query).run(id_dm);
  return result.changes > 0;
}


}



const Immobiliere = {
  ajouter: (data) => {
    const insertStatement = db.prepare(`
      INSERT INTO annonce_immobilier (
        titre, date_creation, description, adresse, id_entreprise, id_photo, categorie_id, subcategorie_id,
        typeAnnonce, surfaceHabitable, surfaceTerrain, prix, nbPieces, anneeConstruction, etage, ascenseur,
        balconTerrasse, nbSallesDeBains, nbChambres, climatisation, parkingGarage, etatBien,
        disponibilite, prix
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertStatement.run(
      data.titre, data.date_creation, data.description, data.adresse, data.id_entreprise, data.id_photo,
      data.categorie_id, data.subcategorie_id, data.typeAnnonce, data.surfaceHabitable, data.surfaceTerrain,
      data.prix, data.nbPieces, data.anneeConstruction, data.etage, data.ascenseur, data.balconTerrasse,
      data.nbSallesDeBains, data.nbChambres, data.climatisation, data.parkingGarage, data.etatBien,
      data.disponibilite, data.prix
    );

    return result.lastInsertRowid;
  },

  update: (id, data) => {
    const updateStatement = db.prepare(`
      UPDATE annonce_immobilier
      SET titre = ?, description = ?, ...
      WHERE id = ?
    `);

    const result = updateStatement.run(
      data.titre, data.description, ... id
    );

    return result.changes;
  },

  delete: (id) => {
    const deleteStatement = db.prepare(`
      DELETE FROM annonce_immobilier WHERE id = ?
    `);

    const result = deleteStatement.run(id);
    return result.changes;
  },

  getImmo: (souscategorie) => {
    const selectStatement = db.prepare(`
      SELECT * FROM annonce_immobilier WHERE subcategorie_id = ?
    `);

    const rows = selectStatement.all(souscategorie);

    if (rows.length > 0) {
      return rows;
    } else {
      return -1;
    }
  },

  getAnnonce: (id) => {
    const selectStatement = db.prepare(`
      SELECT * FROM annonce_immobilier WHERE id = ?
    `);

    return selectStatement.get(id);
  },

  getwithCategorie: (souscategorie) => {
    const selectStatement = db.prepare(`
      SELECT * FROM annonce_immobilier WHERE subcategorie_id = ?
    `);

    return selectStatement.all(souscategorie);
  },

  getSub: () => {
    const selectStatement = db.prepare(`
    SELECT DISTINCT c.name AS category, s.name AS subcategory
    FROM categorie c
    LEFT JOIN sous_categories s ON c.ID = s.category_id
    WHERE c.name = 'Immobilier';    `);

    return selectStatement.all();
  }
};




const Emploi = {
  getAll: (type) => {
    const statement = db.prepare(`
      SELECT * FROM annonce_emploi WHERE typeEmploi = ?
    `);
    
    const rows = statement.all(type);
    
    if (rows.length > 0) {
      return rows;
    } else {
      return -1;
    }
  },

  insertEmploiAnnonce: (data) => {
    const insertStatement = db.prepare(`
      INSERT INTO annonce_emploi (
        titre, date_annonce, description, adresse, id_entreprise, photo, categorie_id, subcategorie_id,
        typeEmploi, salaire, niveauEtude, experience, competences, avantages, dateDebut, modalitesCandidature,
        PosteRecherchee, domaineActivite, niveauExperience, niveauEtudes, competences, disponibilite,
        typeContrat, langues, lieux
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStatement.run(
      data.titre, data.date_annonce, data.description, data.adresse, data.id_entreprise, data.photo,
      data.categorie_id, data.subcategorie_id, data.typeEmploi, data.salaire, data.niveauEtude,
      data.experience, data.competences, data.avantages, data.dateDebut, data.modalitesCandidature,
      data.PosteRecherchee, data.domaineActivite, data.niveauExperience, data.niveauEtudes, data.competences,
      data.disponibilite, data.typeContrat, data.langues, data.lieux
    );
  },

  updateAnnonceEmploi: (data) => {
    const updateStatement = db.prepare(`
      UPDATE annonce_emploi
      SET titre = ?, description = ?, ...
      WHERE id = ?
    `);

    updateStatement.run(
      data.titre, data.description, ...  data.id
    );
  },

  get: (typeEmploi) => {
    const statement = db.prepare(`
      SELECT * FROM annonce_emploi WHERE typeEmploi = ?
    `);
    
    return statement.all(typeEmploi);
  },

  getTypesEmploi: () => {
    const statement = db.prepare(`
      SELECT DISTINCT typeContrat FROM annonce_emploi
    `);
    
    return statement.all();
  },

  getSub: (categorieId) => {
    const statement = db.prepare(`
    SELECT DISTINCT c.name AS category, s.name AS subcategory
    FROM categorie c
    LEFT JOIN sous_categories s ON c.ID = s.category_id
    WHERE c.name = 'Emplois';    `);
    
    return statement.all(categorieId);
  }
  ,
  updateAnnonceEmploi: (data) => {
    const updateStatement = db.prepare(`
      UPDATE annonce_emploi
      SET titre = ?, description = ?, adresse = ?, id_entreprise = ?, photo = ?,
          categorie_id = ?, subcategorie_id = ?, typeEmploi = ?, salaire = ?, 
          niveauEtude = ?, experience = ?, competences = ?, avantages = ?, dateDebut = ?, 
          modalitesCandidature = ?, PosteRecherchee = ?, domaineActivite = ?, 
          niveauExperience = ?, niveauEtudes = ?, competences = ?, disponibilite = ?, 
          typeContrat = ?, langues = ?, lieux = ?
      WHERE id = ?
    `);
  
    updateStatement.run(
      data.titre, data.description, data.adresse, data.id_entreprise, data.photo,
      data.categorie_id, data.subcategorie_id, data.typeEmploi, data.salaire,
      data.niveauEtude, data.experience, data.competences, data.avantages, data.dateDebut,
      data.modalitesCandidature, data.PosteRecherchee, data.domaineActivite, data.niveauExperience,
      data.niveauEtudes, data.competences, data.disponibilite, data.typeContrat, data.langues,
      data.lieux, data.id
    );
  },
  
};



const Vehicule = {
  insertVehiculeAnnonce: (data) => {
    const insertStatement = db.prepare(`
      INSERT INTO annonce_vehicule (
        titre, date_creation, description, adresse, id_entreprise, id_photo, categorie_id, subcategorie_id,
        typeVehicule, marque, modele, model_year, circulation, kilometrage, carburant,
        prix, cylindre, etat, disponibilite
      )
      VALUES (@titre, @date_creation, @description, @adresse, @id_entreprise, @id_photo, @categorie_id, @subcategorie_id,
        @typeVehicule, @marque, @modele, @model_year, @circulation, @kilometrage, @carburant,
        @prix, @cylindre, @etat, @disponibilite
      )
    `);

    const result = insertStatement.run(data);
    return result;
  },

  getAll: (subcategorie) => {
    const query = db.prepare(`
      SELECT * FROM annonce_vehicule WHERE subcategorie_id = @subcategorie
    `);

    const annonces = query.all({ subcategorie });
    return annonces.length ? annonces : -1;
  },

  getTypesofVehicule: (subcategorie, typeVehicule) => {
    const query = db.prepare(`
      SELECT * FROM annonce_vehicule WHERE subcategorie_id = @subcategorie AND typeVehicule = @typeVehicule
    `);

    const annonces = query.all({ subcategorie, typeVehicule });
    return annonces.length ? annonces : -1;
  },

  getSub: (categorie_id) => {
    const query = db.prepare(`
    SELECT DISTINCT c.name AS category, s.name AS subcategory
    FROM categorie c
    LEFT JOIN sous_categories s ON c.ID = s.category_id
    WHERE c.name = 'Véhicules';    `);

    const subcategories = query.all({ categorie_id });
    return subcategories.length ? subcategories : -1;
  },

  updateVehicule: (id, data) => {
    const updateStatement = db.prepare(`
      UPDATE annonce_vehicule SET
      titre = @titre,
      date_creation = @date_creation,
      description = @description,
      adresse = @adresse,
      id_entreprise = @id_entreprise,
      id_photo = @id_photo,
      categorie_id = @categorie_id,
      subcategorie_id = @subcategorie_id,
      typeVehicule = @typeVehicule,
      marque = @marque,
      modele = @modele,
      model_year = @model_year,
      circulation = @circulation,
      kilometrage = @kilometrage,
      carburant = @carburant,
      prix = @prix,
      cylindre = @cylindre,
      etat = @etat,
      disponibilite = @disponibilite
      WHERE id = @id
    `);

    const result = updateStatement.run({ ...data, id });
    return result;
  },

  deleteVehicule: (id) => {
    const deleteStatement = db.prepare(`
      DELETE FROM annonce_vehicule WHERE id = @id
    `);

    const result = deleteStatement.run({ id });
    return result;
  },
};
const Maison = {
  ajouter: (data) => {
    const insertStatement = db.prepare(`
      INSERT INTO annonce_maison (
        titre, description, prix, etat, id_photo, adresse, date_creation,
        marque, modele, annee_fabrication, couleur, dimensions, disponibilite, prix_autre
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertStatement.run(
      data.titre, data.description, data.prix, data.etat, data.id_photo, data.adresse,
      data.date_creation, data.marque, data.modele, data.annee_fabrication, data.couleur,
      data.dimensions, data.disponibilite, data.prix_autre
    );

    return result.lastInsertRowid;
  },

  update: (data) => {
    const updateStatement = db.prepare(`
      UPDATE annonce_maison
      SET titre = ?, description = ?, prix = ?, etat = ?, id_photo = ?,
          adresse = ?, date_creation = ?, marque = ?, modele = ?,
          annee_fabrication = ?, couleur = ?, dimensions = ?, disponibilite = ?, prix_autre = ?
      WHERE id = ?
    `);

    updateStatement.run(
      data.titre, data.description, data.prix, data.etat, data.id_photo, data.adresse,
      data.date_creation, data.marque, data.modele, data.annee_fabrication, data.couleur,
      data.dimensions, data.disponibilite, data.prix_autre, data.id
    );
  },

  delete: (id) => {
    const deleteStatement = db.prepare(`
      DELETE FROM annonce_maison
      WHERE id = ?
    `);

    deleteStatement.run(id);
  },

  getAll: () => {
    const statement = db.prepare(`
      SELECT * FROM annonce_maison
    `);

    return statement.all();
  },

  getSub: () => {
    const statement = db.prepare(`
    SELECT DISTINCT c.name AS category, s.name AS subcategory
    FROM categorie c
    LEFT JOIN sous_categories s ON c.ID = s.category_id
    WHERE c.name = 'Maison';
    `);

    return statement.all();
  }
};






module.exports = { Demandeur, Entreprise, Annonce, Demande, CV, Photo, Vehicule, Emploi,Immobiliere,Maison, loginEntreprise ,loginDemandeur,Categorie ,Reponse};
