import React, { Component } from 'react';
import axios from 'axios';

export default class ProfileUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '', email: '',
      oldPassword: '',
      newPassword: '', reNewPassword: '',
      usernameBool: false,
      oldPassBool: false,
      repassBool: false,
      emailBool: false,
      passBool: false
    }
  }

  componentDidMount() {
    this.findDetailts()
  }

  findDetailts = () => {
    axios.post('/api/find-user-details/')
      .then( res => { 

        this.setState({
          user: res.data.USERNAME,
          email: res.data.EMAIL
        })

      })
  }

  //carga los datos de la pagina actual
  comprobarPassword = () => {

  }
  //carga los datos del usuario al state
  findUserDetailts = () => {


  }

  //Compara las contraseñas
  compararPassword = () => {

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

  //Actualiza los estados del usuario
  updateNewChapterState = (e, type) => {

    const value = e.target.value;

    switch (type) {
      case 1:
        this.setState({ user: value })
        break;

      case 2:
        this.setState({ email: value })
        break;

      case 3:
        this.setState({ oldPassword: value })
        break;

      case 4:
        this.setState({ newPassword: value })
        break;

      case 5:
        this.setState({ reNewPassword: value })
        break;

      default:
        break;
    }
  }

  render() {

    const{user, email} = this.state

    return (
      <div>Perfil</div>
    );
  }
}