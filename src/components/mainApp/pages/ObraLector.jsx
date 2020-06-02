import React, { Component } from 'react';
import axios from 'axios';
import './pages.scss';

export default class ObraEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            obra: '', user: '', nombre: '', autor: '', lanzamiento: '',
            listSocialMedia: [], demografia: '',
            generos: [], socialMedia: [], tipo: '',
            listChapters: [], cover: '',
            descripcion: '', coverHash: Date.now(),
        }
    }


    //Carga los datos al montarse el componente
    componentDidMount() {

        if (localStorage.getItem('obra')) {
            const n = parseInt(localStorage.getItem('obra'));
            const user = parseInt(localStorage.getItem('user'));
            this.setState({ obra: n, user: user }, () => { this.findDetailtObra() })
        }
    }

    //TODO IMPLEMENTAR SOCIAL MEDIA EN OBRA TAMBIEN

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
                estado: datos.NESTADO,
                tipo: datos.NTIPO,
                demografia: datos.NDEMOGRAFIA

            }, async () => {

                this.setState({
                    generos: await this.findCaracteristicaObra('generos-actuales'),
                    listSocialMedia: await this.findCaracteristicaObra('socialMedia'),
                    listChapters: await this.findCaracteristicaObra('chapters')
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

    // Rederidige al capítulo seleccionado
    verChapter = (chapter) => {
        Promise.resolve(localStorage.setItem("chapter", chapter)).then(this.props.changeToChapter(chapter))
    }


    render() {

        const { nombre, autor, lanzamiento, descripcion, cover, estado, tipo, demografia, generos, listChapters } = this.state

        return (
            <div className='obra-lector'>

                <div className='ol-cover-details'>
                    <div className='ol-cover' >
                        <img alt='cover de la obra' src={cover} />
                    </div>
                    <div className='ol-details' >
                        <div className='ol-detail'>{nombre}</div>
                        <div className='ol-detail'>{autor}</div>
                        <div className='ol-detail'>Lanzamiento: {lanzamiento}</div>
                        <div className='ol-detail'>Tipo: {tipo}</div>
                        <div className='ol-detail-generos'>
                            <div>Generos: </div>
                            {generos.map((item, index) => {
                                return [
                                    <div className='ol-generos' key={'olg' + index} >{item.NOMBRE}</div>
                                ]
                            })}
                        </div>

                        <div className='ol-detail'>Demografia: {demografia}</div>
                        <div className='ol-detail'>Estado: {estado}</div>
                    </div>

                </div>
                <div className='ol-descripcion'>
                    <div>Descipción:</div>
                    <div>{descripcion}</div>
                </div>
                <div className='ol-chapters'>
                    <div>Capítulos: </div>
                    <div className='ol-chapters-list'>

                        {listChapters.map((item, index) => {
                            return [

                                <div className='ol-chapter-item' onClick={() => { this.verChapter(item.ID) }} key={'ol-lc' + index} >
                                    <div>{item.NUMERO}</div>
                                    <div>{item.NOMBRE}  ID:{item.ID}</div>
                                </div>

                            ]
                        })}

                    </div>
                </div>

            </div>
        );
    }

}