import React, { Component } from 'react';

export default class Register extends Component {
    
  constructor(props) {
    super(props);
    this.state = { Username: "" };
    this.state = { Password: "" };
    this.state = { Email: "" };

  }

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
            Send Number to Email
          </button>
        </div>
      </div>
    );
  }
}