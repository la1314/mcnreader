import React, { Component } from 'react';

export default class EditorObraItem extends Component {

    //Este componente es llamado cuando el editor tiene alguna obra creada
    
    editarObra = () => {
        
        Promise.resolve(localStorage.setItem("obraEdit", this.props.obra)).then(this.props.changeToEditObra(this.props.obra))

    }

    render() {
        return (
            <div className='editor-cover-list'>
                <div className='editor-cover-image-container'>
                    <img alt='cover-obra' className='editor-cover-image' src={this.props.image} ></img>
                </div>
                <div className='editor-cover-obra-name'>
                    {this.props.name}
                </div>
                <button onClick={() => this.editarObra() } >Editar Obra</button>
            </div>
        );
    }
}