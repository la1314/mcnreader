import React, { Component } from 'react';
import axios from 'axios';

export default class MainApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  clearCookie = () => {
    return axios.get('/api/clear')
      .then(function (response) {
        return response.data
      })
  }

  logout = () => {

    if (this.clearCookie()) {
      
      this.props.checkAuth()

    }

    
  }

  render() {
    return (

      <div className='Main-Auth'>
        <p>Holis perras</p>
        <button type="submit" onClick={() => this.logout()} className="btn">
          Limpiar Cookie
       </button>

      </div>

    );
  }
}





