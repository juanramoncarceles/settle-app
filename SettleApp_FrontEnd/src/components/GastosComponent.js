/*
Shows the list of expenses
Receives:
 1) this.props.gastos : array of objects "expense"
 2) this.props.usuarios : array of objects "user"
 3) this.props.onBorrar : link to the delete method, use "id" of the expense
*/

import React, { Component } from "react";
import { Table, Button } from "reactstrap";
import { Redirect } from "react-router-dom";

class Gastos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      goToNuevoGasto: false,
      modificarId: null
    };

    this.goToCreaGasto = this.goToCreaGasto.bind(this);
    this.modificar = this.modificar.bind(this);
  }

  goToCreaGasto() {
    this.setState({
      goToNuevoGasto: true
    });
  }

  modificar(gastoId) {
    this.setState({
      modificarId: gastoId
    });
  }

  render() {
    // If "Nuevo" has been clicked I redirect
    if (this.state.goToNuevoGasto === true) {
      return <Redirect to="/gasto/crea" />;
    }

    // If "Edit expense" has been clicked I redirect with parameter "id"
    if (this.state.modificarId) {
      return <Redirect to={"/gasto/edit/" + this.state.modificarId} />;
    }

    // I create an array with all the user names linked to a expense
    // I use the array to insert the names in the table later
    let nombresUsuarios = [];
    this.props.gastos.forEach(gasto => {
      if (gasto.usuario) {
        const datosUsuario = this.props.usuarios.find(
          usuario => usuario._id === gasto.usuario
        );
        nombresUsuarios.push(datosUsuario.nombre);
      } else {
        nombresUsuarios.push("");
      }
    });

    // I choose the desired format for the date string form the db
    // A simple way is to use a .split() in the item.fecha
    // this.props.gastos.forEach(
    //   gasto => {
    //     if (gasto) {
    //       let formatDate = new Date(gasto.fecha);
    //       gasto.fecha = `${formatDate.getFullYear()}`;
    //     }
    //   }
    // );

    // I create the columns of the table from "this.props.gastos"
    // The last two are icons used as buttons to delete and edit
    let rows = this.props.gastos
      ? this.props.gastos.map((item, i) => (
        <tr key={item._id}>
          <td>{item.categoria}</td>
          <td>{item.coste}</td>
          <td>{nombresUsuarios[i]}</td>
          <td>{item.fecha.split("T")[0]}</td>
          <td>{item.descripcion}</td>
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
              <th>Categoría</th>
              <th>Coste</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Descripcion</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Button color="danger" onClick={this.goToCreaGasto}>
          Nuevo
        </Button>
      </div>
    );
  }
}

export default Gastos;
