import React, { Component } from 'react';
import axios from 'axios';
import ECItem from './items/EditorChapterItem.jsx';
import ReactDOM from 'react-dom';
import Dialog from '../../mainApp/pages/items/Dialog.jsx';
import ESM from './items/EditorSM.jsx';
import ESMI from './items/EditorSMItem.jsx';
const md5 = require('md5');
axios.defaults.withCredentials = true;

export default class ObraEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            obra: '', nombre: '', autor: '', lanzamiento: '',
            listDemografias: [], listGeneros: [], listEstados: [],
            listSocialMedia: [], listTipos: [],
            demografia: '', generos: [], estadoValue: '',
            socialMedia: [], tipo: '', tipoValue: '',
            visibilidad: '', listChapters: [], cover: '',
            coverFile: [], descripcion: '', inputEstados: [],
            coverHash: Date.now(), newChapterNumber: '',
            newChapterName: '', newChapterDate: '',
            newChapterVisibilidad: '0',
            pass: '',
            disabledPasswordCheckE: false,
            palabra: '',
            disabledEliminar: false,
            palabraEliminacion: 'ELIMINAR'
        }
        this.inputVisibilidadRef = React.createRef();
        this.checkboxes = []
        this.refPassword = React.createRef();
        this.refPalabra = React.createRef();
    }

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

        axios.post('https://mcnreader.herokuapp.com/api/find-info-obra/', null, {
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
                    listChapters: await this.findCaracteristicaObra('chapters'),
                    socialMedia: await this.findCaracteristicaObra('social-media')
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

        return axios.post(`https://mcnreader.herokuapp.com/api/find-${option}/`, null, { params: { obra: obra } }).then(function (res) {
            // handle success
            return res.data
        })
    }

    //Edita los parametros de una obra
    editObra = async (e, type) => {

        const { obra, listDemografias, listTipos } = this.state

        const value = e.target.value
        const re = /^[0-9\b]+$/;
        axios.post('https://mcnreader.herokuapp.com/api/edit-obra/', null, {
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

                if ((value === '' || re.test(value)) && value.length < 5) {
                    this.setState({ lanzamiento: value })
                }

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


    //Función pasada como prop para actualizar el state socialMedia en la creación o eliminación de una media
    updateSocialMediaState = async () => {
        this.setState({ socialMedia: await this.findCaracteristicaObra('social-media') })
    }


    //Devuelve el nombre cuyo ID de item coincida con el deseado
    obtenerNombre = (lista, id) => {
        const result = lista.filter(item => parseInt(item.ID) === parseInt(id))
        return result[0].NOMBRE
    }


    //Obtiene el nombre del estado actual de la obra
    getEstado = () => {

        const { estadoValue } = this.state;

        axios.post('https://mcnreader.herokuapp.com/api/get-estado/', null, { params: { id: estadoValue } }).then((res) => {
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

                axios.post('https://mcnreader.herokuapp.com/api/edit-obra/', null, {
                    params: { type: 5, obra: obra, value: res.data[0].ruta }
                }).then(async () => { this.setState({ coverHash: Date.now(), cover: await this.findCaracteristicaObra('cover') }) })
            });
        }
    }


    /* Funciones que afectan a los Capítulos de la obra */
    //Añade/Elimina un capítulo

    //Añade un nuevo capítulo a la obra
    newChapter = () => {

        const { newChapterName, newChapterNumber, newChapterDate, newChapterVisibilidad, obra, editor } = this.state

        axios.post('https://mcnreader.herokuapp.com/api/new-chapter/', null, {
            params: {
                obra: obra,
                number: newChapterNumber || 0,
                name: newChapterName || '',
                date: newChapterDate || '2000-01-01',
                visibilidad: newChapterVisibilidad
            }
        }).then(async () => this.setState({ listChapters: await this.findCaracteristicaObra('chapters') }, () => {

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }

            const { listChapters } = this.state;
            const filtro = listChapters.sort(function (a, b) {
                return a.ID - b.ID;
            });
            const last = listChapters.length - 1;
           

            const formData = new FormData();
            formData.append('editor', editor);
            formData.append('work', obra);
            formData.append('chapter', filtro[last].ID);
            formData.append('action', 'newChapterDirectory');
            axios.post('https://tuinki.gupoe.com/media/options.php', formData, config)

        })).then(async () => this.setState({ listChapters: await this.findCaracteristicaObra('chapters') }, () => {
            this.showDialog('Mensaje del sistema', 'Capítulo añadido correctamente')
        }))
    }

    //Actualiza los estados para la creación de un nuevo capítulo
    updateNewChapterState = (e, type) => {
        const value = e.target.value;
        const re = /^[0-9\b]+$/;

        switch (type) {
            case 1:

                if (value === '' || re.test(value)) {
                    this.setState({ newChapterNumber: value })
                }
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

    //Función que añade al ReactDOM una carta con los datos pasados
    showDialog = (titulo, mensaje) => {

        let contenedor = document.getElementById('dialog');
        ReactDOM.unmountComponentAtNode(contenedor);
        let carta = <Dialog titulo={titulo} mensaje={mensaje} />;
        ReactDOM.render(carta, contenedor)
    }

    showUpdate = (tipe) => {

        switch (tipe) {
            case 1:
                this.showDialog('Mensaje del sistema', 'Nombre de la obra actualizado correctamente')
                break;

            case 2:
                this.showDialog('Mensaje del sistema', 'Autor de la obra actualizado correctamente')
                break;

            case 3:
                this.showDialog('Mensaje del sistema', 'Lanzamiento de la obra actualizado correctamente')
                break;

            case 4:
                this.showDialog('Mensaje del sistema', 'Descripción de la obra actualizado correctamente')
                break;

            default:
                break;
        }

    }

    /**Eliminación**/

    //Elimina las paginas de un capítulo
    deleteObra = () => {

        const { editor, obra } = this.state
        const config = { headers: { 'content-type': 'multipart/form-data' } }

        const formData = new FormData();
        formData.append('editor', editor);
        formData.append('work', obra);
        formData.append('action', 'deleteWorkDirectory');

        axios.post('https://tuinki.gupoe.com/media/options.php', formData, config).then(
            axios.post('https://mcnreader.herokuapp.com/api/delete-obra/', null, {
                params: { obra: parseInt(obra) }
            }).then(() => {
                this.showDialog('Mensaje del sistema:', 'Obra eliminada correctamente')
                this.props.changePage(0);
            })
        )
    }

    updateSate = (e, tipo) => {

        switch (tipo) {
            case 1:
                this.setState({ pass: e.target.value })
                break;

            case 2:
                this.setState({ palabra: e.target.value })
                break;

            default:
                break;
        }
    }

    //Activa/Desactiva el input y el boton para editar la password
    activarEditPassword = () => {

        if (this.refPassword.current.disabled) {
            this.setState({ disabledPasswordCheckE: true })
            this.refPassword.current.disabled = false;

        } else {
            this.setState({ disabledPasswordCheckE: false, disabledPasswordUpdate: false })
        }
    }

    //Activa/Desactiva el input los input para la nueva contraseña
    activarEliminacion = async () => {

        const { pass } = this.state

        const comprobacion = await axios.post('https://mcnreader.herokuapp.com/api/check-editor-password/', null, {
            params: { password: md5(pass) }
        }).then(res => { return parseInt(res.data[0].booleano) })

        if (comprobacion) {
            this.refPassword.current.disabled = true;
            this.refPalabra.current.disabled = false;
            this.setState({ disabledPasswordCheckE: false, disabledEliminar: true })
            this.showDialog('Mensaje del sistema:', 'Inserte ELIMINAR para eliminar la obra')
        } else {
            this.showDialog('Mensaje del sistema:', 'La contraseña ingresada es incorrecta')
        }
    }

    checkPalabra = () => {

        const { palabra, palabraEliminacion } = this.state

        if (palabra === palabraEliminacion) {

            this.deleteObra()

        } else {
            this.showDialog('Mensaje del sistema:', 'Palabra de eliminación incorrecta')
        }
    }

    render() {

        const { autor, nombre, lanzamiento, demografia, demografiaValue, generos, listDemografias, listGeneros,
            cover, coverHash, descripcion, estado, listEstados, estadoValue, tipo, tipoValue, listTipos,
            newChapterNumber, newChapterName, newChapterDate, listChapters, listSocialMedia, obra, socialMedia,
            pass, disabledPasswordCheckE, palabra, disabledEliminar
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
                                <input type="text" value={nombre} onChange={(e) => { this.editObra(e, 1) }} onBlur={() => { this.showUpdate(1) }} name="obra-name" placeholder="Editar nombre" />
                            </div>
                            <div className='edit-obra-autor'>
                                <label htmlFor="obra-autor">Autor: </label>
                                <input type="text" value={autor} onChange={(e) => { this.editObra(e, 2) }} onBlur={() => { this.showUpdate(2) }} name="obra-autor" placeholder="Editar autor" />
                            </div>
                            <div className='edit-obra-lanzamiento' >
                                <label htmlFor="obra-lanzamiento">Lanzamiento: </label>
                                <input value={lanzamiento} onChange={(e) => { this.editObra(e, 3) }} onBlur={() => { this.showUpdate(3) }} name="obra-lanzamiento" placeholder="Editar año de anzamiento" />
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
                                <div>Visibilidad: </div>

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
                    <div className='h1-section' >Generos: </div>
                    <div className='obra-generos-actuales'>
                        {generos.map((item, index) => <div key={item.NOMBRE + '-ga-' + index} className='obra-genero-texto' >{item.NOMBRE}</div>)}
                    </div>
                    <div className='h1-section'>Generos disponibles: </div>
                    <div className='obra-generos-lista'>
                        {
                            listGeneros.map((item, index) => {
                                return [
                                    <div className='obra-generos-lista-item' key={item.NOMBRE + 'label' + index}>
                                        <label htmlFor="obra-generos" >{item.NOMBRE}</label>
                                        <input type='checkbox' ref={(input) => { this.checkboxes[index] = input }} onChange={this.editGenero} key={item.NOMBRE + index} value={item.ID} />
                                    </div>

                                ]
                            })
                        }
                    </div>

                </div>

                <div className='edit-obra-resume'>
                    <div className='h1-section'>Descripción: </div>
                    <textarea rows={20} cols={40} placeholder='Añanir descripción a la obra' className='edit-obra-resume-textarea' onBlur={() => { this.showUpdate(4) }} onChange={(e) => { this.editObra(e, 4) }} value={descripcion} />
                </div>

                <div className='edit-obra-social-media-container' >
                    <div className='h1-section'>Social media</div>
                    <div className='edit-obra-social-new-media'>
                        {
                            listSocialMedia.map((item, index) => {
                                return [
                                    <ESM updateSocialMediaState={this.updateSocialMediaState} key={'sm' + index} name={item.NOMBRE} media={item.ID} obra={obra} />
                                ]
                            })
                        }
                    </div>
                    <div className='h1-section'>Editar social media</div>
                    <div className='edit-obra-social-media-item'>
                        {
                            socialMedia.map((item, index) => {
                                return [
                                    <ESMI key={'smi' + index} logo={item.LOGO} name={item.NOMBRE} media={item.ID} obra={obra} link={item.LINK} />
                                ]
                            })
                        }
                    </div>
                </div>


                <div className='edit-obra-chapters-container'>

                    <div className='edit-obra-chapters'>
                        <div className='h1-section'>Capitulos</div>
                        <div className='edit-obra-chapters-list'>
                            {listChapters.map((item, index) =>
                                <ECItem key={'chapter-item' + index} chapter={item.ID} name={item.NOMBRE} number={item.NUMERO} changeToEditChapter={this.props.changeToEditChapter} />)
                            }
                        </div>
                    </div>

                    <div className='edit-obra-new-chapter'>
                        <div className='h1-section'>Añadir capítulo</div>
                        <div className='edit-chapter-number'>
                            <label htmlFor='label-new-chapter-number'>Numero: </label>
                            <input name="input-new-chapter-number" value={newChapterNumber} onChange={(e) => { this.updateNewChapterState(e, 1) }} placeholder="Número del capítulo" />
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

                <div className='h1-section'>Eliminar obra</div>
                <div className='delete-section'>
                    <div className='delete-check-pass'>
                        <input type='password' ref={this.refPassword} value={pass} onChange={(e) => { this.updateSate(e, 1) }} placeholder='Contraseña actual' disabled />
                        <button disabled={!disabledPasswordCheckE} onClick={(e) => { this.activarEliminacion() }} >Comprobar</button>
                        <button onClick={() => { this.activarEditPassword() }}>editar</button>
                    </div>

                    <div className='delete-check-palabra'>
                        <input type='text' value={palabra} ref={this.refPalabra} onChange={(e) => { this.updateSate(e, 2) }} placeholder='Ingresar ELIMINAR' disabled />
                        <button disabled={!disabledEliminar} onClick={(e) => { this.checkPalabra() }} >Borrar</button>
                    </div>

                </div>
            </div>
        );
    }
}

