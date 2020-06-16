import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Dialog from '../../mainApp/pages/items/Dialog.jsx';
const md5 = require('md5');
axios.defaults.withCredentials = true;

export default class EditChapter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chapter: this.props.chapter,
            name: '', number: '',
            date: '',
            visibilidad: '',
            listPages: [],
            listFiles: [],
            estilos: ['Simple', 'Doble'],
            pass: '',
            disabledPasswordCheckE: false,
            palabra: '',
            disabledEliminar: false,
            palabraEliminacion: 'ELIMINAR'
        };
        this.refPassword = React.createRef();
        this.refPalabra = React.createRef();
    }

    //Carga los datos del capítulo
    componentDidMount() {

        if (localStorage.getItem('chapter')) {

            const value = parseInt(localStorage.getItem('chapter'));
            const obra = parseInt(localStorage.getItem('obraEdit'));
            const editor = parseInt(localStorage.getItem('user'));
            this.setState({ chapter: value, obra: obra, editor: editor }, () => { this.getChapterDetails() })
        }
    }

    //Carga los datos del capitulo actual
    getChapterDetails = () => {

        const { chapter } = this.state

        axios.post('https://mcnreader.herokuapp.com/api/find-info-chapter/', null, {
            params: { chapter: parseInt(chapter) }
        }).then(res => {

            const data = res.data
            this.setState({
                name: data.NOMBRE,
                number: data.NUMERO,
                date: data.FECHA,
                visibilidad: data.VISIBILIDAD,
                estilo: data.ESTILO
            })
        }).then(async () => { this.setState({ listPages: await this.findPages() }) })
    }

    //Devuelve las paginas de un capítulo
    findPages = () => {
        const { chapter } = this.state
        return axios.post('https://mcnreader.herokuapp.com/api/find-chapter-pages/', null, {
            params: { chapter: parseInt(chapter) }
        }).then(res => { return res.data })
    }

    //Edita los parametros de una obra
    editChapter = async (e, type) => {

        const { chapter } = this.state
        const value = e.target.value

        axios.post('https://mcnreader.herokuapp.com/api/edit-chapter-pages/', null, { params: { type: type, id: chapter, value: value } })

        switch (type) {
            case 1:
                this.setState({ number: value })
                break;

            case 2:
                this.setState({ name: value })
                break;

            case 3:
                this.setState({ date: value })
                break;

            case 4:
                this.setState({ visibilidad: value }, () => { this.showUpdate(4) })

                break;

            //Al borrar cambiar la pagina a Gestor TODO
            default:
                break;
        }
    }

    //Elimina las paginas de un capítulo
    deleteChapterPages = (page, name) => {

        const { editor, obra, chapter } = this.state
        const config = { headers: { 'content-type': 'multipart/form-data' } }

        let nombre = name.split('/')
        nombre = nombre[nombre.length - 1]

        const formData = new FormData();
        formData.append('editor', editor);
        formData.append('work', obra);
        formData.append('chapter', chapter);
        formData.append('images', nombre);
        formData.append('action', 'deleteChapterFile');

        axios.post('https://tuinki.gupoe.com/media/options.php', formData, config).then(
            axios.post('https://mcnreader.herokuapp.com/api/delete-page/', null, {
                params: { page: parseInt(page) }
            }).then(async () => {
                this.setState({ listPages: await this.findPages() })
            })
        )
    }



    //Función llamada para editar el numero de una pagina
    editPageNumber = (e, page) => {
        const value = e.target.value

        if (value) {
            axios.post('https://mcnreader.herokuapp.com/api/edit-page-number/', null, { params: { page: page, value: value } }).then(async () => {
                this.setState({ listPages: await this.findPages() })
            })
        }
    }

    //Función llamada para editar el estilo de una pagina
    editPageStyle = (e, page) => {
        const value = e.target.value

        if (value) {
            axios.post('https://mcnreader.herokuapp.com/api/edit-page-style/', null, { params: { page: page, value: value } }).then(async () => {
                this.setState({ listPages: await this.findPages() })
            })
        }
    }

    //Actualiza el estado lisFiles
    chargeImages = (e) => {

        const files = e.target.files
        this.setState({ listFiles: files })
    }

    //Carga las paginas en el servidor y la BD
    uploadPages = () => {

        const { chapter, listFiles, listPages, obra, editor } = this.state
        let nombres = [];
        let npages = listPages.length

        for (let index = 0; index < listFiles.length; index++) {
            nombres.push(npages + (index + 1))
        }

        if (listFiles.length !== 0) {

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }

            const formData = new FormData();
            formData.append('editor', editor);
            formData.append('work', obra);
            formData.append('rutas', nombres);
            formData.append('chapter', chapter);

            for (let index = 0; index < listFiles.length; index++) {
                formData.append('images[]', listFiles[index]);
            }

            formData.append('action', 'newChapterFile');
            axios.post('https://tuinki.gupoe.com/media/options.php', formData, config).then((res) => {

                const rutas = res.data

                axios.post('https://mcnreader.herokuapp.com/api/add-chapter-pages/', null, {
                    params: { chapter: parseInt(chapter), rutas: rutas, numeros: nombres }
                }).then(async () => {

                    this.setState({ listPages: await this.findPages() })
                })
            })
        }
    }


    //Función que añade al ReactDOM una carta con los datos pasados
    showDialog = (titulo, mensaje) => {

        let contenedor = document.getElementById('dialog');
        ReactDOM.unmountComponentAtNode(contenedor);
        let carta = <Dialog titulo={titulo} mensaje={mensaje} />;
        ReactDOM.render(carta, contenedor)
    }

    // Muestra un mensaje dependiendo al valor de tipe
    showUpdate = (tipe) => {

        switch (tipe) {
            case 1:
                this.showDialog('Mensaje del sistema', 'Nombre del capítulo actualizado correctamente')
                break;

            case 2:
                this.showDialog('Mensaje del sistema', 'Número del capítulo  actualizado correctamente')
                break;

            case 3:
                this.showDialog('Mensaje del sistema', 'Fecha de lanzamiento del capítulo  actualizado correctamente')
                break;

            case 4:
                this.showDialog('Mensaje del sistema', 'Visibilidad del capítulo  actualizado correctamente')
                break;

            default:
                break;
        }
    }

    /**Eliminación**/

    //Elimina las paginas de un capítulo
    deleteChapter = () => {

        const { editor, obra, chapter } = this.state
        const config = { headers: { 'content-type': 'multipart/form-data' } }

        const formData = new FormData();
        formData.append('editor', editor);
        formData.append('work', obra);
        formData.append('chapter', chapter);
        formData.append('action', 'deleteChapterDirectory');

        axios.post('https://tuinki.gupoe.com/media/options.php', formData, config).then(
            axios.post('https://mcnreader.herokuapp.com/api/delete-chapter/', null, {
                params: { chapter: parseInt(chapter) }
            }).then(() => {
                this.showDialog('Mensaje del sistema:', 'Capítulo eliminado correctamente')
                this.props.changeToEditObra(obra)
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
            this.showDialog('Mensaje del sistema:', 'Inserte ELIMINAR para eliminar el capítulo')
        } else {
            this.showDialog('Mensaje del sistema:', 'La contraseña ingresada es incorrecta')
        }
    }

    checkPalabra = () => {

        const { palabra, palabraEliminacion } = this.state

        if (palabra === palabraEliminacion) {

            this.deleteChapter()

        } else {
            this.showDialog('Mensaje del sistema:', 'Palabra de eliminación incorrecta')
        }
    }

    render() {

        const { name, number, date, listPages, visibilidad, obra, estilos, pass, disabledPasswordCheckE, palabra, disabledEliminar } = this.state

        return (
            <div className='edit-chapter'>
                <div className='return-edit-obra'>
                    <button onClick={() => { this.props.changeToEditObra(obra) }}> Regrasar a edición </button>
                </div>
                <div className='edit-chapter-details-contaienr' >

                    <div className='h1-section'>Detalles del capítulo</div>
                    <div className='edit-chapter-name'>
                        <label htmlFor='label-new-chapter-number'>Nombre: </label>
                        <input type='text' value={name} name="input-new-chapter-name" onChange={(e) => { this.editChapter(e, 2) }} onBlur={() => { this.showUpdate(1) }} placeholder="Nombre del capítulo" />
                    </div>
                    <div className='edit-chapter-number'>
                        <label htmlFor='label-new-chapter-number'>Número: </label>
                        <input type='number' value={number} name="input-new-chapter-number" onChange={(e) => { this.editChapter(e, 1) }} onBlur={() => { this.showUpdate(2) }} placeholder="Número del capítulo" />
                    </div>
                    <div className='edit-chapter-date'>
                        <label htmlFor='label-new-chapter-number'>Fecha lanzamiento: </label>
                        <input type='date' value={date} onChange={(e) => { this.editChapter(e, 3) }} onBlur={() => { this.showUpdate(3) }} name="input-new-chapter-date" />
                    </div>

                    <div className='edit-chapter-visibilidad'>
                        <label htmlFor="label-new-chapter-visibilidad">Visibilidad: </label>
                        <select value={visibilidad} id="select-new-chapter-visibilidad" onChange={(e) => { this.editChapter(e, 4) }}  >
                            <option value="0">OCULTO</option>
                            <option value="1">VISIBLE</option>
                        </select>
                    </div>


                </div>

                <div className='edit-chapter-upload-images' onDrag={this.chargeImages}>
                    <input type="file" className="form-control" multiple onChange={this.chargeImages} />
                    <button onClick={() => { this.uploadPages() }} >Subir paginas</button>
                </div>

                <div className='h1-section'>Lista de páginas</div>
                <div className='edit-chapter-pages'>
                    {listPages.map((item, index) => {
                        return [
                            <div className='edit-page-item' key={'imgPages' + index} >
                                <img alt='pagina del capitulo' src={item.RUTA} />
                                <div>
                                    <div>Número de página: </div>
                                    <input type='number' value={item.NUMERO} name="input-new-page-number" onChange={(e) => { this.editPageNumber(e, item.ID) }} placeholder="Número de la pagina" />
                                </div>
                                <div>
                                    <label htmlFor="pagina-estilo">Estilo: {estilos[item.ESTILO]} </label>
                                    <select id="edit-estilo-page" value={item.ESTILO} onChange={(e) => { this.editPageStyle(e, item.ID) }} >
                                        <option key={'ep-0'} value='0'>Simple</option>
                                        <option key={'ep-1'} value='1'>Doble</option>
                                    </select>
                                </div>
                                <button className='btn' onClick={() => { this.deleteChapterPages(item.ID, item.RUTA) }}>Eliminar</button>
                            </div>
                        ]
                    })}
                </div>
                <div className='delete-container'>
                    <div className='h1-section'>Borrar capítulo</div>
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

            </div>
        );
    }
}
