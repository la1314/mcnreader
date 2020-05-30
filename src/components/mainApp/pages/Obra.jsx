import React, { Component } from 'react';
import axios from 'axios';
import './pages.scss';
import ECItem from './gestor/EditorChapterItem.jsx';

export default class Obra extends Component {

    constructor(props) {
        super(props);
        this.state = {
            obra: '',
            nombre: '',
            autor: '',
            lanzamiento: '',
            listDemografias: [],
            listGeneros: [],
            listEstados: [],
            listSocialMedia: [],
            listTipos: [],
            demografia: '',
            generos: [],
            estadoValue: '',
            socialMedia: [],
            tipo: '',
            tipoValue: '',
            visibilidad: '',
            listChapters: [],
            cover: '',
            coverFile: [],
            descripcion: '',
            inputEstados: [],
            coverHash: Date.now(),
            newChapterNumber: '',
            newChapterName: '',
            newChapterDate: '',
            newChapterVisibilidad: '0'
        }
        this.inputVisibilidadRef = React.createRef();
        this.checkboxes = []
    }

    //AÑADIR FUNCION PARA DEVOLVER TIPO
    //TODO Añadir edicion de cover, Social media

    //Carga los datos del localStorage y asigna valores a los state
    componentDidMount() {

        if (localStorage.getItem('obraEdit')) {
            const n = parseInt(localStorage.getItem('obraEdit'));
            const editor = parseInt(localStorage.getItem('user'));
            this.setState({ obra: n, editor: editor }, () => { this.findDetailtObra() })
        }
    }

    /* Funciones que afectan a los formularios*/
    //Se ejecuta cuando se monta el componente
    checkVisibilidadObra = () => {

        let inputsV = this.inputVisibilidadRef.current.childNodes

        const { visibilidad } = this.state

        inputsV.forEach(element => {

            const value = parseInt(element.getAttribute('value'))

            if (element.getAttribute('type') === 'radio' && value === visibilidad) { element.checked = true }
        });
    }


