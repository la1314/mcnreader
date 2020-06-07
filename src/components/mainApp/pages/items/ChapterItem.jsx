import React, { Component } from 'react';
import axios from 'axios';

export default class HomePL extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chapter: props.chapter,
            number: props.number,
            name: props.name,
            leido: 0,
            imgSrc: ['https://tuinki.gupoe.com/media/app-images/leer.png', 'https://tuinki.gupoe.com/media/app-images/visto.png']
        }
    }

    //Carga los datos al state
    componentDidMount() {
        this.checkLeido();
    }


    // compruba que el usuario ha leido el capítulo
    checkLeido = () => {
        const { chapter } = this.state
        return axios.post(`/api/check-leido/`, null, { params: { chapter: chapter } }).then((res) => { this.setState({ leido: res.data.Booleano }) })
    }


    // Crear Leido
    createLeido = () => {
        const { chapter, leido } = this.state

        if (!leido) {
            axios.post(`/api/new-leido/`, null, { params: { chapter: chapter } })
        }
    }

    verChapter = () => {
        const { chapter, leido } = this.state
        if (!leido) {
            this.createLeido()
        }
        this.props.verChapter(chapter)
    }

    // Delete Leido
    deleteLeido = () => {
        const { chapter } = this.state
        axios.post(`/api/delete-leido/`, null, { params: { chapter: chapter } })

    }


    //Cambia el estado de leido
    changeLeido = () => {

        const { leido } = this.state

        if (leido) {
            Promise.resolve(this.deleteLeido()).then(() => { this.checkLeido() })
        } else {
            Promise.resolve(this.createLeido()).then(() => { this.checkLeido() })
        }
    }


    render() {

        const { number, name, leido, imgSrc } = this.state

        return (
            <div className='ol-chapter-item'>
                <div className='ol-chapter-description' onClick={() => { this.verChapter() }}  >
                    <div>{number}</div>
                    <div>{name}</div>
                </div>

                <div className='ol-chapter-vl' onClick={() => { this.changeLeido() }} >
                    <img alt='' src={leido ? imgSrc[1] : imgSrc[0]} ></img>
                </div>
            </div>
        );
    }
}