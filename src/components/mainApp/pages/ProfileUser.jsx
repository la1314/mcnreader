import React, { Component } from 'react';
import axios from 'axios';
const md5 = require('md5');

export default class ProfileUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '', email: '',
      newName: '', newEmail: '',
      oldPassword: '',
      newPassword: '', reNewPassword: '',
      usernameBool: false,
      repassBool: false,
      emailBool: false,
      passBool: false,
      disabledUser: false,
      disabledEmail: false,
      disabledPasswordCheck: false,
      disabledPasswordUpdate: false,
    }

    this.refEditUser = React.createRef();
    this.refEditEmail = React.createRef();
    this.refOldPassword = React.createRef();
    this.refNewPassword = React.createRef();
    this.refRNewPassword = React.createRef();

  }

  componentDidMount() {
    this.findDetailts();

  }

  findDetailts = () => {
    axios.post('/api/find-user-details/')
      .then(res => {

        this.setState({
          user: res.data.USERNAME,
          email: res.data.EMAIL,
          newName: res.data.USERNAME,
          newEmail: res.data.EMAIL
        })

      })
  }

  //1:EXISTS 0:NOT EXISTS
  checkUsername = () => {

    const { newName } = this.state

    if (newName.length > 4) {
      axios.post('/api/check-username/', null, {
        params: { username: newName }
      }).then(res => {
        if (parseInt(res.data[0].booleano) === 0) {
          this.setState({ disabledUser: true })
        } else {
          this.setState({ disabledUser: false })
        }
      })
    }



    //
  }

  //1:EXISTS 0:NOT EXISTS
  checkEmail = () => {

    const { newEmail } = this.state
    if (newEmail.length > 8) {
      axios.post('/api/check-email/', null, {
        params: { email: newEmail }
      }).then(res => {
        if (parseInt(res.data[0].booleano) === 0) {
          this.setState({ disabledEmail: true })
        } else {
          this.setState({ disabledEmail: false })
        }
      })
    }

  }

  //carga los datos de la pagina actual
  comprobarPassword = (valor) => {

    if (valor !== '') {

      this.setState({ passBool: true, repassBool: false })

    } else {
      this.setState({ passBool: false, repassBool: false })
    }

  }

  //Función que compara las contraseña para determinar si son iguales o no
  comparatePassword = () => {

    const { newPassword, reNewPassword } = this.state
    if (newPassword === reNewPassword) {
      this.setState({ repassBool: true })
    } else {
      this.setState({ repassBool: false })
    }
  }

  //Actualiza la contraseña del usuario
  updatePassword = () => {

    Promise.resolve(this.comparatePassword()).then(() => {
      const { passBool, repassBool, newPassword } = this.state

      if (passBool && repassBool) {
        axios.post('/api/edit-user-password/', null, {
          params: { password: md5(newPassword) }
        }).then(res => console.log(res.data))

      } else {
        console.log('No iguales');
      }
    })

  }

  //Actualiza los estados del usuario
  updateState = (e, type) => {

    const value = e.target.value;

    switch (type) {
      case 1:
        this.setState({ newName: value }, () => { this.checkUsername() })
        break;

      case 2:
        this.setState({ newEmail: value }, () => { this.checkEmail() })
        break;

      case 3:
        this.setState({ oldPassword: value })
        break;

      case 4:
        this.setState({ newPassword: value }, () => { this.comprobarPassword(this.state.newPassword) })
        break;

      case 5:
        this.setState({ reNewPassword: value })
        break;

      default:
        break;
    }
  }

  //Activa/Desactiva el input y el boton para editar el username
  activarEditUser = () => {

    const { disabledUser } = this.state

    if (!disabledUser) {

      this.refEditUser.current.disabled = false;

    } else {
      this.refEditUser.current.disabled = true;
      this.setState({ disabledUser: false })
    }

  }

  //Activa/Desactiva el input y el boton para editar el email
  activarEditEmail = () => {

    const { disabledEmail } = this.state

    if (!disabledEmail) {

      this.refEditEmail.current.disabled = false;

    } else {
      this.refEditEmail.current.disabled = true;
      this.setState({ disabledEmail: false })
    }
  }

  //Activa/Desactiva el input y el boton para editar la password
  activarEditPassword = () => {


    if (this.refOldPassword.current.disabled) {

      this.setState({ disabledPasswordCheck: true })
      this.refOldPassword.current.disabled = false;
    } else {

      this.setState({ disabledPasswordCheck: false, disabledPasswordUpdate: false })
      this.refOldPassword.current.disabled = true;
      this.refNewPassword.current.disabled = true;
      this.refRNewPassword.current.disabled = true;

    }
  }

  activarInputsNewPassword = async () => {

    const { oldPassword } = this.state

    const comprobacion = await axios.post('/api/check-user-password/', null, {
      params: { password: md5(oldPassword) }
    }).then(res => { return parseInt(res.data[0].booleano) })

    if (comprobacion) {

      this.refOldPassword.current.disabled = true;
      this.refNewPassword.current.disabled = false;
      this.refRNewPassword.current.disabled = false;
      this.setState({ disabledPasswordUpdate: true, disabledPasswordCheck: false })
    }

  }

  render() {

    const { user, email, disabledPasswordCheck, disabledPasswordUpdate, disabledUser, disabledEmail,
      newEmail, newName, oldPassword, newPassword, reNewPassword
    } = this.state

    return (
      <div className='profile-container'>

        <div>
          <div>Información de la cuenta:</div>
          <div>Tu usuario: {user}</div>
          <div>Email registrado: {email}</div>
        </div>

        <div>
          <div>Actualizar información</div>

          <label>Usuario: </label>
          <input type='text' ref={this.refEditUser} onChange={(e) => { this.updateState(e, 1) }} value={newName} disabled />
          <button disabled={!disabledUser} onClick={() => { console.log('Holis') }} >actualizar</button>
          <button onClick={() => { this.activarEditUser() }} >editar</button>

          <label>Email: </label>
          <input type='email' ref={this.refEditEmail} onChange={(e) => { this.updateState(e, 2) }} value={newEmail} disabled />
          <button disabled={!disabledEmail} >actualizar</button>
          <button onClick={() => { this.activarEditEmail() }}>editar</button>


          <label>Contraseña:</label>

          <input type='password' ref={this.refOldPassword} value={oldPassword} onChange={(e) => { this.updateState(e, 3) }} placeholder='Contraseña actual' disabled />
          <button disabled={!disabledPasswordCheck} onClick={(e) => { this.activarInputsNewPassword(e) }} >Comprobar</button>
          <button onClick={() => { this.activarEditPassword() }}>editar</button>
          <input type='password' ref={this.refNewPassword} onChange={(e) => { this.updateState(e, 4) }} value={newPassword} placeholder='Nueva contraseña' disabled />
          <input type='password' ref={this.refRNewPassword} onChange={(e) => { this.updateState(e, 5) }} value={reNewPassword} placeholder='Repetir contraseña' disabled />
          <button disabled={!disabledPasswordUpdate} onClick={() => { this.updatePassword() }} >actualizar</button>
        </div>

      </div>
    );
  }
}