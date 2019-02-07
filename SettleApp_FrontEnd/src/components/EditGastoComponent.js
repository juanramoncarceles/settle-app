/*
Shows input fields to create or edit an expense.
In case of editing one it receives:
 1) id of the expense: this.props.match.params.gastoId
 2) list of expenses: this.props.gastos
 3) list of users: this.props.usuarios
*/

import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { Row, Col } from "reactstrap";

class EditGasto extends Component {
  constructor(props) {
    super(props);
    // I create a default state
    let estado = {
      categoria: "",
      coste: 0,
      usuario: "",
      fecha: "",
      descripcion: "",
      toGastos: false
    };
    // 'toGastos' is used to redirect to the list of expenses once the form is sended

    // If this.props.match and this.props.gastos exists we are in editing mode
    if (this.props.match && this.props.gastos) {
      // I assign to 'estado' the expense with the corresponding id
      let idGastoEditar = this.props.match.params.gastoId;
      estado = this.props.gastos.find(item => item._id === idGastoEditar);
    }

    // If the upper step was succesful then 'estado' will be full otherwise will be empty
    this.state = estado;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUsuarioChange = this.handleUsuarioChange.bind(this);
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
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

  // handle any change of the dropdown list with the users
  handleUsuarioChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    let datosUsuario;
    if (value) {
      datosUsuario = this.props.usuarios.find(usuario => usuario._id === value);
    }
    // the first property is 'usuario: _id'
    // the second one is an object with the data of the user
    this.setState(
      {
        [name]: value,
        datosUsuario
      }
    );
  }

  // Send data to App.js to create or update an expense
  // onEnviar connects with different methods in App.js depending if it's to create or edit
  submit(e) {
    e.preventDefault();
    // Simple form validation
    if (this.state.usuario === "" || this.state.coste === "" || this.state.fecha === "") {
      console.log("Usuario, coste o fecha no pueden estar vacios");
    } else {
      this.props.onEnviar(this.state);
      // establishing toGastos = true makes it redirect to Gastos
      this.setState({ toGastos: true });
    }
  }

  cancel(e) {
    e.preventDefault();
    // establishing toGastos = true makes it redirect to Gastos
    this.setState({ toGastos: true });
  }

  render() {
    // if toGastos === true I redirect to Gastos
    if (this.state.toGastos === true) {
      return <Redirect to="/gastos" />;
    }

    // avaliable users in the dropdown list of the form
    // the default value is choosen with the 'value' attr of the Input element
    let usuarios = [
      <option key="0" value="">Elige usuario</option>
    ];
    usuarios.push(
      this.props.usuarios.map(usuario => (
        <option key={usuario._id} value={usuario._id}>
          {usuario.nombre}
        </option>
      ))
    );

    return (
      <Form>
        <Row>
          <Col xs="6">
            <FormGroup>
              <Label for="categoriaInput">Categoría</Label>
              <Input
                type="text"
                name="categoria"
                id="categoriaInput"
                placeholder="Categoría del gasto"
                value={this.state.categoria}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="costeInput">Coste</Label>
              <Input
                type="number"
                name="coste"
                id="costeInput"
                placeholder="Coste del gasto"
                value={this.state.coste}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs="3">
            <FormGroup>
              <Label for="fechaInput">Fecha</Label>
              <Input
                type="date"
                name="fecha"
                id="fechaInput"
                // I keep only the first part of the ISODate
                value={this.state.fecha.split("T")[0]}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
          <Col xs="3">
            <FormGroup>
              <Label for="descripcionInput">Descripción</Label>
              <Input
                type="text"
                name="descripcion"
                id="descripcionInput"
                value={this.state.descripcion}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col xs="3">
            <FormGroup>
              <Label for="usuariosSelect">Usuario</Label>
              <Input
                type="select"
                name="usuario"
                id="usuariosSelect"
                value={this.state.usuario}
                onChange={this.handleUsuarioChange}
              >
                {usuarios}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button color="primary" onClick={this.submit}>Enviar</Button>
            <Button color="primary" onClick={this.cancel}>Cancelar</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default EditGasto;
