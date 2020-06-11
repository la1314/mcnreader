import React, { Component } from 'react';
import axios from 'axios';
const md5 = require('md5');
axios.defaults.withCredentials = true;

export default class ProfileEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '', email: '', phone: '', newName: '',
      newPhone: '', oldPassword: '', newEmail: '',
      newPassword: '', reNewPassword: '',
      usernameBool: false, repassBool: false,
      emailBool: false, passBool: false,
      disabledUserE: false, disabledEmailE: false,
      disabledPasswordCheckE: false, disabledPHone: false,
      disabledPasswordUpdateE: false,
    }

    this.refEditUserE = React.createRef();
    this.refEditEmailE = React.createRef();
    this.refOldPasswordE = React.createRef();
    this.refNewPasswordE = React.createRef();
    this.refRNewPasswordE = React.createRef();
    this.refEditPhone = React.createRef();
  }

  //Carga los datos al state
  componentDidMount() {

    this.findDetailts();
  }

  // Carga los datos del usuario al state
  findDetailts = () => {
    axios.post('https://mcnreader.herokuapp.com/api/find-editor-details/')
      .then(res => {
        this.setState({
          user: res.data.USERNAME,
          email: res.data.EMAIL,
          newName: res.data.USERNAME,
          newEmail: res.data.EMAIL,
          phone: res.data.PHONE,
          newPhone: res.data.PHONE,
        })
      })
  }

  //Verifica que el username sea nuevo 1:EXISTS 0:NOT EXISTS
  checkUsername = () => {

    const { newName } = this.state

    if (newName.length > 4) {
      axios.post('https://mcnreader.herokuapp.com/api/check-username/', null, {
        params: { username: newName }
      }).then(res => {
        if (parseInt(res.data[0].booleano) === 0) {
          this.setState({ disabledUserE: true })
        } else {
          this.setState({ disabledUserE: false })
        }
      })
    }
  }

  //Actualiza el nombre del editor
  updateUserName = () => {
    const { newName } = this.state
    axios.post('https://mcnreader.herokuapp.com/api/edit-username/', null, {
      params: { username: newName }
    }).then(() => { this.findDetailts() })
    this.setState({ disabledUserE: false })
    this.refEditUserE.current.disabled = true;

  }

  //Verifica que el correo sea nuevo 1:EXISTS 0:NOT EXISTS
  checkEmail = () => {

    const { newEmail } = this.state
    if (newEmail.length > 8) {
      axios.post('https://mcnreader.herokuapp.com/api/check-email/', null, {
        params: { email: newEmail }
      }).then(res => {
        if (parseInt(res.data[0].booleano) === 0) {
          this.setState({ disabledEmailE: true })
        } else {
          this.setState({ disabledEmailE: false })
        }
      })
    }
  }

  //actualiza el email del editor
  updateEmail = () => {

    const { newEmail } = this.state
    axios.post('https://mcnreader.herokuapp.com/api/edit-email/', null, {
      params: { email: newEmail }
    }).then(() => { this.findDetailts() })
    this.refEditEmailE.current.disabled = true;
    this.setState({ disabledEmailE: false })
  }

  //Actualiza el telefono del editor
  updatePhone = () => {

    const { newPhone } = this.state
    axios.post('https://mcnreader.herokuapp.com/api/edit-phone/', null, {
      params: { phone: newPhone }
    }).then(() => { this.findDetailts() })
    this.refEditPhone.current.disabled = true;
    this.setState({ disabledPHone: false })
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
        axios.post('https://mcnreader.herokuapp.com/api/edit-editor-password/', null, {
          params: { password: md5(newPassword) }
        })

        this.refNewPasswordE.current.disabled = true;
        this.refRNewPasswordE.current.disabled = true;
        this.setState({ disabledPasswordUpdate: false })

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

      case 6:
        this.setState({ newPhone: value })
        break;

      default:
        break;
    }
  }

  //Activa/Desactiva el input y el boton para editar el username
  activarEditUser = () => {

    const { disabledUserE } = this.state

    if (!disabledUserE) {
      this.refEditUserE.current.disabled = false;
    } else {
      this.refEditUserE.current.disabled = true;
      this.setState({ disabledUserE: false })
    }
  }

  //Activa/Desactiva el input y el boton para editar el email
  activarEditEmail = () => {

    const { disabledEmailE } = this.state

    if (!disabledEmailE) {
      this.refEditEmailE.current.disabled = false;
    } else {
      this.refEditEmailE.current.disabled = true;
      this.setState({ disabledEmailE: false })
    }
  }

  //Activa/Desactiva el input y el boton para editar el teléfono
  activarEditPhone = () => {

    const { disabledPHone } = this.state

    if (!disabledPHone) {
      this.refEditPhone.current.disabled = false;
      this.setState({ disabledPHone: true })
    } else {
      this.refEditPhone.current.disabled = true;
      this.setState({ disabledPHone: false })
    }
  }

  //Activa/Desactiva el input y el boton para editar la password
  activarEditPassword = () => {


    if (this.refOldPasswordE.current.disabled) {
      this.setState({ disabledPasswordCheckE: true })
      this.refOldPasswordE.current.disabled = false;
    } else {
      this.setState({ disabledPasswordCheckE: false, disabledPasswordUpdate: false })
      this.refOldPasswordE.current.disabled = true;
      this.refNewPasswordE.current.disabled = true;
      this.refRNewPasswordE.current.disabled = true;
    }
  }

  //Activa/Desactiva el input los input para la nueva contraseña
  activarInputsNewPassword = async () => {

    const { oldPassword } = this.state

    const comprobacion = await axios.post('https://mcnreader.herokuapp.com/api/check-editor-password/', null, {
      params: { password: md5(oldPassword) }
    }).then(res => { return parseInt(res.data[0].booleano) })

    if (comprobacion) {
      this.refOldPasswordE.current.disabled = true;
      this.refNewPasswordE.current.disabled = false;
      this.refRNewPasswordE.current.disabled = false;
      this.setState({ disabledPasswordUpdate: true, disabledPasswordCheckE: false })
    }
  }

  render() {

    //TODO IMPLEMENTAR UPDATE NAME EMAIL AND PHONE, EN LECTOR TAMBIEN

    const { user, email, disabledPasswordCheckE, disabledPasswordUpdate, disabledUserE, disabledEmailE,
      newEmail, newName, oldPassword, newPassword, reNewPassword, phone, newPhone, disabledPHone
    } = this.state

    return (
      <div className='profile-container'>

        <div className='profile-details' >
          <div className='h1-section'>Información de la cuenta:</div>
          <div className='profile-name'>Tu usuario: {user}</div>
          <div>Email registrado: {email}</div>
          <div>Teléfono registrado: {phone}</div>
        </div>

        <div className='profile-update'>
          <div className='h1-section'>Actualizar información</div>
          <div>
            <label>Usuario: </label>
            <div className='profile-update-inputs'>
              <input type='text' ref={this.refEditUserE} onChange={(e) => { this.updateState(e, 1) }} value={newName} disabled />
              <button disabled={!disabledUserE} onClick={() => { this.updateUserName() }} >actualizar</button>
              <button onClick={() => { this.activarEditUser() }} >editar</button>
            </div>
          </div>
          <div>
            <label>Email: </label>
            <div className='profile-update-inputs'>
              <input type='email' ref={this.refEditEmailE} onChange={(e) => { this.updateState(e, 2) }} value={newEmail} disabled />
              <button disabled={!disabledEmailE} onClick={() => { this.updateEmail() }} >actualizar</button>
              <button onClick={() => { this.activarEditEmail() }}>editar</button>
            </div>
          </div>
          <div>
            <label>Phone: </label>
            <div className='profile-update-inputs'>
              <input type='number' ref={this.refEditPhone} onChange={(e) => { this.updateState(e, 6) }} value={newPhone} disabled />
              <button disabled={!disabledPHone} onClick={() => { this.updatePhone() }} >actualizar</button>
              <button onClick={() => { this.activarEditPhone() }}>editar</button>
            </div>
          </div>
          <div>
            <label>Contraseña:</label>
            <div className='profile-update-inputs'>
              <input type='password' ref={this.refOldPasswordE} value={oldPassword} onChange={(e) => { this.updateState(e, 3) }} placeholder='Contraseña actual' disabled />
              <button disabled={!disabledPasswordCheckE} onClick={(e) => { this.activarInputsNewPassword(e) }} >Comprobar</button>
              <button onClick={() => { this.activarEditPassword() }}>editar</button>
            </div>

            <div className='profile-update-inputs'>
              <input type='password' ref={this.refNewPasswordE} onChange={(e) => { this.updateState(e, 4) }} value={newPassword} placeholder='Nueva contraseña' disabled />
              <input type='password' ref={this.refRNewPasswordE} onChange={(e) => { this.updateState(e, 5) }} value={reNewPassword} placeholder='Repetir contraseña' disabled />
              <button disabled={!disabledPasswordUpdate} onClick={() => { this.updatePassword() }} >actualizar</button>
            </div>
          </div>


        </div>
      </div>
    );
  }
}