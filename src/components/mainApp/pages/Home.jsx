import React, { Component } from 'react';
import axios from 'axios';

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
        <div className='home-top-10'>TOP 10</div>
        <div className='home-pendientes' >Pendientes: </div>
        <div className='home-recientes' >
          <label>Capítulos recientes:</label>
          <div className='recientes-container'>
            {
              recientes.map((item, index) => {
                return [

                  <div className='recientes' onClick={() => { this.verObra(item.OBRA) }} key={'co' + index} >
                    <div>{item.TIPO}</div>
                    <div>{item.NOMBRE}</div>
                    <img alt='cover de la obra' src={item.COVER} ></img>
                    <div>{item.FECHA}</div>
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