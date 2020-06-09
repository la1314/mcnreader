import React, { Component } from 'react';
import axios from 'axios';

export default class EditorSMItem extends Component {

    //Este componente es llamado cuando la obra tiene alguna capitulo creado

    constructor(props) {
        super(props);
        this.state = {
            link: this.props.link,
            media: this.props.media,
            obra: this.props.obra,
            activo: 0

        }
    }

    //Crea una media 
    updateSocial = async () => {


        const { media, obra, link } = this.state

        axios.post(`/api/update-social-media/`, null, { params: { obra: obra, media: media, link: link } }).then(()=>{this.setState({ activo: 0 })})

    }


    //Updatea el valor del input en el state link
    updateValue = (e) => {
        const value = e.target.value.replace(' ', '');
        this.setState({ link: value })

        if (value.length > 8) {
            this.setState({ activo: 1 })
        } else {
            this.setState({ activo: 0 })
        }
    }



    render() {

        const { link, activo } = this.state

        return (
            <div className='social-media-item' >
                <label>{this.props.name + ': ' }</label>
                <input type='text' value={link} onChange={(e) => this.updateValue(e)} />
                <button disabled={!activo} onClick={() => this.updateSocial()}>Actualizar</button>
            </div>
        );
    }
}