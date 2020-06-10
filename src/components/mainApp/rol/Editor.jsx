import React, { Component } from 'react';
import axios from 'axios';
import Header from '../header/EditorHeader.jsx';
import Gestor from '../pages/Gestor.jsx';
import Library from '../pages/Library.jsx';
import ProfileE from '../pages/ProfileEditor.jsx';
import ObraE from '../pages/ObraEditor.jsx';
import EditChapter from '../pages/EditChapter.jsx';
import ObraL from '../pages/ObraLector.jsx';
import Reader from '../pages/Reader.jsx';
axios.defaults.withCredentials = true;

export default class Editor extends Component {

  constructor() {
    super();
    this.state = {
      page: 0,
      obraEditID: '',
      chapterEditID: ''
    };
  }

  //carga los datos de la pagina actual
  //TODO guardar datos de la obra que se está viendos
  componentDidMount() {

    if (localStorage.getItem('page')) {
      const n = parseInt(localStorage.getItem('page'));
      this.changePage(n)
    }
  }


  //Renderiza un componente depediento al valor de page 
  renderSwitch = () => {

    const { page, obraEditID, chapterEditID, chapter } = this.state
    const { user } = this.props
    const obra = obraEditID;
    switch (page) {

      case 0:
        return <Gestor user={user} changeToEditObra={this.changeToEditObra} />;

      case 1:
        return <Library changeToObra={this.changeToObra} />;

      case 2:
        return <ProfileE />;

      case 3:
        return <ObraL obra={obra} changeToChapter={this.changeToChapter} />;

      case 4:
        return <Reader chapter={chapter} />;

      case 5:
        return <EditChapter user={user} obraID={obraEditID} changeToEditObra={this.changeToEditObra} chapter={chapterEditID} />;

      case 6:
        return <ObraE user={user} obraID={obraEditID} changeToEditChapter={this.changeToEditChapter} />;

      default:
        return <Gestor user={user} changeToEditObra={this.changeToEditObra} />;
    }
  }

  //Accede a un capítulo
  changeToChapter = (chapter) => {
    this.setState({ chapter: chapter }, () => { this.changePage(4) })
  }

  //Accede a una obra
  changeToObra = (obra) => {
    this.setState({ obra: obra }, () => { this.changePage(3) })
  }


  //Elimina el Token de session para hacer el Logout
  clearCookie = () => {
    return axios.post('/api/clear')
      .then(function (response) {
        return response.data
      })
  }

  //Función encargada de hacer el logout eliminando el Token de session y la cookie page
  logout = async () => {

    const incognita = await this.clearCookie()

    if (incognita) {

      localStorage.removeItem('page');
      localStorage.removeItem('chapter');
      localStorage.removeItem('obraEdit');
      localStorage.removeItem('user');
      this.props.checkAuth()
    }
  }

  //Cambia el state page para mostrar una determinada pagina dependiendo al numero
  changePage = (n) => {

    localStorage.setItem("page", n);
    this.setState({ page: n })
  }


  //Accede a la edición de una obra
  changeToEditObra = (obra) => {
    this.setState({ obraEditID: obra }, () => { this.changePage(6) })
  }

  //Accede a la edición de un capitulo
  changeToEditChapter = (chapter) => {
    this.setState({ chapterEditID: chapter }, () => { this.changePage(5) })
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


