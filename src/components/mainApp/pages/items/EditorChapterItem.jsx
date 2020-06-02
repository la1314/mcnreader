import React, { Component } from 'react';

export default class EditorChapterItem extends Component {

    //Este componente es llamado cuando la obra tiene alguna capitulo creado
    
    editarChapter = () => {

        localStorage.setItem("chapter", this.props.chapter)
        this.props.changeToEditChapter(this.props.chapter)
    }

    render() {
        return (
            <div className='edit-obra-chapters-list-item' onClick={() => this.editarChapter() } >
                <div className='chapter-item-number'>
                    {this.props.number}
                </div>
                <div className='chapter-item-name'>
                    {this.props.name}
                </div>
              
            </div>
        );
    }
}