import React, { Component } from 'react';
import axios from 'axios';

export default class HomePL extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pendientes: [],
            lista: [],
            isSelect: false,
        }
    }

    //Carga los datos al state
    componentDidMount(){
        this.findListaSeguidos()
    }

    //Carga los capitulos pendientes al state
    findPendientes = () => {
        axios.post(`/api/check-social-media/`).then((res)=>{ console.log(res.data)})
    }

    //Carga los capitulos pendientes al state
    findListaSeguidos = () => {
        axios.post(`/api/get-list-follow`).then((res)=>{ this.setState({lista: res.data}) })
        
    }

    //Deja de seguir una obra
    unfollow = (obra) => {
        axios.post(`/api/unfollow-obra/`, null, { params: { obra: obra } }).then( ()=>{this.findListaSeguidos()} )
    }


    render() {

        //const {isSelect, lista, pendientes} = this.state;

        return (
            <div className='home-pl-container'>
                <div className='home-pl-options'>
                    <div  >Capítulos pendientes</div>
                    <div>Lista</div>
                </div>

                <div className='home-pl-list' >Incognita</div>
              
            </div>
        );
    }
}