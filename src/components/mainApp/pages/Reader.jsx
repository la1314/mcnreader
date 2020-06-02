import React, { Component } from 'react';
import axios from 'axios';

export default class Reader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            obra: '', chapter: '', listPages: []
        }
    }


    //Carga los datos al montarse el componente
    componentDidMount() {

        if (localStorage.getItem('chapter')) {
            const obra = parseInt(localStorage.getItem('obra'));
            const chapter = parseInt(localStorage.getItem('chapter'));
            this.setState({ obra: obra, chapter: chapter }, async () => {
                this.setState({listPages: await this.findPages()})
            })
        }
    }

    //Devuelve las paginas de un capítulo
    findPages = () => {
        const { chapter } = this.state
        return axios.post('/api/find-chapter-pages/', null, {
            params: { chapter: parseInt(chapter) }
        }).then(res => { return res.data })
    }

    render() {

        const { obra, chapter } = this.state

        return (
            <div>Obra: {obra}  Capitulo: {chapter}</div>
        );
    }
}