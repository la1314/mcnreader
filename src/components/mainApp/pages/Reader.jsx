import React, { Component } from 'react';
import axios from 'axios';

export default class Reader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            obra: '', chapter: '', listPages: [], reader: 'manga', tipo: '', estilo: ['simple', 'doble'],
            styleManga: []
        }
    }


    //Carga los datos al montarse el componente
    componentDidMount() {

        if (localStorage.getItem('chapter')) {
            const obra = parseInt(localStorage.getItem('obra'));
            const chapter = parseInt(localStorage.getItem('chapter'));
            this.setState({ obra: obra, chapter: chapter }, async () => {
                this.setState({ listPages: await this.findPages() }, () => {
                    this.reordenarManga(this.state.listPages)
                })
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


    reordenarManga = (lista) => {

        let union = [];

        for (let index = 0; index < lista.length; index += 2) {

            if (index !== lista.length-1) {union.push(lista[index + 1])}
            union.push(lista[index])
        }

        this.setState({ styleManga: union })
    }



    //TODO AÑADIR LECTOR
    render() {

        const { listPages, reader, estilo, styleManga } = this.state

        return (
            <div className={reader}>

                {reader === 'manga' ?
                    styleManga.map((item, index) => {
                        return [
                            <img className={'reader-page ' + estilo[item.ESTILO]} key={'img' + index} alt='imagen del capítulo' src={item.RUTA} />
                        ]
                    })
                    :
                    listPages.map((item, index) => {
                        return [
                            <img className={'reader-page ' + estilo[item.ESTILO]} key={'img' + index} alt='imagen del capítulo' src={item.RUTA} />
                        ]
                    })


                }
            </div>
        );
    }
}