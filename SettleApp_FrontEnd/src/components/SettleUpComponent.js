/*
Calculates the amount of money one user owes to
the other one in the specified date range.
It receives via props from App.js:
 1) list of expenses
 2) list of users
 3) settleExpenses method
*/

import React, { Component } from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';

class SettleUp extends Component {
  constructor(props) {
    super(props);

    // If in the browser there is data of the last settleUp I get it
    this.state = localStorage.getItem("SettleUpPreview") ?
      JSON.parse(localStorage.getItem("SettleUpPreview")) :
      { amount: 0, debtor: "", receiver: "" };

    this.previewSettleUp = this.previewSettleUp.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getOldestExpenseNotSettled = this.getOldestExpenseNotSettled.bind(this);
    // this.submit = this.submit.bind(this);
  }

  // Look for the oldest expense not settled
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


  previewSettleUp(e) {
    e.preventDefault();

    let sDate = new Date(this.state.startDate);
    let eDate = new Date(this.state.endDate);
    const expensesInRange = this.props.gastos.filter(
      gasto => new Date(gasto.fecha) >= sDate && new Date(gasto.fecha) <= eDate
    );

    // An array with the Ids of the expenses in the specified period of time. 
    // When the 'Settle Up' is confirmed this Ids are used to update the corresponding expenses.
    // In case of saving an object 'settleUpObj' in DB it would be better to delete this field.
    let expensesInRangeId = [];
    expensesInRange.forEach(expense => {
      expensesInRangeId.push(expense._id);
    });

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

    // Prepare the settle object that could be saved later
    let settleUpObj = {};
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

    settleUpObj.expensesInRangeId = expensesInRangeId;

    this.setState(
      settleUpObj,
      // I save on the browser the data of the settle up preview
      () => localStorage.setItem("SettleUpPreview", JSON.stringify(this.state))
    );
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
                    value={this.state.startDate ? this.state.startDate : ""}
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
                    // Poner como default la fecha actual
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button onClick={this.previewSettleUp}>Settle Up</Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col>
          <Row>Del {this.state.startDate} al {this.state.endDate}</Row>
          <Row>{this.state.debtor} debe a {this.state.receiver}</Row>
          <Row><p className="settleUp__amount">{this.state.amount} €</p></Row>
          <Button onClick={() => this.props.onSettle(this.state.expensesInRangeId)}>Confirm this settle up point</Button>
        </Col>
      </Row>
    );
  }
}

export default SettleUp;
