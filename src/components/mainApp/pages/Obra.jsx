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
            ListDemografias: [],
            listGeneros: [],
            listEstados: [],
            listSocialMedia: [],
            listTipos: [],
            demografia: '',
            generos: [],
            estado: '',
            socialMedia: [],
            tipo: '',
            cover: '',
            descripcion: ''
        }
        this.myRef = React.createRef();
    }

    //Carga los datos del localStorage y asigna valores a los state
    async componentDidMount() {

        if (localStorage.getItem('obraEdit')) {
            const n = parseInt(localStorage.getItem('obraEdit'));
            this.setState({ obra: n }, () => { this.findDetailtObra() })
        }

        this.checkVisibilidadObra()
        
    }

    /* Funciones que afectan a los formularios*/
    //TODO Esto da to el sidote
    checkVisibilidadObra = () => {
        


        let inputsV = this.myRef.current.childNodes

        inputsV.forEach(element => {
            
            if (element.getAttribute('type') === 'radio' && element.getAttribute('value') === '1') {
                element.checked = true;
            }

        });

       // inputsV.filter(  )
       // inputsV[0].checked = true;
       
        
        
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
                cover: datos.COVER,
                visibilidad: datos.VISIBILIDAD
            }, async () => {
                this.getDemografia();
                this.setState({
                    listEstados: await this.findCaracteristicaObra('estados'),
                    listGeneros: await this.findCaracteristicaObra('generos'),
                    ListDemografias: await this.findCaracteristicaObra('demografias'),
                    listSocialMedia: await this.findCaracteristicaObra('socialMedia'),
                    listTipos: await this.findCaracteristicaObra('tipos')
                })
            });
        })
    }

    //Obtiene las distintas caracteristicas de una obra
    findCaracteristicaObra = (option) => {
        return axios.post(`/api/find-${option}/`).then(function (res) {
            // handle success
            return res.data
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
    editVisibilidad = (e) => {


        const id = e.target.value
        const { obra } = this.state

        axios.post('/api/find-Visibilidad/', null, { params: { id: obra } }).then((res) => {

            console.log(res);

        })

    }

    //Obtiene la demografia de la obra actual
    getDemografia = () => {

        const { obra } = this.state;

        axios.post('/api/get-demografia/', null, { params: { obra: obra } }).then((res) => {

            this.setState({ demografia: res.data[0].NOMBRE })
        })
    }

    //Edita la demografia actual de la obra
    editDemografia = async (e) => {

        const value = e.target.value
        const { obra } = this.state;

        axios.post('/api/edit-demografia/', null, { params: { obra: obra, demo: value } }).then(
            this.getDemografia()
        )
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

        const { autor, nombre, lanzamiento, demografia, generos, ListDemografias, listGeneros, cover, descripcion, socialMedia, listSocialMedia, estado, listEstados, tipo, listTipos, visibilidad } = this.state

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
                        <div className='edit-obra-tipo' >
                            <label htmlFor="obra-tipo">Tipo: </label>
                            
                        </div>
                        <div className='edit-obra-estado' >
                            <label htmlFor="obra-estado">Estado: </label>
                            
                        </div>
                        <div className='edit-obra-visibilidad' ref={this.myRef} >
                            <label htmlFor="obra-visibilidad">Visibilidad: </label>
                            
                            <label htmlFor="obra-visibilidad">Oculto </label>
                            <input type="radio" value='0'  onChange={(e) => { console.log(e) }} name="input-visibilidad"></input>
                            <label htmlFor="obra-visibilidad">Visible </label>
                            <input type="radio" value='1'  onChange={(e) => { console.log(e) }} name="input-visibilidad"></input>

                        </div>
                        <div className='edit-obra-social-media' ></div>

                        <div className='edit-obra-demografias' >
                            <label htmlFor="obra-demografia">Demografia: </label>
                            <div>{demografia}</div>
                            <select id="edit-demografia" onChange={this.editDemografia} >
                                {ListDemografias.map((item, index) => <option key={item.NOMBRE + index} value={item.ID}>{item.NOMBRE}</option>)}
                            </select>
                        </div>
                        <div className='edit-obra-generos' >
                            <div>Generos: </div>
                            {listGeneros.map((item, index) => <div key={item.NOMBRE + index} >{item.NOMBRE}</div>)}
                        </div>

                    </div>
                </div>


                <div className='edit-obra-resume'>{descripcion}</div>
                <div className='edit-obra-chapters'></div>
            </div>
        );
    }
}