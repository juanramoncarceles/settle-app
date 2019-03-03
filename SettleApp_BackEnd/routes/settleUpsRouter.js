const ObjectID = require("mongodb").ObjectID;
const express = require("express");
const bodyParser = require("body-parser");
const modelRouter = express.Router();

// Generic router
const genericRouter = require("./genericRouter");

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

//---- COLECCION ACTUAL -----
const theCollection = "settleUps";

// funciones específicas CRUD para "settleUps"
// se envían a genericRouter
const createDocument = req => {
  console.log(req.body);
  return {
    creationDate: req.body.creationDate ? new Date(req.body.creationDate) : "",
    startDate: req.body.startDate ? new Date(req.body.startDate) : "",
    endDate: req.body.endDate ? new Date(req.body.endDate) : "",
    debtor: req.body.debtor ? new ObjectID(req.body.debtor) : "",
    receiver: req.body.receiver ? new ObjectID(req.body.receiver) : "",
    amount: req.body.amount ? req.body.amount : "",
    relatedExpenses: req.body.relatedExpenses.split(",").map(id => new ObjectID(id))
  };
};

// Puede que no sea necesario ya que no se permite actualizar un settleUp
// const updateDocument = req => {
//   let newData = {};
//   if (req.body.categoria) newData.categoria = req.body.categoria;
//   if (req.body.coste) newData.coste = req.body.coste;
//   if (req.body.usuario) newData.usuario = new ObjectID(req.body.usuario);
//   if (req.body.fecha) newData.fecha = new Date(req.body.fecha);
//   if (req.body.descripcion) newData.descripcion = req.body.descripcion;
//   if (req.body.settled) newData.settled = req.body.settled;
//   return newData;
// };


/*
// RUTAS ESPECÍFICAS DE ESTA COLECCION

// RUTA '/gastos/usuarios'
modelRouter
  .route("/usuarios")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Content-Type", "application/json");
    next();
  })
  // GET lista de gastos con sus usuarios asociados
  .get((req, res, next) => {
    MongoClient.connect(
      URL,
      { useNewUrlParser: true }
    )
      .then(client => {
        console.log("Conectado al servidor");
        const db = client.db(DBNAME);
        const coll = db.collection(theCollection);
        // This is where currently I get the 'gastos' sorted and limited
        // With the lookup I get the data of the user inside the gasto obj which I am not using now
        // Should be in the 'operations' file like a funtion
        coll
          .aggregate([
            {
              $sort: { fecha: -1 }
            },
            {
              $limit: 50
            },
            {
              $lookup: {
                from: "usuarios",
                localField: "usuario",
                foreignField: "_id",
                as: "datos_usuario"
              }
            }
          ])
          .toArray()
          .then(docs => {
            client.close();
            res.end(JSON.stringify(docs));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  })
  .options((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, OPTIONS, DELETE"
    );
    res.end();
  });

// RUTA '/gastos/settle'
modelRouter
  .route("/settle")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Content-Type", "application/json");
    next();
  })
  // PATCH update the corresponding expenses
  .post((req, res) => {
    MongoClient.connect(
      URL,
      { useNewUrlParser: true }
    )
      .then(client => {
        const db = client.db(DBNAME);
        const settled = { settled: true };
        // In the body there is an object named 'id' and an array of all ids
        const expensesIds = req.body.id;
        console.log(expensesIds.length + " ids of expenses received.");
        dbOPS
          .updateDocumentsById(db, theCollection, expensesIds, settled)
          .then(doc => {
            client.close();
            res.end(JSON.stringify(doc));
          })
          .catch(err => {
            res.end(JSON.stringify({ errmsg: `Error saldando gastos` }));
            console.log(err);
          });
      })
      .catch(err => {
        res.end(JSON.stringify({ errmsg: `Error saldando gastos` }));
        console.log(err);
      });
  })
  .options((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST"
    );
    res.end();
  });

// RUTA '/gastos/id/usuarios/id'
modelRouter
  .route("/:idGasto/usuarios/:idUsuario")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Content-Type", "application/json");
    next();
  })
  // PUT A un gasto concreto le quiero cambiar el '_id' del autor
  .put((req, res) => {
    MongoClient.connect(
      URL,
      { useNewUrlParser: true }
    )
      .then(client => {
        const db = client.db(DBNAME);
        // Parametros de la request
        let idGasto = req.params.idGasto;
        let idUsuario = req.params.idAlumno;
        // 'updateDocument' procede de un router específico
        let nuevosDatos = { _id: idUsuario }; // ATENCION: el '_id' es el de un usuario
        dbOPS
          // A un gasto concreto le quiero cambiar el 'autor'
          .updateDocumentById(db, theCollection, idGasto, nuevosDatos)
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
  .options((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, OPTIONS, DELETE"
    );
    res.end();
  });
  */


// RUTAS GENERICAS
// Invoke generic routes CRUD defined in 'genericRouter'
// pass as parameter the name of the collection "settleUps" and the specific method 'createDocument'
modelRouter.use(
  "/",
  (req, res, next) => {
    req.databox = { collection: theCollection, createDocument };
    next();
  },
  genericRouter
);

// export all the methods
module.exports = modelRouter;
