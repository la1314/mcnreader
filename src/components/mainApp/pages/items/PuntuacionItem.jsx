import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

export default class PuntuacionItem extends Component {

    //Este componente es llamado cuando el editor tiene alguna obra creada

    constructor(props) {
        super(props);
        this.state = {
            obra: props.obra,
            puntos: 0,
            votos: [1, 2, 3, 4, 5],
            avg: 'N/P',
            imgSrc: ['https://tuinki.gupoe.com/media/app-images/p0.png', 'https://tuinki.gupoe.com/media/app-images/p1.png']
        }
    }

    //Carga los datos al state
    componentDidMount() {


        this.cargarPuntos();
        this.getAVG();

    }

    //Intentar cargar los puntos en caso de existir
    cargarPuntos = async () => {

        const incognita = await this.checkPuntuacion();
        if (incognita) {
            this.setState({ puntos: await this.findPuntuaciones() })
        }
    }

    //Comprueba si el lector ha votado
    checkPuntuacion = () => {
        const { obra } = this.state
        return axios.post(`/api/check-user-vote/`, null, { params: { obra: obra } }).then((res) => { return res.data.booleano })
    }

    //Actualiza una puntuación
    updatePuntuacion = async () => {

        const { puntos, obra } = this.state

        const incognita = await this.checkPuntuacion();

        if (!incognita) {
            this.newPuntuacion(puntos)

        } else {
            axios.post(`/api/update-user-vote/`, null, { params: { obra: obra, puntos: puntos } }).then(() => { this.getAVG() })
        }

    }

    //Crea una puntuación
    newPuntuacion = (puntos) => {
        const { obra } = this.state
        axios.post(`/api/new-user-vote/`, null, { params: { obra: obra, puntos: puntos } }).then(() => { this.getAVG() })
    }

    //Recupera la puntuación del lector
    findPuntuaciones = () => {
        const { obra } = this.state
        return axios.post(`/api/find-user-vote/`, null, { params: { obra: obra } }).then((res) => { return res.data.PUNTOS })
    }

    //Obtiene la media de puntuaciones de la obra
    getAVG = () => {
        const { obra } = this.state
        axios.post(`/api/find-avg-obra/`, null, { params: { obra: obra } }).then((res) => { this.setState({ avg: (Math.round(res.data.MEDIA * 100) / 100) || 'N/P' }) })
    }

    //Función llamada al hacer click
    marcarPuntuacion = (puntos) => {


        this.setState({ puntos: puntos }, () => { this.updatePuntuacion() })
    }

    render() {

        const { avg, puntos, votos, imgSrc } = this.state

        return (
            <div className='puntuacion-container'>
                <div className='puntos-item'>
                    {votos.map((value, index) => {

                        return [
                            <div key={'vo' + index} className='puntos-img' >
                                <img onClick={() => { this.marcarPuntuacion(value) }} alt='' src={(value <= puntos) ? imgSrc[1] : imgSrc[0]} ></img>
                            </div>
                        ]
                    })}

                    <div className='avg-obra'>
                        <div>{avg}</div>
                        
                    </div>
                </div>

            </div>
        );
    }
}