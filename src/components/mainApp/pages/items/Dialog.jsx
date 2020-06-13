import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Dialog extends Component {

    //Cuando es llamado desmonta el contenedor de la Carta
    closeCard = () => {

        let contenedor = document.getElementById('dialog');
        ReactDOM.unmountComponentAtNode(contenedor);
    }


    render() {
        return (

            <div className='dialog' key={this.props.titulo + "_poke"} >
                <button className='cerrar-dialog' onClick={() => this.closeCard()} >X</button>
                <div className='dialog-hb-container'>
                    <div className='dialog-head'>
                        <div className='descripcion'>{this.props.titulo}</div>
                    </div>
                    <div className='dialog-body'>
                        <div className='descripcion'>{this.props.mensaje}</div>
                    </div>
                </div>

            </div>
        );

    }
}
