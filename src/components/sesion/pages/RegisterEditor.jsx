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
      phone: "",
      usernameBool: false,
      passBool: false,
      repassBool: false,
      emailBool: false,
      phoneBool: false
    };
  }

  //carga los datos de la pagina actual
  componentDidMount() {
    this.recuperarStados()
  }

  //Intenta recuperar datos 
  recuperarStados = () => {

    if (localStorage.getItem('username')) { this.setState({ username: localStorage.getItem('username') }, () => { this.verificarUsuario('username') }) }
    if (localStorage.getItem('email')) { this.setState({ email: localStorage.getItem('email') }, () => { this.verificarUsuario('email') }) }
    if (localStorage.getItem('phone')) { this.setState({ phone: localStorage.getItem('phone'), phoneBool: true }) }
  }

  //Comprueba que el usuario actual exista
  verificarUsuario = async (name) => {

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

  //Devuelve el valor del input actual limpiando los carácteres no permitidos
  limpiarTargetValue = (e) => {
    e.target.value = e.target.value.replace(/[^a-z0-9$.\-@_]/gi, '')
    return e.target.value;
  }

  //Actualiza el estado username con el value del target
  updateUsername = (e) => {

    const username = this.limpiarTargetValue(e);

    localStorage.setItem('username', username);
    this.setState({ username: username })
  }

  //Actualiza el estado email con el value del target
  updateEmail = (e) => {

    const email = this.limpiarTargetValue(e);

    localStorage.setItem('email', email);
    this.setState({ email: email })
  }

   //Actualiza el estado phone con el value del target
  updatePhone = (e) => {

    const phone = this.limpiarTargetValue(e);
    localStorage.setItem('phone', phone);

    if (phone !== '') {
      this.setState({ phoneBool: true })
    } else {
      this.setState({ phoneBool: false })
    }

    this.setState({ phone: phone })

  }

  //Actualiza el estado password con el value del target
  updatePassword = (e) => {

    const password = md5(this.limpiarTargetValue(e));
    // Descomentar cuando se acabe la MainAPP
    // const patron = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z$.\-@_]{8,}$/;

    this.setState({ password: password })
    this.setState({ passBool: true, repassBool: false })
    /* if (patron.test(this.limpiarTargetValue(e))) {
       this.setState({ passBool: true, repassBool: false })
     } else {
       this.setState({ passBool: false, repassBool: false })
     }*/
  }

  //Actualiza el estado password con el value del target
  updateRePassword = (e) => {

    const repassword = md5(this.limpiarTargetValue(e));
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

    const { username, password, email, phone, usernameBool, passBool, repassBool, emailBool, phoneBool } = this.state;

    if (usernameBool & passBool & repassBool & emailBool & phoneBool) {
      axios.post('/api/create-user/', null, {
        params: {
          email: email,
          username: username,
          password: password,
          phone: phone,
          type: 1
        }
      }).then(() => {

        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');

        axios.post('/api/editor-id/', null, {
          params: {
            editor: username
          }
        }).then((res) => {

          const editor = res.data.ID_EDITOR
          const formData = new FormData();
          formData.append('editor', `${editor}`);
          formData.append('action', 'newEditorDirectory');
          axios.post('https://tuinki.gupoe.com/media/options.php', formData)

        }).then(this.props.resetPages())
      })
    } else {
      //TODO por finalizar cuando se acabe la MainAPP
      console.log('Se mantienen los datos');

    }
  }

  //Cambia el componente actual por el registro normal
  cambiarRegistro = () => {
    this.props.cambiarRegistro(0)
  }

  render() {

    const { username, email, phone } = this.state;

    return (
      <div className="base-container" ref={this.props.containerRef}>
        <button type="button" onClick={() => this.cambiarRegistro()} className="btn">
          Registar Lector
          </button>
        <div className="header">Register Editor</div>
        <div className="content">
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input type="text" onChange={this.updateUsername} value={username} onBlur={() => { this.verificarUsuario('username') }} name="username" placeholder="username" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" onChange={this.updateEmail} value={email} onBlur={() => { this.verificarUsuario('email') }} name="email" placeholder="email" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input type="number" onChange={this.updatePhone} value={phone} name="phone" placeholder="Insert your phone" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input type="password" onChange={this.updatePassword} name="password" placeholder="Insert password" />
            </div>
            <div className="form-group">
              <label htmlFor="repassword">Repetir contraseña</label>
              <input type="password" onChange={this.updateRePassword} name="repassword" placeholder="Insert repassword" />
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