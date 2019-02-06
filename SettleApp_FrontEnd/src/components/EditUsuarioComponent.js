/*
Shows input fields to create or edit a user.
In case of editing one it receives:
 1) id of the user: this.props.match.params.usuarioId
 2) list of users: this.props.usuarios
*/

import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Row, Col, Button, Form, FormGroup, Label, Input } from "reactstrap";

class EditUsuario extends Component {
  constructor(props) {
    super(props);
    // I create a default state
    let estado = {
      nombre: "",
      apellido: "",
      toUsuarios: false
      // gastos_vinculados_id: ""
    };
    // 'toUsuarios' is used to redirect to the list of users once the form is sended

    // If this.props.match and this.props.usuarios exists we are in editing mode
    if (this.props.match && this.props.usuarios) {
      // I assign to 'estado' the user with the corresponding id
      let idUsuarioEditar = this.props.match.params.usuarioId;
      estado = this.props.usuarios.find(item => item._id === idUsuarioEditar);
    }

    // If the upper step was succesful then will be assign otherwise will be empty
    this.state = estado;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  // generic method that assigns the content of an input field with its equivalent value of the state
  // the input field shoud have a name, the same that is used in the state
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  // Send data to App.js to create or update an expense
  // onEnviar connects with different methods in App.js depending if it's to create or edit
  submit(e) {
    e.preventDefault();
    this.props.onEnviar(this.state);
    // establishing toUsers = true makes it redirect to Users
    this.setState({ toUsuarios: true });
  }

  render() {
    // if toUsuarios === true I redirect to Usuarios
    if (this.state.toUsuarios === true) {
      return <Redirect to="/usuarios" />;
    }

    return (
      <Form onSubmit={this.submit}>
        <Row>
          <Col xs="6">
            <FormGroup>
              <Label for="nombreInput">Nombre</Label>
              <Input
                type="text"
                name="nombre"
                id="nombreInput"
                placeholder="Nombre del usuario"
                value={this.state.nombre}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="apellidoInput">Apellido</Label>
              <Input
                type="text"
                name="apellido"
                id="apellidoInput"
                placeholder="Apellido del usuario"
                value={this.state.apellido}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button color="primary">Enviar</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default EditUsuario;
