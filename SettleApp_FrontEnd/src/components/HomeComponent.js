import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';

class Home extends Component {
  render() {
    return (
      <Row>
        <Col>
          <img className='img-fluid centxcent' alt='' src='/img/academy.jpg' />
        </Col>
      </Row>
    );
  }
}

export default Home;
