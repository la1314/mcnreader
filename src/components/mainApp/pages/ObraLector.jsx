import React, { Component } from 'react';
import axios from 'axios';
import PI from './items/PuntuacionItem.jsx';
import CI from './items/ChapterItem.jsx';
axios.defaults.withCredentials = true;

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
            const rol = localStorage.getItem('rol');
            this.setState({ obra: n, user: user, rol: rol }, () => { this.findDetailtObra() })
        }
    }

    //TODO IMPLEMENTAR BOTONES PARA CAMBIO DE VISTA

    //Obtiene información de la obra
    findDetailtObra = () => {

        const { obra } = this.state

        axios.post('https://mcnreader.herokuapp.com/api/find-info-obra/', null, {
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

        return axios.post(`https://mcnreader.herokuapp.com/api/find-${option}/`, null, { params: { obra: obra } }).then(function (res) {
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
        const { rol } = this.state
        return rol === 'READER' ? axios.post(`https://mcnreader.herokuapp.com/api/find-follow/`, null, { params: { obra: obra } }).then((res) => { return res.data.Booleano }) : 0
    }

    // follow obra
    followObra = async () => {
        const { obra } = this.state
        const incognita = await this.checkFollow(obra);

        if (!incognita) {
            axios.post(`https://mcnreader.herokuapp.com/api/follow-obra/`, null, { params: { obra: obra } }).then(this.setState({ follow: 1 }))
        }

    }

    // unfollow obra
    unfollowObra = async () => {
        const { obra } = this.state
        const incognita = await this.checkFollow(obra);
        if (incognita) {
            axios.post(`https://mcnreader.herokuapp.com/api/unfollow-obra/`, null, { params: { obra: obra } }).then(this.setState({ follow: 0 }))
        }
    }

    render() {

        const { obra, rol, nombre, autor, lanzamiento, descripcion, cover, estado, tipo, demografia, generos, listChapters, follow, socialMedia } = this.state

        if (obra === null) {
            return null;
        }

        return (
            <div className='obra-lector'>

                <div className='ol-cover-details'>
                    <div className='ol-cover' >
                        <img alt='cover de la obra' src={cover} />
                        {rol === 'READER' && (
                            <div className='ol-rating-follow'>
                                <div className='rating'>
                                    <PI obra={obra} />
                                </div>
                                <div className='follow'>
                                    {follow ? <button onClick={() => { this.unfollowObra() }} >Dejar de seguir</button> : <button onClick={() => { this.followObra() }} >Seguir</button>}
                                </div>

                            </div>
                        )}

                    </div>

                    <div className='ol-details' >
                        <div className='ol-detail ol-detail-name'>{nombre}</div>
                        <div className='ol-detail ol-detail-autor'>{autor}</div>
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
                        <div className='h1-section'>Colabora con el autor</div>
                        <div className='ol-social-list'>
                            {socialMedia.map((item, index) => {
                                return [
                                    <div className='ol-social-item' key={'ol-sm' + index} >
                                        <a href={item.LINK} rel={'author'}  ><img className='logo-sm' alt={''} src={item.LOGO} /></a>
                                    </div>
                                ]
                            })}
                        </div>

                    </div>
                </div>

                <div className='ol-descripcion'>
                    <div className='h1-section'>Descipción</div>
                    <div>{descripcion}</div>
                </div>
                <div className='ol-chapters'>
                    <div className='h1-section'>Capítulos</div>
                    <div className='ol-chapters-list'>

                        {listChapters.map((item, index) => <CI rol={rol} number={item.NUMERO} chapter={item.ID} name={item.NOMBRE} key={'ol-lc' + index} verChapter={this.verChapter} />)}

                    </div>
                </div>

            </div>
        );
    }

}