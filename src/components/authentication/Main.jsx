import React, { Component } from 'react';
import axios from 'axios';
import Session from '../sesion/MainSession.jsx';
import MainApp from '../mainApp/MainApp.jsx'

export default class Main extends Component {

  constructor() {
    super();
    this.state = {
      redirect: null
    };
  }

  componentDidMount() {

    this.checkAuth()
  }

  /**
   * Comprueba si existe un token válido, en caso de existir redirige a la app y guarda la ID del token como estado
   * en caso contrario limpia el estado y redirige a session
   */
  checkAuth = async () => {

    const incognita = await axios.get('/api/checkToken')

    //TODO Puede que tenga que encryptar muy posiblemente

    if (incognita.data) {
      this.setState({redirect: true, idUser: incognita.data.user, rol: incognita.data.rol})
    }else{
      this.setState({redirect: false, idUser: ''})
    }
    
  }

  render() {

    const { redirect } = this.state;
    if (redirect === null) { return null }
    return (

      <div className="App">

        {redirect ?
          <MainApp checkAuth={this.checkAuth} />
          :
          <Session checkAuth={this.checkAuth} />
        }
      </div>

    );
  }
}