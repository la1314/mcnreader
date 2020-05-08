import React, { Component} from 'react';
import axios from 'axios';
import Header from './Header.jsx';
import Home from './pages/Home.jsx';
import Library from './pages/Library.jsx';
import Profile from './pages/Profile.jsx';
import "./mainApp.scss";

export default class MainApp extends Component {

  constructor() {
    super();
    this.state = {
      page: 0
    };
  }


  componentDidMount() {
    
    if (localStorage.getItem('page')) {
      const n = parseInt(localStorage.getItem('page'));
      this.changePage(n)
    } 
  }


  //Renderiza un componente depediento al valor de page 
  renderSwitch = () => {

    const {page} = this.state

    switch (page) {

      case 0:
        return <Home />;

      case 1:
        return <Library />;

      case 2:
        return <Profile />;

      default:
        return  <Home />;
    }
  }

  clearCookie = () => {
    return axios.get('/api/clear')
      .then(function (response) {
        return response.data
      })
  }

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

  render() {
    return (
      
      <div className='main-App'>
        <Header logout={this.logout} changePage={this.changePage} />
        {this.renderSwitch()}
      </div>

    );
  }
}




