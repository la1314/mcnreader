import React, { Component } from 'react';

export default class EditorObraItem extends Component {
    
  render() {
    return (
    <div className='editor-cover-list'>
        <div className='editor-cover-image-container'>
            <img alt='cover-obra'  className='editor-cover-image' src={this.props.image} ></img>
        </div>
        <div className='editor-cover-obra-name'>
            {this.props.name}
        </div>
    </div>
    );
  }
}