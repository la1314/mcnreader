import React, { Component } from 'react';
import axios from 'axios';
const md5 = require('md5');

export default class Login extends Component {


  constructor(props) {

    super(props);
    this.state = { username: "" };
    this.state = { password: "" };

  }

  //Comprueba que el usuario actual exista
  verificarUsuario = async () => {

    const { username } = this.state

    const incognita = await this.props.checkUser(username);
    
    //TODO
    console.log('Check user: ' + incognita);
    

  }

  //Actualiza el estado username con el value del target
  updateUsername = (e) => {

    e.target.value = e.target.value.replace(' ', '')
    const username = e.target.value;
    this.setState({ username: username })

  }

  //Actualiza el estado password con el value del target
  updatePassword = (e) => {

    e.target.value = e.target.value.replace(' ', '')
    const password = md5(e.target.value);
    this.setState({ password: password })

  }

  //Comprueba que el usuario con dicha contraseña exista en la base de datos
  loginUser = () => {

    const { username, password } = this.state;

    return axios.post('/api/generate-token/', null, {
      params: {
        user: username,
        password: password
      }
    }).then(function (res) {
      // handle success
      console.log( 'Login: ' + res.data);
      //TODO
      localStorage.removeItem('page');
      return res.data
    })
  }


  //Si el usuario es valido para conectarse se rederige a la App en caso contrario permanece en Login
  checkLogin = async () => {

    const incognita = await this.loginUser()
    if (incognita) {

      this.props.checkAuth()

    }
  }


  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Login</div>
        <div className="content">
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Username or Email</label>
              <input type="text" onChange={this.updateUsername} onBlur={this.verificarUsuario} name="username" placeholder="username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input onChange={this.updatePassword} type="password" name="password" placeholder="password" />
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="submit" onClick={() => this.checkLogin()} className="btn">
            Login
          </button>
        </div>
      </div>
    );
  }
}
