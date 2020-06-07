import React, { Component } from 'react';
import axios from 'axios';

export default class HomePL extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pendientes: [],
            lista: [],
            isSelect: 0,
        }
    }

    //Carga los datos al state
    componentDidMount() {
        this.findListaSeguidos()
        this.findPendientes()
    }

    //Carga los capitulos pendientes al state
    findPendientes = () => {
        axios.post(`/api/get-no-leidos/`).then((res) => {

            const filtrado = res.data.filter(item => item.TOTALCAPS !== item.LEIDOS)
            this.setState({ pendientes: filtrado })

        })
    }

    //Carga los capitulos pendientes al state
    findListaSeguidos = () => {
        axios.post(`/api/get-list-follow`).then((res) => { this.setState({ lista: res.data }) })

    }

    //Deja de seguir una obra
    unfollow = (obra) => {
        axios.post(`/api/unfollow-obra/`, null, { params: { obra: obra } }).then(() => { this.findListaSeguidos() })
    }

    //Cambia la selección
    changeSelect = (n) => {
        this.setState({ isSelect: n })
    }

    render() {

        const { isSelect, lista, pendientes } = this.state;

        return (
            <div className='home-pl-container'>
                <div className='home-pl-options'>
                    <div onClick={() => { this.changeSelect(0) }}>Capítulos pendientes</div>
                    <div onClick={() => { this.changeSelect(1) }}>Lista</div>
                </div>

                <div className='home-pl-list' >

                    {isSelect ?
                        lista.map((item, index) => {
                            return [
                                <div className='seguidos' onClick={() => { this.props.verObra(item.ID) }} key={'pl-l' + index} >
                                    <div>{item.NOMBRE}</div>
                                    <img alt='cover de la obra' src={item.COVER}></img>
                                </div>
                            ]
                        })
                        :
                        pendientes.map((item, index) => {
                            return [
                                <div className='pendientes' onClick={() => { this.props.verObra(item.ID) }} key={'pl-p' + index} >
                                    <div>{item.NOMBRE}</div>
                                    <img alt='cover de la obra' src={item.COVER} ></img>
                                    <div>{item.LEIDOS}/{item.TOTALCAPS}</div>
                                </div>
                            ]
                        })
                    }

                </div>

            </div>
        );
    }
}