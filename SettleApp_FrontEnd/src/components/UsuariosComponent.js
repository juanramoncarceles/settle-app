/*
Shows the list of users
Receives:
 1) this.props.usuarios : array of objects "user"
 2) this.props.onBorrar : link to the delete method, use "id" of the user
*/

import React, { Component } from "react";
import { Table, Button } from "reactstrap";
import { Redirect } from "react-router-dom";

class Usuarios extends Component {
  constructor(props) {
    super(props);

    this.state = {
      goToNuevoUsuario: false,
      modificarId: null
    };

    this.goToCreaUsuario = this.goToCreaUsuario.bind(this);
    this.modificar = this.modificar.bind(this);
  }

  goToCreaUsuario() {
    this.setState({
      goToNuevoUsuario: true
    });
  }

  modificar(usuarioId) {
    this.setState({
      modificarId: usuarioId
    });
  }

  render() {
    // If "Nuevo" has been clicked I redirect
    if (this.state.goToNuevoUsuario === true) {
      return <Redirect to="/usuario/crea" />;
    }

    // If "Edit user" has been clicked I redirect with parameter "id"
    if (this.state.modificarId) {
      return <Redirect to={"/usuario/edit/" + this.state.modificarId} />;
    }

    // I create the columns of the table from "this.props.usuarios"
    // The las two are icons used as buttons to delete and edit
    let rows = this.props.usuarios
      ? this.props.usuarios.map(item => (
        <tr key={item._id}>
          <td>{item.nombre}</td>
          <td>{item.apellido}</td>
          <td>
            <i
              className="fa fa-lg fa-trash borrar"
              onClick={() => this.props.onBorrar(item._id)}
            />
          </td>
          <td>
            <i
              className="fa fa-lg fa-edit modificar"
              onClick={() => this.modificar(item._id)}
            />
          </td>
        </tr>
      ))
      : [];

    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Button color="danger" onClick={this.goToCreaUsuario}>
          Nuevo
        </Button>
      </div>
    );
  }
}

export default Usuarios;
