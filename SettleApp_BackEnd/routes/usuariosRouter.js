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
const theCollection = "usuarios";

// funciones específicas CRUD para "usuarios"
// se envían a genericRouter
const createDocument = req => {
  console.log(req.body);
  return {
    nombre: req.body.nombre,
    apellido: req.body.apellido
    // gastos_vinculados_id: req.body.gastos_vinculados_id
    //   ? new ObjectID(req.body.gastos_vinculados_id)
    //   : ""
  };
};

const updateDocument = req => {
  let nuevosDatos = {};
  if (req.body.nombre) nuevosDatos.nombre = req.body.nombre;
  if (req.body.apellido) nuevosDatos.apellido = req.body.apellido;
  // if (req.body.gastos_vinculados_id)
  //   nuevosDatos.gastos_vinculados_id = new ObjectID(
  //     req.body.gastos_vinculados_id
  //   );
  return nuevosDatos;
};

// RUTAS ESPECÍFICAS DE ESTA COLECCIÓN

// RUTA '/usuarios/gastos'
modelRouter
  .route("/gastos")
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
  // GET lista de usuarios con sus gastos asociados
  .get((req, res, next) => {
    MongoClient.connect(
      URL,
      { useNewUrlParser: true }
    )
      .then(client => {
        console.log("Conectado al servidor");
        const db = client.db(DBNAME);
        const coll = db.collection(theCollection);
        coll
          .aggregate([
            // 'desenrrolla' el contenido del array
            { $unwind: "$gastos_vinculados_id" },
            // busca las coincidencias
            {
              $lookup: {
                from: "gastos",
                localField: "gastos_vinculados_id.gasto_id",
                foreignField: "_id",
                as: "datos_gastos"
              }
            },
            // 'desenrrolla' el resultado obtenido
            //{ $unwind: "$datos_gastos" }
            // agrupa de nuevo los arrays
            {
              $group: {
                _id: "$_id",
                gastos_vinculados_id: {
                  $push: "$gastos_vinculados_id.gasto_id"
                },
                datos_gastos: { $push: "$datos_gastos" }
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

// RUTAS '/usuarios/id/gastos/id'
modelRouter
  .route("/:idUsuario/curso/:idGasto")
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
  // PUT A un usuario concreto le quiero cambiar los 'gastos' asociados
  .put((req, res) => {
    MongoClient.connect(
      URL,
      { useNewUrlParser: true }
    )
      .then(client => {
        const db = client.db(DBNAME);
        // Parametros de la request
        let idGasto = req.params.idGasto;
        let idUsuario = req.params.idUsuario;
        // 'updateDocument' procede de un router específico
        let nuevosDatos = { _id: idGasto }; // ATENCION: el '_id' es el de un gasto
        dbOPS
          .updateDocumentById(db, theCollection, idUsuario, nuevosDatos)
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

// RUTAS GENERICAS
// invocamos rutas genéricas CRUD definidas en 'genericRouter'
// pasamos como parámetro el nombre de la colección "usuarios" y los métodos específicos 'createDocument' y 'updateDocument'
modelRouter.use(
  "/",
  (req, res, next) => {
    req.databox = { collection: theCollection, createDocument, updateDocument };
    next();
  },
  genericRouter
);

// exportamos todos los métodos
module.exports = modelRouter;
