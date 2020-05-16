import React, { Component } from 'react';
import User from './rol/User.jsx';
import Editor from './rol/Editor.jsx';
import "./mainApp.scss";

export default class MainApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rol: this.props.rol
    };
  }

  render() {

    const { rol } = this.state

    return (

      <div className='main-App-container'>

        {rol === 'READER' && (
          <User checkAuth={this.props.checkAuth} />
        )}

        {rol === 'EDITOR' && (

          <Editor checkAuth={this.props.checkAuth} />
        )}

      </div>

    );
  }
}






