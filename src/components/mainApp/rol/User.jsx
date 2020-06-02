import React, { Component } from 'react';
import axios from 'axios';
import Header from '../header/UserHeader.jsx';
import Home from '../pages/Home.jsx';
import Library from '../pages/Library.jsx';
import Profile from '../pages/Profile.jsx';
import Obra from '../pages/ObraLector.jsx'

export default class User extends Component {

  constructor() {
    super();
    this.state = {
      page: 0
    };
  }

  //carga los datos de la pagina actual
  //TODO guardar datos de la obra que se está viendos
  componentDidMount() {

    localStorage.setItem('user', this.props.user)

    if (localStorage.getItem('page')) {

      const n = parseInt(localStorage.getItem('page'));
      this.changePage(n)
    }
  }

  //Renderiza un componente depediento al valor de page 
  renderSwitch = () => {

    const { page, obra } = this.state

    switch (page) {

      case 0:
        return <Home changeToObra={this.changeToObra} />;

      case 1:
        return <Library />;

      case 2:
        return <Profile />;

      case 3:
        return <Obra obra={obra} />;

      default:
        return <Home changeToObra={this.changeToObra} />;
    }
  }

  clearCookie = () => {
    return axios.post('/api/clear', { withCredentials: true })
      .then(function (response) {
        return response.data
      })
  }

  //Función encargada de hacer el logout eliminando el Token de session y la cookie page
  logout = async () => {

    const incognita = await this.clearCookie()

    if (incognita) {

      localStorage.removeItem('page');
      localStorage.removeItem('user');
      localStorage.removeItem('obra');
      this.props.checkAuth()
    }
  }

  //Cambia el state page para mostrar una determinada pagina dependiendo al numero
  changePage = (n) => {

    localStorage.setItem("page", n);
    this.setState({ page: n })
  }

  changeToObra = (obra) => {
    this.setState({ obra: obra }, () => {this.changePage(3)} )
  }

  render() {
    return (

      <div className='main-App'>
        <Header logout={this.logout} changePage={this.changePage} />
        {this.renderSwitch()}
      </div>

    );
  }
}


