import React, { Component } from 'react';
import axios from 'axios';
import Header from '../header/EditorHeader.jsx';
import Gestor from '../pages/Gestor.jsx';
import Library from '../pages/Library.jsx';
import Profile from '../pages/Profile.jsx';
import Obra from '../pages/Obra.jsx';
import EditChapter from '../pages/EditChapter.jsx';

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

    const { page, obraEditID, chapterEditID } = this.state
    const { user } = this.props

    switch (page) {

      case 0:
        return <Gestor user={user} changeToEditObra={this.changeToEditObra} />;

      case 1:
        return <Library />;

      case 2:
        return <Profile />;

      case 3:
        return <Obra user={user} obraID={obraEditID} changeToEditChapter={this.changeToEditChapter} />;

      case 4:
        return <EditChapter user={user} obraID={obraEditID} changeToEditObra={this.changeToEditObra} chapter={chapterEditID} />;

      default:
        return <Gestor user={user} changeToEditObra={this.changeToEditObra} />;
    }
  }


  //Elimina el Token de session para hacer el Logout
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
      this.props.checkAuth()
    }
  }

  //Cambia el state page para mostrar una determinada pagina dependiendo al numero
  changePage = (n) => {

    localStorage.setItem("page", n);
    this.setState({ page: n })
  }


  //TODO accede a la edición de una obra
  changeToEditObra = (obra) => {

    this.setState({ obraEditID: obra }, () => {this.changePage(3)} )
  }

  changeToEditChapter = (chapter) => {

    this.setState({ chapterEditID: chapter }, () => {this.changePage(4)} )

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


