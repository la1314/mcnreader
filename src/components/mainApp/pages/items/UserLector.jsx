import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

export default class UserLector extends Component {

    //Este componente es llamado cuando la obra tiene alguna capitulo creado
    
    constructor(props) {
        super(props);
        this.state = {
           activo: 0,
           tipo: props.tipo,
        }
    }

    //Carga los datos al state
    async componentDidMount() {
        this.setState({activo: await this.checkReader()})
    }

    //Compruba si la obra tiene una media
    checkReader = () => {
        const {tipo} = this.state
        return axios.post(`https://mcnreader.herokuapp.com/api/check-reader/`, null, { params: { tipo: tipo} }).then((res)=>{return res.data[0].booleano})
    }

    //Crea una media 
    createReader = async () =>{

        const {tipo} = this.state
        const incognita = await this.checkReader();

        if (!incognita) {
           
            axios.post(`https://mcnreader.herokuapp.com/api/create-reader/`, null, { params: { tipo:tipo } }).then(this.setState({activo:1})).then(()=>{this.props.findLectores()})
        }
    }

    //Elimina una media
    deleteReader = async () =>{

        const {tipo} = this.state
        const incognita = await this.checkReader();

        if (incognita) {
           axios.post(`https://mcnreader.herokuapp.com/api/delete-reader/`, null, { params: { tipo:tipo } }).then(this.setState({activo:0})).then(()=>{this.props.findLectores()})
        }
    }

    render() {

        const {activo} = this.state

        return (
            <div className='reader-item' >
                <label>{this.props.name + ': '}</label>
                {activo ? <button onClick={ () => this.deleteReader()}>Eliminar</button> : <button onClick={ () => this.createReader()}>Añadir</button>}
            </div>
        );
    }
}