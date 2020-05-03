import React, { Component } from 'react';
import axios from 'axios';
import Session from '../sesion/MainSession.jsx';
import MainApp from '../withAuth/MainApp.jsx'

export default class Main extends Component {

  constructor() {
    super();
    this.state = {
      redirect: false
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
    if (incognita.data) {
      this.setState({redirect: true, idUser: incognita.data})
    }else{
      this.setState({redirect: false, idUser: ''})
    }
    
  }


  render() {

    const { redirect } = this.state;

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


/**
 * {redirect === 0 && (
          <Session check={this.checkLogin} />
        )}
        {redirect === 1 && (
          <Main check={this.checkLogin} />
        )}
*/