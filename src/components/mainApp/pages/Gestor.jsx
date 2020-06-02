import React, { Component } from 'react';
import axios from 'axios';
import "./pages.scss";
import EOItem from './items/EditorObraItem.jsx';

export default class Gestor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      coverList: [], nombre: '', autor: '',
      lanzamiento: '', tipos: [], estados: [],
      tipo: 1, estado: 1, visibilidad: 0
    };
  }

  //Carga los datos del localStorage y asigna valores a los state tipos y estados
  async componentDidMount() {

    this.findObras()

    if (localStorage.getItem('nombre')) { this.setState({ nombre: localStorage.getItem('nombre') }) }
    if (localStorage.getItem('autor')) { this.setState({ autor: localStorage.getItem('autor') }) }
    if (localStorage.getItem('lanzamiento')) { this.setState({ lanzamiento: localStorage.getItem('lanzamiento') }) }

    this.setState({
      tipos: await this.obtenerValores('tipos'),
      estados: await this.obtenerValores('estados'),
      coverList: await this.findObras()
    })
  }

  //Recupera datos para los options
  obtenerValores = (option) => {

    return axios.post(`/api/find-${option}/`).then(function (res) {
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
    const lanzamiento = e.target.value;
    localStorage.setItem('lanzamiento', lanzamiento);
    this.setState({ lanzamiento: lanzamiento })
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

    axios.post('/api/new-obra/', null, {
      params: {
        editor: this.props.user,
        tipo: tipo,
        estado: estado,
        name: nombre,
        autor: autor,
        lanzamiento: lanzamiento,
        visibilidad: visibilidad
      }
    }).then(() => {

      axios.post('/api/obra-id/', null, {
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

        axios.post('/api/default-demografia/', null, { params: { obra: obra } })

      })
    })
  }

  //Recupera todas las obras del editor
  findObras = () => {

    return axios.post('/api/find-all-editor-obras/', null, {
      params: {
        editor: this.props.user,
      }
    }).then(res => { return res.data })

  }

  //TODO Crear interfaz y verificar la creación correcta en el servidor, modificar php para incluir el cover
  render() {

    const { tipos, estados, nombre, autor, lanzamiento, coverList } = this.state

    return (
      <div className='gestor-container'>

        <div className='editor-container-obras'>
          {coverList.map((item) => <EOItem changeToEditObra={this.props.changeToEditObra} key={item.NOMBRE} obra={item.ID_OBRA} image={item.COVER} name={item.NOMBRE} />)}
        </div>

        <div className='create-obra-container' >
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
              <input type="number" value={lanzamiento} onChange={this.updateLanzamiento} name="lanzamiento" placeholder="Año de lanzamiento" />
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

        <div className='contact-admin'>Contartar con el administrador</div>
      </div>
    );
  }
}
