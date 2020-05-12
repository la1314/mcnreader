import React, { Component } from 'react';
import axios from 'axios';
const md5 = require('md5');

export default class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      repassword: "",
      email: "",
      usernameBool: false,
      passBool: false,
      repassBool: false,
      emailBool: false
    };
  }

  //carga los datos de la pagina actual
  componentDidMount() {
    this.recuperarStados()
  }

  //Intenta recuperar datos 
  recuperarStados = () => {

    if (localStorage.getItem('username')) {this.setState({ username: localStorage.getItem('username')}, () => {this.verificarUsuario('username')} )}
    if (localStorage.getItem('email')) {this.setState({ email: localStorage.getItem('email')}, () => {this.verificarUsuario('email')})}
  }

  //Comprueba que el usuario actual exista
  verificarUsuario = async (name) => {

    console.log(name);
    

    const nameInput = name;
    const { username, email } = this.state
    

    if (nameInput === 'username') {

      const incognita = await this.props.checkUser(username);
      incognita ? this.setState({ usernameBool: false }) : this.setState({ usernameBool: true })
    } else {

      const incognita = await this.props.checkUser(email);
      incognita ? this.setState({ emailBool: false }) : this.setState({ emailBool: true })
    }

  }

  //Actualiza el estado username con el value del target
  updateUsername = (e) => {

    e.target.value = e.target.value.replace(' ', '')

    const username = e.target.value;

    localStorage.setItem('username', username);
    this.setState({ username: username })

  }

  //Actualiza el estado email con el value del target
  updateEmail = (e) => {

    e.target.value = e.target.value.replace(' ', '')

    const email = e.target.value;

    localStorage.setItem('email', email);
    this.setState({ email: email })

  }

  //Actualiza el estado password con el value del target
  updatePassword = (e) => {

    e.target.value = e.target.value.replace(' ', '')

    const password = md5(e.target.value);

    this.setState({ password: password })

    //TODO aplicar patron para cambiar stado booleano
    this.setState({ passBool: true, repassBool: false })

  }

  //Actualiza el estado password con el value del target
  updateRePassword = (e) => {

    e.target.value = e.target.value.replace(' ', '')

    const repassword = md5(e.target.value);

    //Función flecha utilizada para esperar que el state sea reasignado para lanzar la función comparatePassword
    this.setState({ repassword: repassword }, () => { this.comparatePassword() })

  }

  //Función que compara las contraseña para determinar si son iguales o no
  comparatePassword = () => {

    const { password, repassword } = this.state
    if (password === repassword) {
      this.setState({ repassBool: true })
    } else {
      this.setState({ repassBool: false })
    }

  }

  //Crea un usuario con los datos del state actual
  //TODO Impedir que se el post si algun valor no es válido
  createUser = () => {

    const { username, password, email, usernameBool, passBool, repassBool, emailBool } = this.state;

    if (usernameBool & passBool & repassBool & emailBool) {
      axios.post('/api/create-user/', null, {
        params: {
          email: email,
          username: username,
          password: password
        }
      }).then( () => {
          localStorage.removeItem('username');
          localStorage.removeItem('email');
          this.props.resetPages(); 
        })
    } else {

      console.log('Se mantienen los datos');

    }
  }

  render() {

    const { username, email } = this.state;


    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Register</div>
        <div className="content">
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input type="text" onChange={this.updateUsername} value={username} onBlur={() => {this.verificarUsuario('username')}} name="username" placeholder="username" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" onChange={this.updateEmail} value={email} onBlur={ () => {this.verificarUsuario('email')}} name="email" placeholder="email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input type="password" onChange={this.updatePassword} name="password" placeholder="password" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Repetir contraseña</label>
              <input type="password" onChange={this.updateRePassword} name="repassword" placeholder="repassword" />
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="submit" onClick={() => this.createUser()} className="btn">
            Register
          </button>
        </div>
      </div>
    );
  }
}