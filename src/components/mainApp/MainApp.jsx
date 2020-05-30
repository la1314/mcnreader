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

  componentDidMount() {
    localStorage.setItem("user", this.props.user)
  }

  render() {

    const { rol } = this.state

    return (

      <div className='main-App-container'>

        {rol === 'READER' && (
          <User user={this.props.user} checkAuth={this.props.checkAuth} />
        )}

        {rol === 'EDITOR' && (

          <Editor user={this.props.user} checkAuth={this.props.checkAuth} />
        )}

      </div>

    );
  }
}






