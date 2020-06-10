import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

export default class HomeTop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lista: []
        }
    }

    //Carga los datos al state
    componentDidMount() {
        this.findTop()
    }

    //Carga las 10 Obras con mejor media
    findTop = () => {
        axios.post(`/api/find-top-10/`).then((res) => {
            this.setState({ lista: res.data })
        })
    }

    render() {

        const { lista } = this.state;

        return (
            <div className='home-top-container'>
                {
                    lista.map((item, index) => {
                        return [
                            <div className='top-10' onClick={() => { this.props.verObra(item.ID) }} key={'pl-l' + index} >
                                <div className='cover-tipo'>{item.TIPO}</div>
                                <img alt='cover de la obra' src={item.COVER}></img>
                                <div className='cover-name'>{item.NOMBRE}</div>
                                <div className='cover-score'>{'Puntuación: ' + (Math.round(item.MEDIA * 100) / 100)}</div>
                            </div>
                        ]
                    })
                }

            </div>
        );
    }
}