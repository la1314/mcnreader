import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

export default class Library extends Component {

  constructor(props) {
    super(props);
    this.state = {
      letras: [],
      lista: []
    }
  }


  componentDidMount() {
    this.findLetras()
  }

  //Obtiene las distintas caracteristicas de una obra
  findLetras = () => {

    axios.post(`https://mcnreader.herokuapp.com/api/find-first-letra/`).then(res => { this.setState({ letras: res.data }) }).then(() => {

      const { letras } = this.state
      this.findLista(letras[0].LETRA)

    })
  }

  //Obtiene las distintas caracteristicas de una obra
  findLista = (letra) => {
    axios.post(`https://mcnreader.herokuapp.com/api/find-by-letra/`, null, { params: { letra: letra } }).then(res => {
      this.setState({ lista: res.data })
    })
  }

  // Rederidige a la página de la obra seleccionada
  verObra = (obra) => {
    Promise.resolve(localStorage.setItem("obra", obra)).then(this.props.changeToObra(obra))
  }

  render() {

    const { letras, lista } = this.state

    return (
      <div className='library-container'>

        <div className='library-abcedario'>
          {
            letras.map((item, index) => {
              return [
                <div onClick={() => { this.findLista(item.LETRA)}} className='library-letra' key={'l-l' + index}>
                  <div>{item.LETRA}</div>
                </div>
              ]
            })
          }
        </div>

        <div className='library-lista'>
          {
            lista.map((item, index) => {
              return [
                <div className='library-obra' onClick={() => { this.verObra(item.ID) }} key={'l-o' + index}>
                  <div className={'cover-tipo ' + item.TIPO.replace(' ','') }>{item.TIPO}</div>
                  
                  <img alt='cover de la obra' src={item.COVER}></img>
                  <div className='cover-name'>{item.NOMBRE}</div>
                </div>
              ]
            })
          }
        </div>

      </div>
    );
  }
}