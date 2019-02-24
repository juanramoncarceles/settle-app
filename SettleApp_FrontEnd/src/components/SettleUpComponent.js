/*
Calculates the amount of money one user owes to
the other one in the specified date range.
It receives via props from App.js:
 1) list of expenses
 2) list of users
*/

import React, { Component } from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from "react-router-dom";

class SettleUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      goToSettleUpConfirm: false
    };

    // PREPARARLO PARA QUE GUARDE SOLO LAS DOS FECHAS
    // If in the browser there is data of the last settleUp I get it
    //this.state = localStorage.getItem("SettleUpDates") ?
    //  JSON.parse(localStorage.getItem("SettleUpDates")) :
    //  { startDate: "", endDate: "" };

    this.previewSettleUp = this.previewSettleUp.bind(this);
    this.getOldestExpenseNotSettled = this.getOldestExpenseNotSettled.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    // this.submit = this.submit.bind(this);
  }

  previewSettleUp(e) {
    e.preventDefault();

    // Prepare the SettleUp object that will be passed
    let settleUpObj = {};

    const sDate = new Date(this.state.startDate);
    const eDate = new Date(this.state.endDate);
    const expensesInRange = this.props.gastos.filter(gasto =>
      new Date(gasto.fecha) >= sDate && new Date(gasto.fecha) <= eDate && gasto.settled === false
    );

    if (expensesInRange.length === 0) {
      console.log("There are no expenses or all have been already settled");
      // HABRIA QUE PONER CONTENIDO CON AVISO EN LA PAGINA CONFIRM SI ESTE ES EL CASO
    }

    // I pass the date string sice obj are not accepted
    settleUpObj.startDate = this.state.startDate;
    settleUpObj.endDate = this.state.endDate;

    // An array with the Ids of the expenses in the specified period of time. 
    // When the 'Settle Up' is confirmed this Ids are used to update the corresponding expenses.
    // In case of saving an object 'settleUpObj' in DB it would be better to delete this field.
    let expensesInRangeId = [];
    expensesInRange.forEach(expense => {
      expensesInRangeId.push(expense._id);
    });

    settleUpObj.expensesIds = expensesInRangeId;

    // En este caso yo se que solo hay dos usuarios.
    // Hay que prepararlo para que haya que elegir dos de todos los disponibles.
    let [user1, user2] = this.props.usuarios.map(u => u._id);

    // Calculates the amount of money spent by user in the specified period
    let moneyUser1 = 0, moneyUser2 = 0;
    expensesInRange.forEach(
      expense => {
        if (expense.usuario === user1) {
          moneyUser1 += parseFloat(expense.coste);
        } else if (expense.usuario === user2) {
          moneyUser2 += parseFloat(expense.coste);
        }
      });

    // Changes the user id by its corresponding names
    // Que pasa si hay muchos usuarios?? Esta bien hecho??
    // Si se ha obligado a elegir 2 puede que este bien
    this.props.usuarios.forEach(user => {
      if (user._id === user1) {
        user1 = user.nombre;
      } else if (user._id === user2) {
        user2 = user.nombre;
      }
    });

    if (moneyUser1 > moneyUser2) {
      settleUpObj.amount = (moneyUser1 - moneyUser2) / 2;
      settleUpObj.debtor = user2;
      settleUpObj.receiver = user1;
    } else if (moneyUser1 < moneyUser2) {
      settleUpObj.amount = (moneyUser2 - moneyUser1) / 2;
      settleUpObj.debtor = user1;
      settleUpObj.receiver = user2;
    } else {
      // en el caso de que las cantidades sean iguales y no se debe nada!
    }

    this.setState({
      goToSettleUpConfirm: true,
      settleUpObj: settleUpObj
      // CAMBIARLO PARA QUE GUARDE SOLO LAS FECHAS
      // () => localStorage.setItem("SettleUpDates", JSON.stringify(this.state))
    });
  }

  // Look for the oldest expense not settled. FUNCIONA SI ESTAN MEZCLADAS SETTLE CON NO SETTLE?
  // If the oldest already in the frontend is not settled then the DB should be checked
  getOldestExpenseNotSettled() {
    let found = false;
    let counter = 0;
    let oldestDate;
    while (!found && counter < this.props.gastos.length) {
      if (this.props.gastos[counter].settled) {
        found = true;
        if (counter === 0) {
          console.log("all are already settled. Create an alert!");
        } else {
          oldestDate = this.props.gastos[counter - 1].fecha;
        }
        // If it has not been found yet and we are in the last one
        // I assign the last date, but I should check the DB
      } else if (counter === this.props.gastos.length - 1) {
        oldestDate = this.props.gastos[counter].fecha;
        console.log("The last in front is false so I should get more from DB");
      }
      counter++;
    }
    // Set the date as the startDate in the state so it can be set in the input
    this.setState({
      startDate: oldestDate.split("T")[0]
    });
  }

  // generic method that assigns the content of an input field with its
  // equivalent value of the state, so when the form is send the state is ready
  // the input field shoud have a name, the same that is used in the state
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  // submit(e) {
  //   e.preventDefault();
  //   this.props.onEnviar(this.state);
  // }

  render() {
    // If "Confirm Settle Up" has been clicked I redirect
    if (this.state.goToSettleUpConfirm === true) {
      return <Redirect to={{
        pathname: "settle-up/confirm",
        state: this.state.settleUpObj
      }} />;
    }
    return (
      <Row>
        <Col>
          <Form>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="startDateInput">Period start date</Label>
                  <Input
                    type="date"
                    name="startDate"
                    id="startDateInput"
                    //value={this.state.startDate ? this.state.startDate : ""}
                    onChange={this.handleInputChange}
                  />
                  <Button onClick={this.getOldestExpenseNotSettled}>Ultimo gasto no saldado</Button>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="endDateInput">Period end date</Label>
                  <Input
                    type="date"
                    name="endDate"
                    id="endDateInput"
                    //value={this.state.endDate ? this.state.endDate : ""}
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button onClick={this.previewSettleUp}>Preview Settle Up</Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default SettleUp;
