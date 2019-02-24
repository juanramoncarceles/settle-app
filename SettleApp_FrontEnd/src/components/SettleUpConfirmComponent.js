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
      expensesIds: this.props.settleUpObj.expensesIds
    };

    this.cancel = this.cancel.bind(this);
  }

  cancel() {
    this.setState({ toSettleUp: true });
  }

  render() {
    if (this.state.toSettleUp === true) {
      return <Redirect to="/settle-up" />;
    }
    return (
      <Row>
        <Col>
          <Row>Del {this.state.startDate} al {this.state.endDate}</Row>
          <Row>Hay {this.state.expensesIds.length} gastos no saldados.</Row>
          <Row>{this.state.debtor} debe a {this.state.receiver}</Row>
          <Row><p className="settleUp__amount">{this.state.amount} €</p></Row>
          <Button onClick={() => this.props.onSettle(this.state.expensesIds)}>Confirm Settle Up</Button>
          <Button onClick={this.cancel}>Cancel</Button>
        </Col>
      </Row>
    );
  }
}

export default SettleUpConfirm;
