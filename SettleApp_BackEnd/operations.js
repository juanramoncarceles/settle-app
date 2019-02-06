// necesario para crear objeto ObjectID
const ObjectID = require("mongodb").ObjectID;

exports.insertDocument = (db, collection, document) => {
  const coll = db.collection(collection);
  return coll.insertOne(document);
};

exports.findDocuments = (db, collection) => {
  const coll = db.collection(collection);
  return coll.find({}).toArray();
};

exports.findDocumentsByFilter = (db, collection, filter) => {
  const coll = db.collection(collection);
  return coll.find(filter).toArray();
};

exports.findDocumentById = (db, collection, documentId) => {
  const coll = db.collection(collection);
  const finded = coll.find({ _id: ObjectID(documentId) }).toArray();
  return finded ? finded : [];
};

exports.removeDocumentById = (db, collection, documentId) => {
  const coll = db.collection(collection);
  return coll.deleteOne({ _id: ObjectID(documentId) });
};

exports.removeDocumentByFilter = (db, collection, filter) => {
  const coll = db.collection(collection);
  return coll.deleteOne(filter);
};

exports.removeCollection = (db, collection) => {
  const coll = db.collection(collection);
  return coll.remove({});
};

exports.updateDocumentById = (db, collection, documentId, updateValues) => {
  const coll = db.collection(collection);
  return coll.updateOne(
    { _id: ObjectID(documentId) },
    { $set: updateValues },
    null
  );
};
