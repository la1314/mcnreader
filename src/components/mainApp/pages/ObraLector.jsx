import React, { Component } from 'react';
import axios from 'axios';
import './pages.scss';

export default class ObraEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            obra: '', user: '', nombre: '', autor: '', lanzamiento: '',
            listSocialMedia: [], demografia: '',
            generos: [], socialMedia: [], tipo: '',
            visibilidad: '', listChapters: [], cover: '',
            descripcion: '', coverHash: Date.now(),
        }
    }


    //Carga los datos al montarse el componente
    componentDidMount() {

        if (localStorage.getItem('obra')) {
            const n = parseInt(localStorage.getItem('obra'));
            const user = parseInt(localStorage.getItem('user'));
            this.setState({ obra: n, user: user }, () => { this.findDetailtObra() })
        }

    }

    //TODO IMPLEMENTAR SOCIAL MEDIA EN OBRA TAMBIEN

    //Obtiene información de la obra
    findDetailtObra = () => {

        const { obra } = this.state

        axios.post('/api/find-info-obra/', null, {
            params: { obra: obra }
        }).then(res => {
            const datos = res.data[0];
            this.setState({

                nombre: datos.NOMBRE,
                autor: datos.AUTOR,
                lanzamiento: datos.LANZAMIENTO,
                descripcion: datos.DESCRIPCION,
                cover: datos.COVER,
                visibilidad: datos.VISIBILIDAD,
                estado: datos.NESTADO,
                tipo: datos.NTIPO,
                demografia: datos.NDEMOGRAFIA

            }, async () => {

                this.setState({
                    generos: await this.findCaracteristicaObra('generos-actuales'),
                    listSocialMedia: await this.findCaracteristicaObra('socialMedia'),
                    listChapters: await this.findCaracteristicaObra('chapters')
                })
            });
        })
    }

    //Obtiene las distintas caracteristicas de una obra
    findCaracteristicaObra = (option) => {

        const { obra } = this.state

        return axios.post(`/api/find-${option}/`, null, { params: { obra: obra } }).then(function (res) {
            // handle success
            return res.data
        })
    }

    render() {

        const { obra, user } = this.state

        return (
            <div>Obra: {obra} Lector: {user}</div>
        );
    }

}