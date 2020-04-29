import React, { Component } from 'react';
import axios from 'axios';
const md5 = require('md5');



export default class Login extends Component {


  constructor(props) {

    super(props);
    this.state = { username: "" };
    this.state = { password: "" };

  }

  verificarUsuario = () => {

    const { username } = this.state
    axios.post('/api/check-user/', null, {
      params: {
        user: username
      }
    })
      

  }

  updateUsername = (e) => {

    const username = e.target.value;
    this.setState({ username: username })

  }

  updatePassword = (e) => {

    const password = md5(e.target.value);
    this.setState({ password: password })

  }

  loginUser = () => {

    const { username, password } = this.state;

    return axios.post('/api/generate-token/', null, {
      params: {
        user: username,
        password: password
      }
    }).then(function (res) {
        // handle success
        return res.data
      })
  }


  //
  checkLogin = async () => {

    const incognita = await this.loginUser()
    if (incognita) {
      
      this.props.checkAuth()

    }
  }


  //Comprobar Token
  checkToken = () => {
    axios.get('/api/checkToken')
      .then(function (response) {
        // handle success
        console.log(response.data);
      })
  }

  //Liampia la cookie
  clearCookie = () => {
    axios.get('/api/clear')
      .then(function (response) {
        // handle success
        console.log(response.data);
      })
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
          <button type="button" onClick={() => this.checkToken()} className="btn">
            Comprobar Token
          </button>
          <button type="button" onClick={() => this.clearCookie()} className="btn">
            Limpiar Cookie
          </button>
        </div>
      </div>
    );
  }
}
