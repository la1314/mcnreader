import React, { Component } from 'react';
import axios from 'axios';
const md5 = require('md5');
axios.defaults.withCredentials = true;

export default class ProfileUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '', email: '',
      newName: '', newEmail: '',
      oldPassword: '',
      newPassword: '', reNewPassword: '',
      usernameBool: false, repassBool: false,
      emailBool: false, passBool: false,
      disabledUser: false, disabledEmail: false,
      disabledPasswordCheck: false,
      disabledPasswordUpdate: false,
      tipos: [], lectores: []
    }

    this.refEditUser = React.createRef();
    this.refEditEmail = React.createRef();
    this.refOldPassword = React.createRef();
    this.refNewPassword = React.createRef();
    this.refRNewPassword = React.createRef();

  }

  //TODO
  // Modificar Editor, no posee reader
  //añadir botones entre otras cosas más

  //Carga los datos al state
  componentDidMount() {

    this.findDetailts();
    this.findTipos();
    this.findLectores();
  }

  // Carga los datos del usuario al state
  findDetailts = () => {
    axios.post('https://mcnreader.herokuapp.com/api/find-user-details/')
      .then(res => {

        this.setState({
          user: res.data.USERNAME,
          email: res.data.EMAIL,
          newName: res.data.USERNAME,
          newEmail: res.data.EMAIL
        })
      })
  }

  // Carga los diferentes tipos de obras al state
  findTipos = () => {
    axios.post('https://mcnreader.herokuapp.com/api/find-tipos/')
      .then(res => {
        this.setState({
          tipos: res.data,
        })
      })
  }

  //Carga los tipos de lectores del usuario al state lectores
  findLectores = () => {
    axios.post('https://mcnreader.herokuapp.com/api/find-lectores/')
      .then(res => {
        this.setState({
          lectores: res.data
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
          axios.post('https://mcnreader.herokuapp.com/api/edit-username/', null, {
            params: { username: newName }
          })
          this.refEditUser.current.disabled = true;
          this.setState({ disabledUser: true })
        } else {
          this.setState({ disabledUser: false })
        }
      })
    }
  }

  //Actualiza el nombre del Usuario
  updateUserName = () => {
    const { newName } = this.state
    axios.post('https://mcnreader.herokuapp.com/api/edit-username/', null, {
      params: { username: newName }
    }).then(() => { this.findDetailts() })
    this.setState({ disabledUserE: false })
    this.refEditUser.current.disabled = true;

  }

  //Verifica que el correo sea nuevo 1:EXISTS 0:NOT EXISTS
  checkEmail = () => {

    const { newEmail } = this.state
    if (newEmail.length > 8) {
      axios.post('https://mcnreader.herokuapp.com/api/check-email/', null, {
        params: { email: newEmail }
      }).then(res => {
        if (parseInt(res.data[0].booleano) === 0) {
          axios.post('https://mcnreader.herokuapp.com/api/edit-email/', null, {
            params: { email: newEmail }
          })
          this.setState({ disabledEmail: true })
        } else {
          this.setState({ disabledEmail: false })
        }
      })
    }
  }

  //actualiza el email del Usuario
  updateEmail = () => {

    const { newEmail } = this.state
    axios.post('https://mcnreader.herokuapp.com/api/edit-email/', null, {
      params: { email: newEmail }
    }).then(() => { this.findDetailts() })
    this.refEditEmail.current.disabled = true;
    this.setState({ disabledEmailE: false })
  }

  //Comprueba si la preferencia existe, en caso contrario la crea
  activarPreferencia = async (id) => {

    const incognita = await axios.post('https://mcnreader.herokuapp.com/api/check-reader/', null, {
      params: { tipo: id }
    }).then(res => {
      return res.data[0].booleano;
    })

    if (!incognita) {
      axios.post('https://mcnreader.herokuapp.com/api/create-reader/', null, {
        params: { tipo: id }
      }).then(() => { this.findLectores() })
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
        axios.post('https://mcnreader.herokuapp.com/api/edit-user-password/', null, {
          params: { password: md5(newPassword) }
        })
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

  //Activa/Desactiva el input los input para la nueva contraseña
  activarInputsNewPassword = async () => {

    const { oldPassword } = this.state

    const comprobacion = await axios.post('https://mcnreader.herokuapp.com/api/check-user-password/', null, {
      params: { password: md5(oldPassword) }
    }).then(res => { return parseInt(res.data[0].booleano) })

    if (comprobacion) {
      this.refOldPassword.current.disabled = true;
      this.refNewPassword.current.disabled = false;
      this.refRNewPassword.current.disabled = false;
      this.setState({ disabledPasswordUpdate: true, disabledPasswordCheck: false })
    }
  }

  //Updatea el radio del lector
  updateLector = (e, id) => {

    console.log(e.target.value);


    switch (e.target.value) {

      case 'PAGINADA':
        axios.post('https://mcnreader.herokuapp.com/api/update-reader-pc/', null, {
          params: { tipo: id, cascada: 0, paginada: 1 }
        }).then(() => { this.findLectores() })
        break;

      case 'CASCADA':
        axios.post('https://mcnreader.herokuapp.com/api/update-reader-pc/', null, {
          params: { tipo: id, cascada: 1, paginada: 0 }
        }).then(() => { this.findLectores() })
        break;

      case 'OCCIDENTAL':
        axios.post('https://mcnreader.herokuapp.com/api/update-reader-oroc/', null, {
          params: { tipo: id, occidental: 1, oriental: 0 }
        }).then(() => { this.findLectores() })
        break;

      case 'ORIENTAL':
        axios.post('https://mcnreader.herokuapp.com/api/update-reader-oroc/', null, {
          params: { tipo: id, occidental: 0, oriental: 1 }
        }).then(() => { this.findLectores() })
        break;

      case 'SIMPLE':
        axios.post('https://mcnreader.herokuapp.com/api/update-reader-oroc/', null, {
          params: { tipo: id, occidental: 0, oriental: 0 }
        }).then(() => { this.findLectores() })
        break;

      default:
        break;
    }

  }


  render() {

    const { user, email, disabledPasswordCheck, disabledPasswordUpdate, disabledUser, disabledEmail,
      newEmail, newName, oldPassword, newPassword, reNewPassword, tipos, lectores
    } = this.state

    return (
      <div className='profile-container'>

        <div className='profile-details' >
          <div className='h1-section' >Información de la cuenta</div>
          <div className='profile-name'>Tu usuario: {user}</div>
          <div>Email registrado: {email}</div>
        </div>

        <div className='profile-update'>
          <div className='h1-section'>Actualizar información</div>
          <div>
            <label>Usuario: </label>
            <div className='profile-update-inputs'>
              <input type='text' ref={this.refEditUser} onChange={(e) => { this.updateState(e, 1) }} value={newName} disabled />
              <button disabled={!disabledUser} onClick={() => { this.updateUserName() }} >actualizar</button>
              <button onClick={() => { this.activarEditUser() }} >editar</button>
            </div>
          </div>
          <div>
            <label>Email: </label>
            <div className='profile-update-inputs'>

              <input type='email' ref={this.refEditEmail} onChange={(e) => { this.updateState(e, 2) }} value={newEmail} disabled />
              <button disabled={!disabledEmail} onClick={() => { this.updateEmail() }} >actualizar</button>
              <button onClick={() => { this.activarEditEmail() }}>editar</button>
            </div>
          </div>
          <div>
            <label>Contraseña:</label>
            <div className='profile-update-inputs'>
              <input type='password' ref={this.refOldPassword} value={oldPassword} onChange={(e) => { this.updateState(e, 3) }} placeholder='Contraseña actual' disabled />
              <button disabled={!disabledPasswordCheck} onClick={(e) => { this.activarInputsNewPassword(e) }} >Comprobar</button>
              <button onClick={() => { this.activarEditPassword() }}>editar</button>
            </div>
            <div className='profile-update-inputs'>
              <input type='password' ref={this.refNewPassword} onChange={(e) => { this.updateState(e, 4) }} value={newPassword} placeholder='Nueva contraseña' disabled />
              <input type='password' ref={this.refRNewPassword} onChange={(e) => { this.updateState(e, 5) }} value={reNewPassword} placeholder='Repetir contraseña' disabled />
              <button disabled={!disabledPasswordUpdate} onClick={() => { this.updatePassword() }} >actualizar</button>
            </div>
          </div>
        </div>

        <div className='profile-lector'>

          <div className='h1-section'>Preferencias de lectura</div>

          <div className='profile-lector-tipos'>
            <div className='profile-lector-create'>
              {tipos.map((item, index) => {
                return [
                  <div key={'pl' + index}>
                    <label>{item.NOMBRE}</label>
                    <button onClick={() => { this.activarPreferencia(item.ID) }} >Activar</button>
                  </div>
                ]
              })}
            </div>

            <div className='profile-lector-edit'>
              {lectores.map((item, index) => {
                return [
                  <div className='profile-lector-options' key={'ple' + index}>
                    <label>{item.NOMBRE}: </label>
                    <div className='profile-lector-edit-pc'>
                      <div>
                        <label htmlFor={'lector' + index}>PAGINADA</label>
                        <input type="radio" value='PAGINADA' checked={item.PAGINADA ? true : false} onChange={(e) => { this.updateLector(e, item.ID) }} name={"radio-lector" + item.NOMBRE} />
                      </div>
                      <div>
                        <label htmlFor={'lector' + index}>CASCADA</label>
                        <input type="radio" value='CASCADA' checked={item.CASCADA ? true : false} onChange={(e) => { this.updateLector(e, item.ID) }} name={"radio-lector" + item.NOMBRE} />
                      </div>
                    </div>

                    <div className='profile-lector-edit-ocors'>
                      <div>
                        <label htmlFor={'lector' + index}>SIMPLE</label>
                        <input type="radio" value='SIMPLE' checked={(!item.OCCIDENTAL && !item.ORIENTAL) ? true : false} onChange={(e) => { this.updateLector(e, item.ID) }} name={"radio-lector-ds" + item.NOMBRE} />
                      </div>
                      <div>
                        <label htmlFor={'lector' + index}>OCCIDENTAL</label>
                        <input type="radio" value='OCCIDENTAL' checked={item.OCCIDENTAL ? true : false} onChange={(e) => { this.updateLector(e, item.ID) }} name={"radio-lector-ds" + item.NOMBRE} />
                      </div>
                      <div>
                        <label htmlFor={'lector' + index}>ORIENTAL</label>
                        <input type="radio" value='ORIENTAL' checked={item.ORIENTAL ? true : false} onChange={(e) => { this.updateLector(e, item.ID) }} name={"radio-lector-ds" + item.NOMBRE} />
                      </div>
                    </div>
                  </div>
                ]
              })}
            </div>
          </div>

        </div>

      </div>
    );
  }
}