import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

export default class HomePL extends Component {

    _isMounted3 = false;
    constructor(props) {
        super(props);
        this.state = {
            rol: props.rol,
            chapter: props.chapter,
            number: props.number,
            name: props.name,
            leido: 0,
            imgSrc: ['https://tuinki.gupoe.com/media/app-images/leer.png', 'https://tuinki.gupoe.com/media/app-images/visto.png']
        }
    }

    //Carga los datos al state
    componentDidMount() {
        this._isMounted3 = true;
        this.checkLeido();
    }

    componentWillUnmount() {
        this._isMounted3 = false;
    }

    // compruba que el usuario ha leido el capítulo
    checkLeido = () => {
        const { chapter, rol } = this.state
        if (rol === 'READER') {
            axios.post(`https://mcnreader.herokuapp.com/api/check-leido/`, null, { params: { chapter: chapter } }).then((res) => { this.setState({ leido: res.data.Booleano }) })
        }
    }


    // Crear Leido
    createLeido = async () => {
        const { chapter, leido } = this.state
        if (!parseInt(leido)) {
            axios.post(`https://mcnreader.herokuapp.com/api/new-leido/`, null, { params: { chapter: chapter } }).then(() => { 
                if (this._isMounted3) {this.setState({ leido: 1 })}
             })
        }
    }

    verChapter = () => {
        const { chapter, leido, rol } = this.state
        if (rol === 'READER') {
            if (!leido) {
                this.createLeido()
            }
        }
        this.props.verChapter(chapter)
    }

    // Delete Leido
    deleteLeido = () => {
        const { chapter } = this.state
        axios.post(`https://mcnreader.herokuapp.com/api/delete-leido/`, null, { params: { chapter: chapter } }).then(() => { this.setState({ leido: 0 }) })
    }


    //Cambia el estado de leido
    changeLeido = () => {

        const { leido } = this.state

        if (parseInt(leido)) {
            this.deleteLeido()
        } else {
            this.createLeido()
        }
    }

    render() {

        const { number, name, leido, imgSrc, rol } = this.state

        return (
            <div className='ol-chapter-item'>
                <div className='ol-chapter-description' onClick={() => { this.verChapter() }}  >
                    <div>Número: {number}</div>
                    <div>{name}</div>
                </div>
                {rol === 'READER' && (<div className={'ol-chapter-vl ' + (leido ? 'chapter-leido' : 'chapter-no-leido')} onClick={() => { this.changeLeido() }} >
                    <img alt='' src={leido ? imgSrc[1] : imgSrc[0]} ></img>
                </div>)}

            </div>
        );
    }
}