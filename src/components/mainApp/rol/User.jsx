import React, { Component } from 'react';
import axios from 'axios';
import Header from '../header/UserHeader.jsx';
import Home from '../pages/Home.jsx';
import Library from '../pages/Library.jsx';
import ProfileU from '../pages/ProfileUser.jsx';
import ObraL from '../pages/ObraLector.jsx';
import Reader from '../pages/Reader.jsx';
axios.defaults.withCredentials = true;

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

    const { page, obra, chapter } = this.state

    switch (page) {

      case 0:
        return <Home changeToObra={this.changeToObra} />;

      case 1:
        return <Library changeToObra={this.changeToObra} />;

      case 2:
        return <ProfileU />;

      case 3:
        return <ObraL obra={obra} changeToChapter={this.changeToChapter} />;

      case 4:
        return <Reader chapter={chapter} />;

      default:
        return <Home changeToObra={this.changeToObra} />;
    }
  }

  //Limpia el token se session para hacer el logout
  clearCookie = () => {
    return axios.post('https://mcnreader.herokuapp.com/api/clear')
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
      localStorage.removeItem('tipo');
      localStorage.removeItem('chapter');
      localStorage.removeItem('obraEdit');
      this.props.checkAuth()
    }
  }

  //Cambia el state page para mostrar una determinada pagina dependiendo al numero
  changePage = (n) => {

    localStorage.setItem("page", n);
    this.setState({ page: n })
  }

  //Accede a una obra
  changeToObra = (obra) => {
    this.setState({ obra: obra }, () => { this.changePage(3) })
  }

  //Accede a un capítulo
  changeToChapter = (chapter) => {
    this.setState({ chapter: chapter }, () => { this.changePage(4) })
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

