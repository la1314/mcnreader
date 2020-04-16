import React, { Component } from 'react';
import axios from 'axios';
const md5 = require('md5');

export default class Register extends Component {
    
  constructor(props) {
    super(props);
    this.state = { username: "" };
    this.state = { password: "" };
    this.state = { email: "" };
  }

  verificarUsuario = () => {

    const {username} = this.state
    axios.post('/api/check-user/',null, { params: {
      user : username
    }})
    .then( res => console.log(res.data[0].Booleano))

  }

  updateUsername = (e) => {

    const username = e.target.value;
    this.setState({username: username})

  }

  updateEmail = (e) => {

    const email = e.target.value;
    this.setState({email: email})

  }

  updatePassword = (e) => {

    const password = md5(e.target.value);
    this.setState({password: password})

  }

  createUser = () => {

    const {username, password, email} = this.state;
    
    axios.post('/api/create-user/',null, { params: {
      email: email,
      username : username,
      password: password
    }})
    .then( res => (res.data))

  }

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Register</div>
        <div className="content">
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input type="text" onChange={this.updateUsername} onBlur={this.verificarUsuario} name="username" placeholder="username" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" onChange={this.updateEmail} onBlur={this.verificarUsuario} name="email" placeholder="email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input type="text" onChange={this.updatePassword} name="password"  placeholder="password" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Repetir contraseña</label>
              <input type="text" name="repassword" placeholder="repassword" />
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="button" onClick={() => this.createUser()} className="btn">
            Register
          </button>
        </div>
      </div>
    );
  }
}