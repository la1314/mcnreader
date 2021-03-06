import React, { Component } from 'react';
import axios from 'axios';
import EOItem from './items/EditorObraItem.jsx';
import ReactDOM from 'react-dom';
import Dialog from '../../mainApp/pages/items/Dialog.jsx';
axios.defaults.withCredentials = true;

export default class Gestor extends Component {

  _isMounted2 = false;
  constructor(props) {
    super(props);
    this.state = {
      coverList: [], nombre: '', autor: '',
      lanzamiento: '', tipos: [], estados: [],
      tipo: 1, estado: 1, visibilidad: 0
    };
  }

  //Carga los datos del localStorage y asigna valores a los state tipos y estados
  componentDidMount() {
    this._isMounted2 = true;
    this.cargarItems();
    this.cargarDatos();
  }

  componentWillUnmount() {
    this._isMounted2 = false;
  }

  cargarDatos = () => {

    this.findObras().then(res => {
      if (this._isMounted2) { this.setState({ coverList: res }) }
    })

    this.obtenerValores('tipos').then(res => {
      if (this._isMounted2) { this.setState({ tipos: res }) }
    })

    this.obtenerValores('estados').then(res => {
      if (this._isMounted2) { this.setState({ estados: res }) }
    })

  }


  //Carga los valores del localStorage en los state
  cargarItems = () => {
    if (localStorage.getItem('nombre')) {
      if (this._isMounted) {
        this.setState({ nombre: localStorage.getItem('nombre') })
      }
    }
    if (localStorage.getItem('autor')) {
      if (this._isMounted) {
        this.setState({ autor: localStorage.getItem('autor') })
      }
    }
    if (localStorage.getItem('lanzamiento')) {
      if (this._isMounted) {
        this.setState({ lanzamiento: localStorage.getItem('lanzamiento') })
      }
    }
  }

  //Recupera datos para los options
  obtenerValores = (option) => {

    return axios.post(`https://mcnreader.herokuapp.com/api/find-${option}/`).then(function (res) {
      // handle success
      return res.data
    })
  }

  //Actualiza el estado username con el value del target
  updateNombre = (e) => {
    const nombre = e.target.value;
    localStorage.setItem('nombre', nombre);
    this.setState({ nombre: nombre })
  }

  //Actualiza el estado autor con el value del target
  updateAutor = (e) => {
    const autor = e.target.value;
    localStorage.setItem('autor', autor);
    this.setState({ autor: autor })
  }

  //Actualiza el estado lanzamiento con el value del target
  updateLanzamiento = (e) => {

    const re = /^[0-9\b]+$/;
    const lanzamiento = e.target.value;

    if ((lanzamiento === '' || re.test(lanzamiento)) && lanzamiento.length < 5) {
      localStorage.setItem('lanzamiento', lanzamiento);
      this.setState({ lanzamiento: lanzamiento })
    }
  }

  //Actualiza el estado lanzamiento con el value del target
  updateTipo = (e) => {
    const tipo = e.target.value;
    this.setState({ tipo: tipo })
  }

  //Actualiza el estado lanzamiento con el value del target
  updateEstado = (e) => {
    const estado = e.target.value;
    this.setState({ estado: estado })
  }

  //Actualiza el estado lanzamiento con el value del target
  updateVisibilidad = (e) => {
    const visibilidad = e.target.value;
    this.setState({ visibilidad: visibilidad })
  }

  //Hace una petición para crear una nueva obra
  newObra = () => {

    const { tipo, estado, nombre, autor, lanzamiento, visibilidad } = this.state

    axios.post('https://mcnreader.herokuapp.com/api/new-obra/', null, {
      params: {
        editor: this.props.user,
        tipo: tipo,
        estado: estado,
        name: nombre,
        autor: autor,
        lanzamiento: lanzamiento || 1990,
        visibilidad: visibilidad
      }
    }).then(() => {

      axios.post('https://mcnreader.herokuapp.com/api/obra-id/', null, {
        params: {
          editor: this.props.user,
          name: nombre,
          tipo: tipo,
          autor: autor
        }
      }).then(async (res) => {

        const editor = this.props.user
        const obra = res.data.ID_OBRA
        const formData = new FormData();
        formData.append('editor', `${editor}`);
        formData.append('work', `${obra}`);
        formData.append('action', 'newWordDirectory');
        axios.post('https://tuinki.gupoe.com/media/options.php', formData)

        this.setState({ nombre: '', autor: '', lanzamiento: '' })
        localStorage.removeItem('lanzamiento');
        localStorage.removeItem('autor');
        localStorage.removeItem('nombre');

        this.setState({ coverList: await this.findObras() })

        axios.post('https://mcnreader.herokuapp.com/api/default-demografia/', null, { params: { obra: obra } })
        this.showDialog('Mensaje del sistema', 'Obra creada exitosamente')
      })
    })
  }

  //Recupera todas las obras del editor
  findObras = () => {

    return axios.post('https://mcnreader.herokuapp.com/api/find-all-editor-obras/', null, {
      params: {
        editor: this.props.user,
      }
    }).then(res => { return res.data })

  }

  //Función que añade al ReactDOM una carta con los datos pasados
  showDialog = (titulo, mensaje) => {

    let contenedor = document.getElementById('dialog');
    ReactDOM.unmountComponentAtNode(contenedor);
    let carta = <Dialog titulo={titulo} mensaje={mensaje} />;
    ReactDOM.render(carta, contenedor)
  }

  render() {

    const { tipos, estados, nombre, autor, lanzamiento, coverList } = this.state

    return (
      <div className='gestor-container'>

        <div className='editor-container-obras'>
          {coverList.map((item) => <EOItem changeToEditObra={this.props.changeToEditObra} key={item.NOMBRE} obra={item.ID_OBRA} image={item.COVER} name={item.NOMBRE} />)}
        </div>

        <div className='create-obra-container' >
          <div className='h1-section'>Añadir Obra</div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="nameObra">nombre: </label>
              <input type="text" value={nombre} onChange={this.updateNombre} name="nameObra" placeholder="Nombre de la obra" />
            </div>
            <div className="form-group">
              <label htmlFor="autor">Autor: </label>
              <input type="text" value={autor} onChange={this.updateAutor} name="autor" placeholder="Nombre del autor" />
            </div>
            <div className="form-group">
              <label htmlFor="lanzamiento">Lanzamiento: </label>
              <input value={lanzamiento} onChange={this.updateLanzamiento} name="lanzamiento" placeholder="Año de lanzamiento" />
            </div>
            <div className="form-group">
              <label htmlFor="tipo">Tipo: </label>
              <select id="tipo" onChange={this.updateTipo}>
                {tipos.map((item) => <option key={item.NOMBRE} value={item.ID} >{item.NOMBRE}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="estado">Estado: </label>
              <select id="estado" onChange={this.updateEstado}>
                {estados.map((item) => <option key={item.NOMBRE} value={item.ID} >{item.NOMBRE}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="visibilidad">Visibilidad: </label>
              <select id="visibilidad" onChange={this.updateVisibilidad} >
                <option value="0">OCULTO</option>
                <option value="1">VISIBLE</option>
              </select>
            </div>
            <button type="submit" onClick={() => this.newObra()} className="btn">
              Crear Obra
          </button>
          </div>
        </div>
      </div>
    );
  }
}
