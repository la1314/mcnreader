import React, { Component } from 'react';
import "./session.scss";
import Register from './Register';
import Login from './Login'
import Recover from './Recover'

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      izquierda: 0,
      centro: 1,
      derecha: 2
    };
  }

  //Intercambia los estados de centro e izquierdo
  changeStateLeft = () => {
    const { izquierda, centro } = this.state;
    this.setState({
      izquierda: centro,
      centro: izquierda
    });
  }

  //Intercambia los estados de centro y derecha
  changeStateRight = () => {
    const { derecha, centro } = this.state;
    this.setState({
      derecha: centro,
      centro: derecha
    });
  }

  render() {

    const { izquierda, centro, derecha } = this.state;
    const current = ['Recover', 'Login', 'Register'];

    return (
      <div className='main-session-container' >
        <div className="session-container">
          <Lateral
            className='session-izq'
            current={current[izquierda]}
            onClick={this.changeStateLeft}
          />
          <div className="session-cent" ref={ref => (this.container = ref)}>
            {centro === 0 && (
              <Recover containerRef={ref => (this.current = ref)} />
            )}
            {centro === 1 && (
              <Login containerRef={ref => (this.current = ref)} />
            )}
            {centro === 2 && (
              <Register containerRef={ref => (this.current = ref)} />
            )}
          </div>
          <Lateral
            className='session-der'
            current={current[derecha]}
            onClick={this.changeStateRight}
          />
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



