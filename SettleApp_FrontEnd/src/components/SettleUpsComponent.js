/*
Shows the list of expenses
Receives:
 1) this.props.settleUps : array of objects "settleUp"
 2) this.props.users
*/

import React, { Component } from "react";
import { Table, Button } from "reactstrap";
import { Redirect } from "react-router-dom";

class SettleUps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      goToCreateSettleUp: false,
      //modificarId: null
    };

    this.goToCreateSettleUp = this.goToCreateSettleUp.bind(this);
    this.modificar = this.modificar.bind(this);
  }

  goToCreateSettleUp() {
    this.setState({
      goToCreateSettleUp: true
    });
  }

  // UN METODO QUE PERMITA BORRAR PERO LO QUE TINEE QUE HACER ES MARCAR DE NUEVO COMO UNSETTLE LOS GASTOS IMPLICADOS
  modificar(settleUpId) {
    this.setState({
      modificarId: settleUpId
    });
  }

  render() {
    // If "New" has been clicked I redirect
    if (this.state.goToCreateSettleUp === true) {
      return <Redirect to="/settle-up/create" />;
    }

    // If "Edit Settle Up" has been clicked I redirect with parameter "id"
    if (this.state.modificarId) {
      return <Redirect to={"/settle-up/edit/" + this.state.modificarId} />;
    }

    // Changes the user id by its corresponding names to be displayed
    // Que pasa si hay muchos usuarios?? Esta bien hecho??
    // Si se ha obligado a elegir 2 puede que este bien
    // let debtor, receiver;
    // this.props.usuarios.forEach(user => {
    //   if (user._id === this.state.debtor) {
    //     debtor = user.nombre;
    //   } else if (user._id === this.state.receiver) {
    //     receiver = user.nombre;
    //   }
    // });


    // With props.usuarios I create an array with all the debtor & receiver names linked to a settleUp
    // LO TENGO QUE MEJORAR MANDANDO DIRECTAMENTE EL NOMBRE DESDE EL BACKEND CON UN $lookup de aggregate
    let namesDebtors = [];
    let namesReceivers = [];
    this.props.settleUps.forEach(settleUp => {
      if (settleUp.debtor) {
        const userObj = this.props.usuarios.find(
          usuario => usuario._id === settleUp.debtor
        );
        namesDebtors.push(userObj.nombre);
      } else {
        namesDebtors.push("");
      }
      if (settleUp.receiver) {
        const userObj = this.props.usuarios.find(
          usuario => usuario._id === settleUp.receiver
        );
        namesReceivers.push(userObj.nombre);
      } else {
        namesReceivers.push("");
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
    // Temporarily I display the value of settled with a string, it will be an icon
    // The last two are icons used as buttons to delete and edit
    let rows = this.props.settleUps
      ? this.props.settleUps.map((item, i) => (
        <tr key={item._id}>
          <td>{item.creationDate.split("T")[0]}</td>
          <td>{item.startDate.split("T")[0]}</td>
          <td>{item.endDate.split("T")[0]}</td>
          <td>{namesDebtors[i]}</td>
          <td>{namesReceivers[i]}</td>
          <td>{item.amount}</td>
          <td>{item.relatedExpenses.length}</td>
          <td>
            <i
              className="fa fa-lg fa-trash borrar"
              onClick={() => this.props.onBorrar(item._id)}
            />
          </td>
          {/* <td>
            <i
              className="fa fa-lg fa-edit modificar"
              onClick={() => this.modificar(item._id)}
            />
          </td> */}
        </tr>
      ))
      : [];

    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Creation date</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Debtor</th>
              <th>Receiver</th>
              <th>Amount (€)</th>
              <th>Expenses</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Button color="danger" onClick={this.goToCreateSettleUp}>
          New Settle Up
        </Button>
      </div>
    );
  }
}

export default SettleUps;
