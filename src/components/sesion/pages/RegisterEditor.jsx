import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Dialog from '../../mainApp/pages/items/Dialog.jsx'
import Tooltip from '../../mainApp/pages/items/ToolTip.jsx'
const md5 = require('md5');
axios.defaults.withCredentials = true;

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
    this.ipUsername = React.createRef();
    this.ipPass = React.createRef();
    this.ipRePass = React.createRef();
    this.ipEmail = React.createRef();
    this.ipPhone = React.createRef();
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
    const patron = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (nameInput === 'username') {

      const incognita = await this.props.checkUser(username, 1);

      if (username.length < 4) {
        this.ipUsername.current.className = '';
      } else {
        if (incognita) {
          this.setState({ usernameBool: false }, () => { this.ipUsername.current.className = 'red-input' })
        } else {
          this.setState({ usernameBool: true }, () => { this.ipUsername.current.className = 'green-input' })
        }
      }
    } else {

      if (email === '') {
        this.ipEmail.current.className = ''
      } else {
        if (patron.test(email)) {
          const incognita = await this.props.checkUser(email, 1);
          incognita ? this.setState({ emailBool: false }, () => { this.ipEmail.current.className = 'red-input' }) : this.setState({ emailBool: true }, () => { this.ipEmail.current.className = 'green-input' })
        } else {
          this.ipEmail.current.className = 'red-input'
        }
      }
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

    if (username.length < 4) {
      this.setState({ username: username })
      this.ipUsername.current.className = '';

    } else {
      localStorage.setItem('username', username);
      this.setState({ username: username })
    }
  }

  //Actualiza el estado email con el value del target
  updateEmail = (e) => {

    const email = this.limpiarTargetValue(e);

    if (email === '') {
      this.ipEmail.current.className = '';
    }

    localStorage.setItem('email', email);
    this.setState({ email: email })
  }

  //Actualiza el estado phone con el value del target
  updatePhone = (e) => {

    const phone = this.limpiarTargetValue(e);
    localStorage.setItem('phone', phone);
    const re = /^[0-9\b]+$/;
    if ((phone === '' || re.test(phone))) {
      if (phone !== '') {
        this.setState({ phoneBool: true })
      } else {
        this.setState({ phoneBool: false })
      }

      this.setState({ phone: phone })

    }
  }

  //Actualiza el estado password con el value del target
  updatePassword = (e) => {

    const password = md5(this.limpiarTargetValue(e));

    this.setState({ password: password })
  }

  //Comprueba que la password este bien formada
  verifiPass = (e) => {
    const patron = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z$.\-@_]{8,}$/;

    if (patron.test(e.target.value)) {

      this.setState({ passBool: true, repassBool: false })
      this.ipPass.current.className = 'green-input';
    } else {

      this.setState({ passBool: false, repassBool: false })
      this.ipPass.current.className = 'red-input'
    }
  }

  //Actualiza el estado password con el value del target
  updateRePassword = (e) => {

    const repassword = md5(this.limpiarTargetValue(e));
    this.setState({ repassword: repassword })
  }

  //Función que compara las contraseña para determinar si son iguales o no
  comparatePassword = (e) => {

    const { password, repassword } = this.state
    if (password === repassword) {

      this.ipRePass.current.className = 'green-input'
      this.setState({ repassBool: true })
    } else {
      this.ipRePass.current.className = 'red-input'
      this.setState({ repassBool: false })
    }
  }

  //Crea un usuario con los datos del state actual
  //TODO Impedir que se el post si algun valor no es válido
  createUser = () => {

    const { username, password, email, phone, usernameBool, passBool, repassBool, emailBool, phoneBool } = this.state;

    if (usernameBool & passBool & repassBool & emailBool & phoneBool) {
      axios.post('https://mcnreader.herokuapp.com/api/create-user/', null, {
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

        axios.post('https://mcnreader.herokuapp.com/api/editor-id/', null, {
          params: {
            editor: username
          }
        }).then((res) => {

          const editor = res.data.ID_EDITOR
          const formData = new FormData();
          formData.append('editor', `${editor}`);
          formData.append('action', 'newEditorDirectory');
          axios.post('https://tuinki.gupoe.com/media/options.php', formData)

        }).then(() => {
          localStorage.removeItem('username');
          localStorage.removeItem('email');
          this.showDialog('Bienvenido a Minerva:', 'La cuenta del editor ha sido creada exitosamente');
          this.props.resetPages();

        })
      })
    } else {
      //TODO por finalizar cuando se acabe la MainAPP
      this.showDialog('Error:', 'Faltan datos en el formulario')

    }
  }

  //Función que añade al ReactDOM una carta con los datos pasados
  showDialog = (titulo, mensaje) => {

    let contenedor = document.getElementById('dialog');
    ReactDOM.unmountComponentAtNode(contenedor);
    let carta = <Dialog titulo={titulo} mensaje={mensaje} />;
    ReactDOM.render(carta, contenedor)
  }

  //Cambia el componente actual por el registro normal
  cambiarRegistro = () => {
    this.props.cambiarRegistro(0)
  }

  render() {

    const { username, email, phone } = this.state;

    return (
      <div className="base-container" ref={this.props.containerRef}>
        <button type="button" onClick={() => this.cambiarRegistro()} className="btnC">
          Registar Lector
          </button>
        <div className="header fade">Registrar editor</div>
        <div className="content fade">
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input type="text" ref={this.ipUsername} onChange={this.updateUsername} value={username} onBlur={() => { this.verificarUsuario('username') }} name="username" placeholder="Usuario" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" ref={this.ipEmail} onChange={this.updateEmail} value={email} onBlur={() => { this.verificarUsuario('email') }} name="email" placeholder="Email" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input onChange={this.updatePhone} value={phone} name="phone" placeholder="Ingresar teléfono" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className='pass-info'>
                <input type="password" ref={this.ipPass} onChange={this.updatePassword} onBlur={(e) => this.verifiPass(e)} name="password" placeholder="Ingresar contraseña" />
                <Tooltip mensaje='Mínimo 8 carácteres:
                ha de contener mayúsculas, minúsculas y números ' />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="repassword">Repetir contraseña</label>
              <input type="password" ref={this.ipRePass} onChange={this.updateRePassword} onBlur={(e) => { this.comparatePassword(e) }} name="repassword" placeholder="Repetir contraseña" />
            </div>
          </div>
        </div>
        <div className="footer fade">
          <button type="submit" onClick={() => this.createUser()} className="btn">
            Register
          </button>
        </div>
      </div>
    );
  }
}