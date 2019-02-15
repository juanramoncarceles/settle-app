// Helper class with some static methods

export default class Api {
  // GET all the data
  static getData(callback) {
    let usuarios, gastos;
    fetch("http://localhost:3001/gastos/usuarios")
      .then(results => results.json())
      .then(data => {
        gastos = data;
      })
      .then(() => {
        return fetch("http://localhost:3001/usuarios");
      })
      .then(results => results.json())
      .then(data => {
        usuarios = data;
        callback({ gastos, usuarios });
      })
      .catch(err => callback(false));
  }

  // In 'nuevoUsuario' and 'nuevoGasto' it is important to encode
  // the URL as x-www-form-urlencoded this means a string like:
  // name=juan&email=juan@gmail.com&edad=22&genero=h
  static nuevoGasto(obData, callback) {
    let dataBody = [];
    for (let property in obData) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(obData[property]);
      dataBody.push(encodedKey + "=" + encodedValue);
    }
    dataBody = dataBody.join("&");
    console.log(dataBody);
    fetch("http://localhost:3001/gastos", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
      }),
      body: dataBody
    })
      .then(resp => resp.json())
      .then(nuevoGasto => {
        callback(nuevoGasto);
      });
  }

  static nuevoUsuario(obData, callback) {
    let dataBody = [];
    for (let property in obData) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(obData[property]);
      dataBody.push(encodedKey + "=" + encodedValue);
    }
    dataBody = dataBody.join("&");
    console.log(dataBody);
    fetch("http://localhost:3001/usuarios", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
      }),
      body: dataBody
    })
      .then(resp => resp.json())
      .then(nuevoUsuario => {
        callback(nuevoUsuario);
      });
  }

  // static updateSeveralDocuments(obArray) {
  //   TODO EL CODIGO INFERIOR ES VIEJO
  //   let id = obData._id;
  //   let dataBody = [];
  //   for (let property in obData) {
  //     if (property === "_id") continue; // no interessa enviar '_id' via body
  //     let encodedKey = encodeURIComponent(property);
  //     let encodedValue = encodeURIComponent(obData[property]);
  //     dataBody.push(encodedKey + "=" + encodedValue);
  //   }
  //   dataBody = dataBody.join("&");
  //   fetch(`http://localhost:3001/gastos/${id}`, {
  //     method: "PUT",
  //     headers: new Headers({
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     }),
  //     body: dataBody
  //   })
  //     .then(resp => resp.json())
  //     .then(resp => {
  //       console.log(resp);
  //     });
  // }

  // This function is used either to update a user or an expense
  static updateOneDocument(obData, collection) {
    let id = obData._id;
    let dataBody = [];
    for (let property in obData) {
      if (property === "_id") continue; // The '_id' is not send with the body
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(obData[property]);
      dataBody.push(encodedKey + "=" + encodedValue);
    }
    dataBody = dataBody.join("&");
    fetch(`http://localhost:3001/${collection}/${id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded"
      }),
      body: dataBody
    })
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp);
      });
  }

  static borraGasto(id) {
    fetch(`http://localhost:3001/gastos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    })
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp);
      });
  }

  static borraUsuario(id) {
    fetch(`http://localhost:3001/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    })
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp);
      });
  }
}
