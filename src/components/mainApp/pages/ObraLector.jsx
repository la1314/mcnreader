import React, { Component } from 'react';
import axios from 'axios';
import './pages.scss';
import PI from './items/PuntuacionItem.jsx';
import CI from './items/ChapterItem.jsx';
export default class ObraLector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            obra: null, user: '', nombre: '', autor: '', lanzamiento: '',
            demografia: '', generos: [], socialMedia: [], tipo: '',
            listChapters: [], cover: '',
            descripcion: '', coverHash: Date.now(), follow: 0,
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

    //TODO IMPLEMENTAR BOTONES PARA CAMBIO DE VISTA

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
                tipoID: datos.TIPO,
                tipo: datos.NTIPO,
                demografia: datos.NDEMOGRAFIA

            }, async () => {

                this.setState({
                    follow: await this.checkFollow(this.state.obra),
                    generos: await this.findCaracteristicaObra('generos-actuales'),
                    socialMedia: await this.findCaracteristicaObra('social-media'),
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
        const { tipoID } = this.state
        Promise.resolve(localStorage.setItem("chapter", chapter), localStorage.setItem("tipo", tipoID)).then(this.props.changeToChapter(chapter))
    }

    // compruba que el usuario sigue una obra
    checkFollow = (obra) => {
        return axios.post(`/api/find-follow/`, null, { params: { obra: obra } }).then((res) => { return res.data.Booleano })
    }

    // follow obra
    followObra = async () => {
        const { obra } = this.state
        const incognita = await this.checkFollow(obra);

        if (!incognita) {
            axios.post(`/api/follow-obra/`, null, { params: { obra: obra } }).then(this.setState({ follow: 1 }))
        }

    }

    // unfollow obra
    unfollowObra = async () => {
        const { obra } = this.state
        const incognita = await this.checkFollow(obra);
        if (incognita) {
            axios.post(`/api/unfollow-obra/`, null, { params: { obra: obra } }).then(this.setState({ follow: 0 }))
        }
    }

    render() {

        const { obra, nombre, autor, lanzamiento, descripcion, cover, estado, tipo, demografia, generos, listChapters, follow, socialMedia } = this.state

        if (obra === null) {
            return null;
        }

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
                    <div className='ol-social'>
                        {socialMedia.map((item, index) => {
                            return [
                                <div key={'ol-sm' + index} >
                                    <a href={item.LINK} rel={'author'}  ><img className='logo-sm' alt={''} src={item.LOGO} /></a>
                                </div>
                            ]
                        })}
                    </div>
                </div>


                <div className='ol-rating-follow'>
                    <div className='rating'>
                        <PI obra={obra} />
                    </div>
                    <div className='follow'>
                        {follow ? <button onClick={() => { this.unfollowObra() }} >Dejar de seguir</button> : <button onClick={() => { this.followObra() }} >Seguir</button>}
                    </div>

                </div>

                <div className='ol-descripcion'>
                    <div>Descipción:</div>
                    <div>{descripcion}</div>
                </div>
                <div className='ol-chapters'>
                    <div>Capítulos: </div>
                    <div className='ol-chapters-list'>

                        {listChapters.map((item, index) => <CI number={item.NUMERO} chapter={item.ID} name={item.NOMBRE} key={'ol-lc' + index} verChapter={this.verChapter} />)}

                    </div>
                </div>

            </div>
        );
    }

}