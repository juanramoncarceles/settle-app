// Objetos de aplicación
const express = require("express");
const bodyParser = require("body-parser");
const modelRouter = express.Router();

// Acceso a base de datos
const MongoClient = require("mongodb").MongoClient;
const dbOPS = require("../operations");
const DBNAME = "GastosAppDB";
const URL = `mongodb://localhost:27017/${DBNAME}`;

// necesario para leer el contenido del body si se envía urlencoded
modelRouter.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// variables que recibiran el contenido de 'req.databox.collection'
let theCollection = "";
let createDocument, updateDocument;

// RUTAS VINCULADAS A 'collection/'
modelRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Content-Type", "application/json");
    theCollection = req.databox.collection;
    createDocument = req.databox.createDocument;
    next();
  })
  // GET 'collection/' devuelve todos los documentos de esa coleccion
  .get((req, res, next) => {
    MongoClient.connect(
      URL,
      { useNewUrlParser: true }
    )
      .then(client => {
        console.log("Conectado al servidor");
        const db = client.db(DBNAME);
        dbOPS
          .findDocuments(db, theCollection)
          .then(docs => {
            client.close();
            res.end(JSON.stringify(docs));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  })
  // POST 'collection/' inserta un nuevo documento en esa coleccion
  .post((req, res, next) => {
    MongoClient.connect(
      URL,
      { useNewUrlParser: true }
    )
      .then(client => {
        const db = client.db(DBNAME);
        // 'createDocument' procede de un router específico
        let nuevoDocumento = createDocument(req);
        dbOPS
          .insertDocument(db, theCollection, nuevoDocumento)
          .then(() => {
            client.close();
            res.end(JSON.stringify(nuevoDocumento));
          })
          .catch(err => {
            res.end(JSON.stringify({ errmsg: `Error creando documento` }));
            console.log(err);
          });
      })
      .catch(err => {
        res.end(JSON.stringify({ errmsg: `Error creando documento` }));
        console.log(err);
      });
  })
  // PUT 'collection/' no soportado
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end({ errmsg: `PUT no soportado sin id` });
  })
  // DELETE 'collection/' borra toda la colección
  .delete((req, res, next) => {
    MongoClient.connect(
      URL,
      { useNewUrlParser: true }
    )
      .then(client => {
        const db = client.db(DBNAME);
        dbOPS
          .removeCollection(db, theCollection)
          .then(doc => {
            client.close();
            res.end(JSON.stringify(doc));
          })
          .catch(err => {
            res.end(
              JSON.stringify({ errmsg: `Error borrando ${theCollection}` })
            );
            console.log(err);
          });
      })
      .catch(err => {
        res.end(JSON.stringify({ errmsg: `Error borrando ${theCollection}` }));
        console.log(err);
      });
  })
  .options((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, OPTIONS, DELETE"
    );
    res.end();
  });

// RUTAS VINCULADAS A '/collection/id'
modelRouter
  .route("/:idField")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Content-Type", "application/json");
    theCollection = req.databox.collection;
    updateDocument = req.databox.updateDocument;
    next();
  })
  // GET 'collection/id' devuelve un documento por su id
  .get((req, res) => {
    MongoClient.connect(
      URL,
      { useNewUrlParser: true }
    )
      .then(client => {
        const db = client.db(DBNAME);
        dbOPS
          .findDocumentById(db, theCollection, req.params.idField)
          .then(doc => {
            client.close();
            res.end(JSON.stringify(doc));
          })
          .catch(err => {
            res.end(JSON.stringify({ errmsg: `Error obteniendo registro` }));
            console.log(err);
          });
      })
      .catch(err => {
        res.end(JSON.stringify({ errmsg: `Error obteniendo registro` }));
        console.log(err);
      });
  })
  // POST 'collection/id' no soportado
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(JSON.stringify({ errmsg: `POST no acepta id` }));
  })
  // PUT 'collection/id' modifica el contenido de un documento
  .put((req, res, next) => {
    MongoClient.connect(
      URL,
      { useNewUrlParser: true }
    )
      .then(client => {
        const db = client.db(DBNAME);
        // 'updateDocument' procede de un router específico
        let nuevosDatos = updateDocument(req);
        dbOPS
          .updateDocumentById(
            db,
            theCollection,
            req.params.idField,
            nuevosDatos
          )
          .then(doc => {
            client.close();
            res.end(JSON.stringify(doc));
          })
          .catch(err => {
            res.end(JSON.stringify({ errmsg: `Error actualizando` }));
            console.log(err);
          });
      })
      .catch(err => {
        res.end(JSON.stringify({ errmsg: `Error actualizando` }));
        console.log(err);
      });
  })
  // DELETE 'collection/id' borra un documento por su id
  .delete((req, res, next) => {
    MongoClient.connect(
      URL,
      { useNewUrlParser: true }
    )
      .then(client => {
        const db = client.db(DBNAME);
        dbOPS
          .removeDocumentById(db, theCollection, req.params.idField)
          .then(doc => {
            client.close();
            res.end(JSON.stringify(doc));
          })
          .catch(err => {
            res.end(JSON.stringify({ errmsg: "Error borrando registro" }));
            console.log(err);
          });
      })
      .catch(err => {
        res.end(JSON.stringify({ errmsg: "Error borrando registro" }));
        console.log(err);
      });
  })
  .options((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, OPTIONS, DELETE"
    );
    res.end();
  });

// I export all the methods
module.exports = modelRouter;
