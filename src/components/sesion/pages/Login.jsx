import React, { Component } from 'react';
import axios from 'axios';
const md5 = require('md5');
axios.defaults.withCredentials = true;

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = { username: "", password: "", usernameBool: false, passBool: false };
  }

  //Comprueba que el usuario actual exista
  verificarUsuario = async () => {

    const { username } = this.state
    const incognita = await this.props.checkUser(username, 0);

    if (incognita) {
      this.setState({ usernameBool: true })
    } else {
      this.setState({ usernameBool: false })
    }
  }

  //Actualiza el estado username con el value del target
  updateUsername = (e) => {

    e.target.value = e.target.value.replace(' ', '')
    const username = e.target.value;
    this.setState({ username: username })
  }

  //Actualiza el estado password con el value del target
  updatePassword = (e) => {

    e.target.value = e.target.value.replace(' ', '');

    if (e.target.value === '') {

      this.setState({ password: '', passBool: false });

    } else {

      const password = md5(e.target.value);
      this.setState({ password: password }, () => {
        this.setState({ passBool: true })
      });
    }
  }

  //Comprueba que el usuario con dicha contraseña exista en la base de datos
  loginUser = () => {

    const { username, password } = this.state;

    return axios.post('https://mcnreader.herokuapp.com/api/generate-token/', null, {
      params: {
        user: username,
        password: password,
        type: 0
      }
    }).then(function (res) {
      // handle success
      //console.log('Login: ' + res.data);
      //TODO
      localStorage.removeItem('page');
      return res.data
    })
  }


  //Si el usuario es valido para conectarse se rederige a la App en caso contrario permanece en Login
  checkLogin = async () => {

    const { passBool, usernameBool } = this.state;

    if (passBool & usernameBool) {
      const incognita = await this.loginUser()
      if (incognita) {

        this.props.checkAuth()

      }
    }
  }

  //Función utilizada para cambiar al login del editor
  cambiarLogin = () => {
    this.props.cambiarLogin(1)
  }

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <button type="button" onClick={() => this.cambiarLogin()} className="btnC">
            Acceso editor
          </button>
        <div className="header fade">Acceso Lectores</div>
        <div className="content fade">
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Usuario o email</label>
              <input type="text" onChange={this.updateUsername} onBlur={this.verificarUsuario} name="username" placeholder="Usuario o email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input onChange={this.updatePassword} type="password" name="password" placeholder="Contraseña" />
            </div>
          </div>
        </div>
        <div className="footer fade">
          <button type="submit" onClick={() => this.checkLogin()} className="btn">
            Login
          </button>
        </div>
      </div>
    );
  }
}