    //Marca los checkboxes de generos que la obra actualmente posee
    checkGeneroObra = () => {

        let boxes = this.checkboxes

        const { generos } = this.state

        boxes.forEach(element => {

            generos.forEach(gen => {

                if (parseInt(element.value) === parseInt(gen.ID)) {
                    element.checked = true
                    return
                }
            })
        })
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
                visibilidad: datos.VISIBILIDAD,
                estadoValue: datos.ESTADOVALUE,
                tipoValue: datos.TIPO,
                demografiaValue: datos.DEMOGRAFIA

            }, async () => {

                this.checkVisibilidadObra();
                this.getEstado();

                this.setState({
                    generos: await this.findCaracteristicaObra('generos-actuales'),
                    listEstados: await this.findCaracteristicaObra('estados'),
                    listGeneros: await this.findCaracteristicaObra('generos'),
                    listDemografias: await this.findCaracteristicaObra('demografias'),
                    listSocialMedia: await this.findCaracteristicaObra('socialMedia'),
                    listTipos: await this.findCaracteristicaObra('tipos'),
                    listChapters: await this.findCaracteristicaObra('chapters')
                }, () => {

                    const { listDemografias, demografiaValue, tipoValue, listTipos } = this.state
                    this.setState({
                        demografia: this.obtenerNombre(listDemografias, demografiaValue),
                        tipo: this.obtenerNombre(listTipos, tipoValue)
                    })

                    this.checkGeneroObra()
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

    //Edita los parametros de una obra
    editObra = async (e, type) => {

        const { obra, listDemografias, listTipos } = this.state

        const value = e.target.value

        axios.post('/api/edit-obra/', null, {
            params: { type: type, obra: obra, value: value }
        }).then(async () => {
            if (type === 11 || type === 10) {
                this.setState({ generos: await this.findCaracteristicaObra('generos-actuales') })
            }
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

            case 6:
                this.setState({ estadoValue: value }, () => { this.getEstado() })
                break;

            case 7:
                this.setState({ visibilidad: value })
                break;

            case 8:
                this.setState({ tipoValue: value, tipo: this.obtenerNombre(listTipos, value) })
                break;

            case 9:
                this.setState({ demografiaValue: value, demografia: this.obtenerNombre(listDemografias, value) })
                break;


            //Al borrar cambiar la pagina a Gestor TODO
            default:
                break;
        }
    }

    //TODO REFACTORIZAR GET ESTADO

    //Devuelve el nombre cuyo ID de item coincida con el deseado
    obtenerNombre = (lista, id) => {
        const result = lista.filter(item => parseInt(item.ID) === parseInt(id))
        return result[0].NOMBRE
    }


    //Obtiene el nombre del estado actual de la obra
    getEstado = () => {

        const { estadoValue } = this.state;

        axios.post('/api/get-estado/', null, { params: { id: estadoValue } }).then((res) => {
            // handle success
            this.setState({ estado: res.data[0].NOMBRE })
        })
    }

    //Edita los generos de la obra actual
    editGenero = (e) => {

        if (e.target.checked) {
            this.editObra(e, 10)
        } else {
            this.editObra(e, 11)
        }
    }

    //Carga la imagen del cover al estado coverFile para ser subido posteriormente
    chargeCover = (e) => {

        const coverFile = e.target.files
        this.setState({ coverFile: coverFile })
    }


    //Edita el cover actual de la obra
    editCover = () => {

        const { obra, coverFile } = this.state

        if (coverFile.length !== 0) {

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            let rutas = [];
            rutas.push('cover')

            const formData = new FormData();
            formData.append('editor', this.props.user);
            formData.append('work', obra);
            formData.append('rutas', rutas);
            formData.append('images[]', coverFile[0]);
            formData.append('action', 'newCover');

            axios.post('https://tuinki.gupoe.com/media/options.php', formData, config).then((res) => {

                axios.post('/api/edit-obra/', null, {
                    params: { type: 5, obra: obra, value: res.data[0].ruta }
                }).then(async () => { this.setState({ coverHash: Date.now(), cover: await this.findCaracteristicaObra('cover') }) })
            });
        }
    }


    /* Funciones que afectan a los Capítulos de la obra */
    //Añade/Elimina un capítulo

    //Añade un nuevo capítulo a la obra
    //TODO SI EL NUMERO DEL CAPITULO YA EXISTE 
    newChapter = () => {

        const { newChapterName, newChapterNumber, newChapterDate, newChapterVisibilidad, obra, editor } = this.state

        axios.post('/api/new-chapter/', null, {
            params: {
                obra: obra,
                number: newChapterNumber,
                name: newChapterName,
                date: newChapterDate,
                visibilidad: newChapterVisibilidad
            }
        }).then(async () => this.setState({ listChapters: await this.findCaracteristicaObra('chapters') }, () => {
            
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }

            const {listChapters} = this.state;
            const last = listChapters.length - 1;

            const formData = new FormData();
            formData.append('editor', editor);
            formData.append('work', obra);
            formData.append('chapter', listChapters[last].ID);
            formData.append('action', 'newChapterDirectory');
            axios.post('https://tuinki.gupoe.com/media/options.php', formData, config)

        }))
    }

    //Actualiza los estados para la creación de un nuevo capítulo
    updateNewChapterState = (e, type) => {
        const value = e.target.value;

        switch (type) {
            case 1:
                this.setState({ newChapterNumber: value })
                break;

            case 2:
                this.setState({ newChapterName: value })
                break;

            case 3:
                this.setState({ newChapterDate: value })
                break;

            case 4:
                this.setState({ newChapterVisibilidad: value })
                break;
            default:
                break;
        }
    }

    render() {

        const { autor, nombre, lanzamiento, demografia, demografiaValue, generos, listDemografias, listGeneros,
            cover, coverHash, descripcion, estado, listEstados, estadoValue, tipo, tipoValue, listTipos,
            newChapterNumber, newChapterName, newChapterDate, listChapters
        } = this.state;

        return (
            <div className='edit-single-obra-container'>
                <div className='edit-obra-cover-details-container' >

                    <div className='container-cover-details'>
                        <div className='edit-obra-cover'>
                            <img alt={nombre} src={`${cover}?${coverHash}`}></img>
                            <input type="file" onChange={this.chargeCover} id="cover" name="cover" />
                            <button onClick={() => { this.editCover() }} >Cambiar cover</button>
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
                                <label htmlFor="obra-tipo">Tipo: {tipo}</label>
                                <select id="obra-tipo" value={tipoValue} onChange={(e) => { this.editObra(e, 8) }}>
                                    {listTipos.map((item) => <option key={item.NOMBRE} value={item.ID} >{item.NOMBRE}</option>)}
                                </select>
                            </div>
                            <div className='edit-obra-estado' >
                                <label htmlFor="obra-estado">Estado: {estado}</label>

                                <select id="edit-estado" value={estadoValue} onChange={(e) => { this.editObra(e, 6) }} >
                                    {listEstados.map((item, index) => <option key={item.NOMBRE + index} value={item.ID}>{item.NOMBRE}</option>)}
                                </select>
                            </div>
                            <div className='edit-obra-visibilidad' ref={this.inputVisibilidadRef} >
                                <label htmlFor="obra-visibilidad">Visibilidad: </label>

                                <label htmlFor="obra-visibilidad">Oculto </label>
                                <input type="radio" value='0' onChange={(e) => { this.editObra(e, 7) }} name="input-visibilidad"></input>
                                <label htmlFor="obra-visibilidad">Visible </label>
                                <input type="radio" value='1' onChange={(e) => { this.editObra(e, 7) }} name="input-visibilidad"></input>

                            </div>

                            <div className='edit-obra-demografias'>
                                <label htmlFor="obra-demografia">Demografia: {demografia}</label>
                                <select id="edit-demografia" value={demografiaValue} onChange={(e) => { this.editObra(e, 9) }} >
                                    {listDemografias.map((item, index) => <option key={item.NOMBRE + index} value={item.ID}>{item.NOMBRE}</option>)}
                                </select>
                            </div>

                        </div>
                    </div>
                </div>

                <div className='edit-obra-generos' >
                    <label htmlFor="obra-generos">Generos: </label>
                    <div className='obra-generos-actuales'>
                        {generos.map((item, index) => <div key={item.NOMBRE + '-ga-' + index} className='obra-genero-texto' >{item.NOMBRE}</div>)}
                    </div>
                    {
                        //TODO CHECKBOXES
                        listGeneros.map((item, index) => {

                            return [
                                <label htmlFor="obra-generos" key={item.NOMBRE + 'label' + index} >{item.NOMBRE}</label>,
                                <input type='checkbox' ref={(input) => { this.checkboxes[index] = input }} onChange={this.editGenero} key={item.NOMBRE + index} value={item.ID} />
                            ]

                        })
                    }
                </div>

                <div className='edit-obra-resume'>
                    <label htmlFor="obra-resume">Descripción: </label>
                    <textarea placeholder='Añanir descripción a la obra' className='edit-obra-resume-textarea' onChange={() => { }} value={descripcion} />
                </div>

                <div className='edit-obra-social-media' >
                    <label>Social Media:</label>
                </div>


                <div className='edit-obra-chapters-container'>

                    <div className='edit-obra-chapters'>
                        <label>Capitulos: </label>
                        <div className='edit-obra-chapters-list'>
                            {listChapters.map((item, index) => <ECItem key={'chapter-item' + index} chapter={item.ID} name={item.NOMBRE} number={item.NUMERO} changeToEditChapter={this.props.changeToEditChapter} />)}
                        </div>
                    </div>

                    <div className='edit-obra-new-chapter'>
                        <div className='edit-chapter-number'>
                            <label htmlFor='label-new-chapter-number'>Numero: </label>
                            <input type='number' name="input-new-chapter-number" value={newChapterNumber} onChange={(e) => { this.updateNewChapterState(e, 1) }} placeholder="Número del capítulo" />
                        </div>
                        <div className='edit-chapter-name'>
                            <label htmlFor='label-new-chapter-number'>Nombre: </label>
                            <input type='text' name="input-new-chapter-name" value={newChapterName} onChange={(e) => { this.updateNewChapterState(e, 2) }} placeholder="Nombre del capítulo" />
                        </div>

                        <div className='edit-chapter-date'>
                            <label htmlFor='label-new-chapter-number'>Fecha lanzamiento: </label>
                            <input type='date' value={newChapterDate} onChange={(e) => { this.updateNewChapterState(e, 3) }} name="input-new-chapter-date" />
                        </div>

                        <div className='edit-chapter-visibilidad'>
                            <label htmlFor="label-new-chapter-visibilidad">Visibilidad: </label>
                            <select id="select-new-chapter-visibilidad" onChange={(e) => { this.updateNewChapterState(e, 4) }}  >
                                <option value="0">OCULTO</option>
                                <option value="1">VISIBLE</option>
                            </select>
                        </div>
                        <button type="submit" onClick={() => this.newChapter()} className="btn">
                            Añadir nuevo capitulo
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}