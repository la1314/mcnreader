import React, { Component } from 'react';
import axios from 'axios';

export default class EditChapter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chapter: this.props.chapter,
            name: '',
            number: '',
            date: '',
            visibilidad: '',
            listPages: []
        };
        this.inputVisibilidadRef = React.createRef();
    }

    //Carga los datos del capítulo
    componentDidMount() {

        if (localStorage.getItem('chapter')) {

            const value = parseInt(localStorage.getItem('chapter'));
            this.setState({ chapter: value }, () => { this.getChapterDetails() })
        }


    }

    getChapterDetails = () => {

        const { chapter } = this.state

        axios.post('/api/find-info-chapter/', null, {
            params: { chapter: parseInt(chapter) }
        }).then( res => {

            const data = res.data
            this.setState({
                name: data.NOMBRE,
                number: data.NUMERO,
                date: data.FECHA,
                visibilidad: data.VISIBILIDAD
            })
        })
    }

    //Edita el número de un capítulo
    editNumberChapter = () => { }

    //Edita el nombre de un capítulo
    editNameChapter = () => { }

    //Edita la fecha de un capítulo
    editFechaChapter = () => { }

    //Edita la visibilidad del capítulo de la obra
    editVisibilidadChapter = () => { }


    /* Funciones que afectan a las páginas de los capítulos */

    //Añane las paginas a un capítulo
    addChapterPages = () => { }

    //Elimina las paginas de un capítulo
    deleteChapterPages = () => { }

    //Edita el número de una pagina
    editNumberPages = () => { }

    //TODO
    render() {

        const { name, number, date, listPages, visibilidad } = this.state

        return (
            <div className='edit-chapter'>
                <div className='edit-chapter-name'>
                    <label htmlFor='label-new-chapter-number'>Nombre: </label>
                    <input type='text' value={name} name="input-new-chapter-name" onChange={(e) => { }} placeholder="Nombre del capítulo" />
                </div>
                <div className='edit-chapter-number'>
                    <label htmlFor='label-new-chapter-number'>Numero: </label>
                    <input type='number' value={number} name="input-new-chapter-number" onChange={(e) => { }} placeholder="Número del capítulo" />
                </div>
                <div className='edit-chapter-date'>
                    <label htmlFor='label-new-chapter-number'>Fecha lanzamiento: </label>
                    <input type='date' value={date} onChange={(e) => { }} name="input-new-chapter-date" />
                </div>

                <div className='edit-chapter-visibilidad'>
                    <label htmlFor="label-new-chapter-visibilidad">Visibilidad: </label>
                    <select value={visibilidad} id="select-new-chapter-visibilidad" onChange={(e) => { }}  >
                        <option value="0">OCULTO</option>
                        <option value="1">VISIBLE</option>
                    </select>
                </div>
            </div>
        );
    }
}