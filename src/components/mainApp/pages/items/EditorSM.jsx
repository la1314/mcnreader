import React, { Component } from 'react';
import axios from 'axios';

export default class EditorSM extends Component {

    //Este componente es llamado cuando la obra tiene alguna capitulo creado
    
    constructor(props) {
        super(props);
        this.state = {
           activo: 0,
           media: this.props.media,
           obra: this.props.obra,
        }
    }

    //Carga los datos al state
    async componentDidMount() {

        this.setState({activo: await this.checkFollow()})

    }

    //Compruba si la obra tiene una media
    checkFollow = () => {
        const {media, obra} = this.state
        return axios.post(`/api/check-social-media/`, null, { params: { media: media, obra: obra } }).then((res)=>{return res.data.booleano})
    }

    //Crea una media 
    createSocial = async () =>{

        const {media, obra} = this.state

        const incognita = await this.checkFollow();
       
        
        if (!incognita) {
           
            axios.post(`/api/new-social-media/`, null, { params: { obra: obra, media:media } }).then(this.setState({activo:1})).then(()=>{this.props.updateSocialMediaState()})
        }
    }

    //Elimina una media
    deleteSocial = async () =>{

        const {media, obra} = this.state
        const incognita = await this.checkFollow();

        if (incognita) {
           
           axios.post(`/api/delete-social-media/`, null, { params: { obra: obra, media:media } }).then(this.setState({activo:0})).then(()=>{this.props.updateSocialMediaState()})
        }
    }

    render() {

        const {activo} = this.state

        return (
            <div className='social-media-item' >
                <label>{this.props.name}</label>
                {activo ? <button onClick={ () => this.deleteSocial()}>Eliminar</button> : <button onClick={ () => this.createSocial()}>Añadir</button>}
            </div>
        );
    }
}