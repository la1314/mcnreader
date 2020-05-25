import React, { Component } from 'react';
import axios from 'axios';

export default class Obra extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nombre: '',
            autor: '',
            lanzamiento: '',
            demografia: '',
            media: '',
            generos: [],
            listaDemografias: [],
            listaGeneros: [],
            socialMedia: [],
            listSocialMedia: [],
            cover: '',
            sinopsis: ''
        }


    }

    //Carga los datos del localStorage y asigna valores a los state
    componentDidMount() {

        if (localStorage.getItem('obraEdit')) {
            const n = parseInt(localStorage.getItem('obraEdit'));
            this.setState({ obra: n }, () => { this.findDetailtObra() })
        }

    }

    /* Funciones que afectan a la Obra */

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
                sinopsis: datos.DESCRIPCION,
                demografia: datos.DEMOGRAFIA || 'Nada',
                media: datos.MEDIA,
                cover: datos.COVER
            })

        })
    }

    //Edita el nombre de la obra
    editName = () => { }

    //Modifica la descripción de la obra
    editDescription = () => { }

    //Edita el Autor de la Obra
    editAutor = () => { }

    //Edita el año de lanzamiento de la Obra
    editLanzamiento = () => { }

    //Añade/Reemplaza el cover actual
    editCover = () => { }

    //Edita el estado actual de la obra
    editEstado = () => { }

    //Edita el tipo actual de la obra
    editTipo = () => { }

    //Edita la visibilidad actual de la obra
    editVisibilidad = () => { }

    //Edita la demografia actual de la obra
    editDemografia = () => { }


    /* Funciones que afectan a los Capítulos de la obra */
    //Añade/Elimina un capítulo
    editChapter = () => { }

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

    render() {

        const { autor, nombre, lanzamiento, demografia, generos, listaDemografias, listaGeneros, cover, sinopsis, socialMedia, listSocialMedia } = this.state

        return (
            <div className='edit-single-obra-container'>
                <div className='edit-obra-cover-details-container' >
                    <div className='edit-obra-cover'>{cover}</div>

                    <div className='edit-obra-details'>

                        <div className='edit-obra-name'>
                            <label htmlFor="obra-name">Nombre: </label>
                            <input type="text" value={nombre} onChange={this.editName} name="obra-name" placeholder="Editar nombre" />
                        </div>
                        <div className='edit-obra-autor'>
                            <label htmlFor="obra-autor">Autor: </label>
                            <input type="text" value={autor} onChange={this.editAutor} name="obra-autor" placeholder="Editar Autor" />
                        </div>
                        <div className='edit-obra-lanzamiento' >
                            <label htmlFor="obra-lanzamiento">Lanzamiento: </label>
                            <input type="number" value={lanzamiento} onChange={this.editLanzamiento} name="obra-lanzamiento" placeholder="Editar Lanzamiento" />
                        </div>
                        <div className='edit-obra-social-media' ></div>
                        <div className='edit-obra-demografias' >
                            <label htmlFor="obra-demografia">Demografia: </label>
                            <input type="text" value={demografia} onChange={this.editDemografia} name="obra-demografia" placeholder="Editar Lanzamiento" />
                        </div>
                        <div className='edit-obra-generos' >
                            <div>Generos: </div>
                            {generos.map( (item) => <div>{item.NOMBRE}</div> )}
                        </div>

                    </div>
                </div>


                <div className='edit-obra-resume'>{sinopsis}</div>
                <div className='edit-obra-chapters'></div>
            </div>
        );
    }
}