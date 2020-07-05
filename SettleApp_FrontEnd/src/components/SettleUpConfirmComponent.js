/*
Calculates the amount of money one user owes to
the other one in the specified date range.
It receives via props from App.js:
 1) React router loaction passes the settleUpObj
 2) settleExpenses method
*/

import React, { Component } from 'react';
import { Col, Row, Button } from 'reactstrap';
import Redirect from 'react-router-dom/Redirect';

class SettleUpConfirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: this.props.settleUpObj.startDate,
      endDate: this.props.settleUpObj.endDate,
      debtor: this.props.settleUpObj.debtor,
      receiver: this.props.settleUpObj.receiver,
      amount: this.props.settleUpObj.amount,
      relatedExpenses: this.props.settleUpObj.relatedExpenses
    };

    this.cancel = this.cancel.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  cancel() {
    this.setState({ toSettleUpCreate: true });
  }

  confirm() {
    this.props.onSettle(this.state);
    this.setState({ toSettleUps: true });
  }

  render() {
    if (this.state.toSettleUps === true) {
      return <Redirect to="/settle-ups" />;
    } else if (this.state.toSettleUpCreate) {
      return <Redirect to="/settle-up/create" />;
    }

    // Changes the user id by its corresponding names to be displayed
    // Que pasa si hay muchos usuarios?? Esta bien hecho??
    // Si se ha obligado a elegir 2 puede que este bien
    let debtor, receiver;
    this.props.usuarios.forEach(user => {
      if (user._id === this.state.debtor) {
        debtor = user.nombre;
      } else if (user._id === this.state.receiver) {
        receiver = user.nombre;
      }
    });

    return (
      <Row>
        <Col>
          <Row>Del {this.state.startDate} al {this.state.endDate}</Row>
          <Row>Hay {this.state.relatedExpenses.length} gastos no saldados.</Row>
          <Row>{debtor} debe a {receiver}</Row>
          <Row><p className="settleUp__amount">{this.state.amount} €</p></Row>
          <Button onClick={this.confirm}>Confirm Settle Up</Button>
          <Button onClick={this.cancel}>Cancel</Button>
        </Col>
      </Row>
    );
  }
}

export default SettleUpConfirm;
