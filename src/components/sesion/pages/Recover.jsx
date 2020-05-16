import React, { Component } from 'react';
//import axios from 'axios';

export default class Recover extends Component {
    
  constructor(props) {
    super(props);
    this.state = { email: "" };
  }

  //TODO Implementar consultar al email y añadir stado booleano de este

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Recover</div>
        <div className="content">
          <div className="form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" placeholder="email" />
            </div>
          </div>
        </div>
        <div className="footer">
          <button type="button" className="btn">
            Send Email
          </button>
        </div>
      </div>
    );
  }
}