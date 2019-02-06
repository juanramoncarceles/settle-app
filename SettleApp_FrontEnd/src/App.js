import "./App.css";
import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import Home from "./components/HomeComponent";
import Gastos from "./components/GastosComponent";
import Usuarios from "./components/UsuariosComponent";
import GastoEdit from "./components/EditGastoComponent";
import UsuarioEdit from "./components/EditUsuarioComponent";
import SettleUp from "./components/SettleUpComponent";
import P404 from "./components/P404";
import API from "./components/Api";

const Espai = () => <div className="espai" />;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usuarios: [],
      gastos: []
      // settleUps: []
    };

    this.nuevoUsuario = this.nuevoUsuario.bind(this);
    this.nuevoGasto = this.nuevoGasto.bind(this);
    this.editaUsuario = this.editaUsuario.bind(this);
    this.editaGasto = this.editaGasto.bind(this);
    this.borraUsuario = this.borraUsuario.bind(this);
    this.borraGasto = this.borraGasto.bind(this);
    this.createSettleUp = this.createSettleUp.bind(this);

    this.getInitialData();
  }

  // En el state estaran cargados todos los gastos desde el mas reciente hasta el ultimo settleUp o un limite de p.ej: 50
  getInitialData() {
    API.getData(result => {
      if (result) {
        this.setState(result);
      }
    });
  }

  comparaId(a, b) {
    if (a._id < b._id) return -1;
    if (a._id > b._id) return 1;
    return 0;
  }

  borraUsuario(id) {
    let restantes = this.state.usuarios.filter(el => el._id !== id);
    this.setState({
      usuarios: restantes
    });
    API.borraUsuario(id);
  }

  borraGasto(id) {
    let restantes = this.state.gastos.filter(el => el._id !== id);
    this.setState({
      gastos: restantes
    });
    API.borraGasto(id);
  }

  nuevoUsuario(ob) {
    delete ob.toUsuarios;
    API.nuevoUsuario(ob, dbAlumno => {
      if (dbAlumno) {
        let nuevos = this.state.usuarios.concat([dbAlumno]);
        this.setState({
          usuarios: nuevos
        });
      }
    });
  }

  nuevoGasto(ob) {
    delete ob.toGastos;
    API.nuevoGasto(ob, dbCurs => {
      if (dbCurs) {
        let nuevos = this.state.gastos.concat([dbCurs]);
        this.setState({
          gastos: nuevos
        });
      }
    });
  }

  editaUsuario(ob) {
    delete ob.toUsuarios;
    let i = this.state.usuarios.findIndex(usuario => usuario._id === ob._id);
    this.state.usuarios.splice(i, 1, ob);
    this.setState({
      usuarios: this.state.usuarios
    });
    API.modificaUsuario(ob);
  }

  editaGasto(ob) {
    delete ob.toGastos;
    let i = this.state.gastos.findIndex(gasto => gasto._id === ob._id);
    this.state.gastos.splice(i, 1, ob);
    this.setState({
      gastos: this.state.gastos
    });
    API.modificaGasto(ob);
  }

  createSettleUp(ob) {
    // Recibe los datos para establecer un settle up point

    // API.createSettleUp();
  }

  render() {
    return (
      <BrowserRouter>
        <Container>
          <Espai />
          <Row>
            <Col>
              <h1>SettleApp!</h1>
              <ul className="menu">
                <li>
                  <NavLink exact className="link" to="/">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink className="link" to="/gastos">
                    Gastos
                  </NavLink>
                </li>
                <li>
                  <NavLink className="link" to="/usuarios">
                    Usuarios
                  </NavLink>
                </li>
                <li>
                  <NavLink className="link" to="/hagamos-cuentas">
                    Hagamos cuentas
                  </NavLink>
                </li>
              </ul>
            </Col>
          </Row>
          <Espai />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              path="/gastos"
              render={() => (
                <Gastos
                  gastos={this.state.gastos}
                  usuarios={this.state.usuarios}
                  onBorrar={this.borraGasto}
                />
              )}
            />
            <Route
              path="/usuarios"
              render={() => (
                <Usuarios
                  usuarios={this.state.usuarios}
                  onBorrar={this.borraUsuario}
                />
              )}
            />
            <Route
              path="/hagamos-cuentas"
              render={() => (
                <SettleUp
                  gastos={this.state.gastos}
                  usuarios={this.state.usuarios}
                // onEnviar={this.createSettleUp}
                />
              )}
            />
            <Route
              path="/usuario/crea"
              render={() => <UsuarioEdit onEnviar={this.nuevoUsuario} />}
            />
            <Route
              path="/gasto/crea"
              render={props => (
                <GastoEdit
                  usuarios={this.state.usuarios}
                  onEnviar={this.nuevoGasto}
                  {...props}
                />
              )}
            />
            <Route
              path="/usuario/edit/:usuarioId"
              render={props => (
                <UsuarioEdit
                  usuarios={this.state.usuarios}
                  // gastos={this.state.gastos} // Posible para controlar gastos asociados?
                  onEnviar={this.editaUsuario}
                  {...props}
                />
              )}
            />
            <Route
              path="/gasto/edit/:gastoId"
              render={props => (
                <GastoEdit
                  gastos={this.state.gastos}
                  usuarios={this.state.usuarios}
                  onEnviar={this.editaGasto}
                  {...props}
                />
              )}
            />
            <Route component={P404} />
          </Switch>
          <Espai />
          <Espai />
        </Container>
      </BrowserRouter>
    );
  }
}

export default App;
