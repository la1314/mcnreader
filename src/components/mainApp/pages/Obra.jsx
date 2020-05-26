import React, { Component } from 'react';
import axios from 'axios';
import './pages.scss';

export default class Obra extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nombre: '',
            autor: '',
            lanzamiento: '',
            demografia: 'Añadir demografia',
            media: '',
            generos: [],
            listaDemografias: [],
            listaGeneros: [],
            socialMedia: [],
            listSocialMedia: [],
            cover: '',
            descripcion: ''
        }
    }

    //Carga los datos del localStorage y asigna valores a los state
    async componentDidMount() {

        if (localStorage.getItem('obraEdit')) {
            const n = parseInt(localStorage.getItem('obraEdit'));
            this.setState({ obra: n }, () => { this.findDetailtObra() })
        }

        this.findDemografias()


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
                descripcion: datos.DESCRIPCION,
                cover: datos.COVER
            })
        })
    }

    //Edita los parametros de una obra
    editObra = (e, type) => {

        const { obra } = this.state
        const value = e.target.value

        axios.post('/api/edit-obra/', null, {
            params: { type: type, obra: obra, value: value }
        })

        switch (type) {
            case 1:
                this.setState({ nombre: value })
                break;
            case 2:
                this.setState({ autor: value })
                break;
            case 3:
                this.setState({ lanzamiento: value })
                break;
            case 4:
                this.setState({ descripcion: value })
                break;
            case 5:
                this.setState({ name: value })
                break;

            default:
                break;
        }
    }

    //TODO QUERY DEMOGRAFIAS Y GENEROS
    //Obtiene los datos de las demografias
    findDemografias = () => {
        return axios.post('/api/find-all-demografias/', null).then(res => {

            const demografias = res.data;

            this.setState({ listaDemografias: demografias });

        })
    }

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
    editDemografia = (e) => {

        const value = e.target.value;
        const { obra } = this.state;

        if (value) {
            axios.post('/api/edit-demografia/', null, { params: { type: 0, obra: obra } }).then(
                axios.post('/api/edit-demografia/', null, { params: { type: value, obra: obra, demo: value } })
            )
        } else {
            axios.post('/api/edit-demografia/', null, {
                params: { type: 0, obra: obra, demo: value }
            })
        }

    }


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

        const { autor, nombre, lanzamiento, demografia, generos, listaDemografias, listaGeneros, cover, descripcion, socialMedia, listSocialMedia } = this.state

        return (
            <div className='edit-single-obra-container'>
                <div className='edit-obra-cover-details-container' >
                    <div className='edit-obra-cover'>
                        <img alt={nombre} src={cover}></img>
                    </div>

                    <div className='edit-obra-details'>

                        <div className='edit-obra-name'>
                            <label htmlFor="obra-name">Nombre: </label>
                            <input type="text" value={nombre} onChange={(e) => { this.editObra(e, 1) }} name="obra-name" placeholder="Editar nombre" />
                        </div>
                        <div className='edit-obra-autor'>
                            <label htmlFor="obra-autor">Autor: </label>
                            <input type="text" value={autor} onChange={(e) => { this.editObra(e, 2) }} name="obra-autor" placeholder="Editar Autor" />
                        </div>
                        <div className='edit-obra-lanzamiento' >
                            <label htmlFor="obra-lanzamiento">Lanzamiento: </label>
                            <input type="number" value={lanzamiento} onChange={(e) => { this.editObra(e, 3) }} name="obra-lanzamiento" placeholder="Editar Lanzamiento" />
                        </div>
                        <div className='edit-obra-social-media' ></div>
                        <div className='edit-obra-demografias' >
                            <label htmlFor="obra-demografia">Demografia: </label>
                            <input type="text" value={demografia} onChange={this.editDemografia} name="obra-demografia" placeholder="Editar Lanzamiento" />
                            <select id="edit-demografia" onChange={this.editDemografia} >
                                <option value='0'>Clear</option>
                                {listaDemografias.map((item, index) => <option key={item.NOMBRE + index} value={item.ID}>{item.NOMBRE}</option>)}
                            </select>
                        </div>
                        <div className='edit-obra-generos' >
                            <div>Generos: </div>
                            {generos.map((item) => <div>{item.NOMBRE}</div>)}
                        </div>

                    </div>
                </div>


                <div className='edit-obra-resume'>{descripcion}</div>
                <div className='edit-obra-chapters'></div>
            </div>
        );
    }
}