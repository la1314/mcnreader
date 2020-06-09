import React, { Component } from 'react';
import axios from 'axios';
import HomePL from './items/HomePL.jsx';
import HomeTop from './items/HomeTop.jsx'


export default class Home extends Component {

  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      recientes: null
    };
  }

  //Carga los datos al montarse el componente
  componentDidMount() {

    this._isMounted = true;

    this.findRecientes();

  }

  componentWillUnmount() {
    this._isMounted = false;
  }


  // Devuelve los capítulos recientemente publicados
  findRecientes = () => {

    axios.post('/api/find-recientes/').then((res) => {
      if (this._isMounted) {
        this.setState({ recientes: res.data })
      }
    })

  }

  // Rederidige a la página de la obra seleccionada
  verObra = (obra) => {
    Promise.resolve(localStorage.setItem("obra", obra)).then(this.props.changeToObra(obra))
  }

  render() {

    const { recientes } = this.state

    if (recientes === null) { return null }

    return (
      <div className='home-container'>

        <div className='home-top-10'>
          <div className='h1-section'>TOP 10</div>
          <HomeTop verObra={this.verObra} />
        </div>

        <div className='home-pendientes' >
          <HomePL verObra={this.verObra} />
        </div>

        <div className='home-recientes' >
          <div className='h1-section'>Capítulos recientes</div>
          <div className='recientes-container'>
            {
              recientes.map((item, index) => {
                return [
                  <div className='recientes' onClick={() => { this.verObra(item.OBRA) }} key={'co' + index} >
                    <div className='cover-tipo' >{item.TIPO}</div>
                    <img alt='cover de la obra' src={item.COVER} ></img>
                    <div className='cover-name'>{item.NOMBRE}</div>
                    <div className='cover-date'>{item.FECHA}</div>
                  </div>

                ]
              })
            }
          </div>

        </div>
      </div>
    );
  }
}