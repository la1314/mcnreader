import React, { Component } from 'react';
import "./session.scss";
import Register from './pages/Register';
import Login from './pages/Login';
import Recover from './pages/Recover';
import axios from 'axios';
//import Logo from './logo.png';

export default class MainSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      centro: 0,
      derecha: 1,
      derecha2: 2
    };
  }

  //Intercambia los estados de centro y derecha
  changeStateRight = () => {
    const { centro, derecha, derecha2 } = this.state;
    this.setState({
      centro: derecha,
      derecha: derecha2,
      derecha2: centro
    });
  }

  //Comprueba que el usuario actual exista 0/1
  checkUser = async (username) => {

    return await axios.post('/api/check-user/', null, {
      params: {
        user: username
      }
    }).then( function (res) {
      // handle success
      return res.data.booleano
    })
  }

  render() {

    const { centro, derecha } = this.state;
    const current = ['Login', 'Register', 'Recover',];
    //TODO por implementar el cambio de pestañas a la derecha
    return (

      <div className='main-container'>
        <div className='logo-container'>
          <img className='logo-app'
            //src={Logo}
            alt='app logo'
          ></img>
        </div>
        <div className='main-session-container' >
          <div className="session-container">
            <div className="session-cent" ref={ref => (this.container = ref)}>
              {centro === 0 && (
                <Login checkAuth={this.props.checkAuth} checkUser={this.checkUser} containerRef={ref => (this.current = ref)} />

              )}
              {centro === 1 && (
                <Register containerRef={ref => (this.current = ref)} />
              )}
              {centro === 2 && (

                <Recover containerRef={ref => (this.current = ref)} />
              )}
            </div>
            <Lateral
              className='session-der'
              current={current[derecha]}
              onClick={this.changeStateRight}
            />
          </div>
        </div>
      </div>
    );
  }
}

const Lateral = props => {
  return (
    <div
      className={props.className}
      onClick={props.onClick}
    >
      <div className="inner-container">
        <div className="text">{props.current}</div>
      </div>
    </div>
  );
};



