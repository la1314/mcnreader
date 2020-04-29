import React, { Component } from 'react';
import axios from 'axios';
import Session from '../sesion/MainSession.jsx';
import MainApp from '../withAuth/MainApp.jsx'

export default class Main extends Component {

  constructor() {
    super();
    this.state = {
      redirect: 0
    };
  }

  componentDidMount() {

    this.checkAuth()

  }

  checkAuth = () => {

    axios.get('/api/checkToken')
      .then(res => {
        // handle success
         this.updateRedirect(res.data)
      })
  }

  updateRedirect = (value) => {
    
    this.setState({
      redirect: value
    }, function () {
      this.forceUpdate()
    })
  }

  render() {
    
    const { redirect } = this.state;

    return (

      <div className="App">
        
        {redirect === 0 && (
          <Session checkAuth={this.checkAuth} />
        )}
        {redirect === 1 && (
          <MainApp checkAuth={this.checkAuth} />
        )}
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