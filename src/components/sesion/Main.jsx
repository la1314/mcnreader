import React, { Component } from 'react';
import "./session.scss";
import Register from './Register';
import Login from './Login';
import Recover from './Recover';
import Logo from './logo.png';


export default class Main extends Component {
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

  render() {

    const { centro, derecha} = this.state;
    const current = ['Login', 'Register', 'Recover',];
    //TODO por implementar el cambio de pestañas a la derecha
    return (

      <div className='main-container'>
        <div className='logo-container'>
          <img className='logo-app'
           src={Logo}
           alt='app logo'
           ></img>
        </div>
        <div className='main-session-container' >
          <div className="session-container">
            <div className="session-cent" ref={ref => (this.container = ref)}>
              {centro === 0 && (
                <Login containerRef={ref => (this.current = ref)} />
               
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



