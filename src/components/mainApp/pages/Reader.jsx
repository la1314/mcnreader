import React, { Component } from 'react';
import axios from 'axios';

export default class Reader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            obra: '', chapter: '', listPages: null, reader: 'paginada-oriental', tipo: '', estilo: ['simple', 'doble'],
            styleManga: null, puntero: 0, dobles: 0
        }
    }

    //Carga los datos al montarse el componente
    componentDidMount() {

        if (localStorage.getItem('chapter')) {
            const obra = parseInt(localStorage.getItem('obra'));
            const chapter = parseInt(localStorage.getItem('chapter'));
            this.setState({ obra: obra, chapter: chapter, puntero: 0 }, async () => {
                this.setState({ listPages: await this.findPages() }, () => {
                    this.reordenarManga(this.state.listPages)
                    document.addEventListener("keydown", this.eventosKey, false);
                })
            })
        }
    }

    //Remueve los eventos asignados
    componentWillUnmount() {

        document.removeEventListener("keydown", this.eventosKey, false);
    }

    //Devuelve las paginas de un capítulo
    findPages = () => {
        const { chapter } = this.state
        return axios.post('/api/find-chapter-pages/', null, {
            params: { chapter: parseInt(chapter) }
        }).then(res => { return res.data })
    }

    //Reorganiza las paginas del capítulo actual en un nuevo state para ser mostrato en caso necesario
    reordenarManga = (lista) => {

        let union = [];

        for (let index = 0; index < lista.length; index += 2) {
            if (index !== lista.length - 1) { union.push(lista[index + 1]) }
            union.push(lista[index])
        }
        this.setState({ styleManga: union })
    }

    //Devuelve un estilo dependiendo a los valores del READER
    devolverReader = (c, p, oc, or) => {

        const formas = [
            { 'c': 0, 'p': 0, 'oc': 0, 'or': 0, 'estilo': 'paginada' },
            { 'c': 0, 'p': 1, 'oc': 0, 'or': 0, 'estilo': 'paginada' },
            { 'c': 0, 'p': 1, 'oc': 1, 'or': 0, 'estilo': 'paginada-occidental' },
            { 'c': 0, 'p': 1, 'oc': 0, 'or': 1, 'estilo': 'paginada-oriental' },
            { 'c': 1, 'p': 0, 'oc': 0, 'or': 0, 'estilo': 'cascada' },
            { 'c': 1, 'p': 0, 'oc': 1, 'or': 0, 'estilo': 'cascada-occidental' },
            { 'c': 1, 'p': 0, 'oc': 0, 'or': 1, 'estilo': 'cascada-oriental' }
        ]

        let filtrado = formas.filter(item => (item.c === c) && (item.p === p) && (item.oc === oc) && (item.or === or))

        return filtrado[0].estilo;
    }

    //Captura las flechas <- y ->
    eventosKey = (e) => {

        if (e.keyCode === 37) {
            this.modificarPuntero(0);
        }

        if (e.keyCode === 39) {
            this.modificarPuntero(1);
        }
    }

    //Modifica los estados puntero y dobles
    modificarPuntero = (tipe) => {

        const { puntero, listPages, dobles, } = this.state
        const pagTotales = listPages.length - 1

        if (puntero === 0 && tipe === 0) return
        if (puntero === pagTotales && tipe === 1) return

        if (tipe) {

            this.setState({ puntero: (puntero + 1) }, () => { window.scrollTo(0, 0) })
        } else {

            this.setState({ puntero: (puntero - 1) }, () => { window.scrollTo(0, 0) })
        }

        if ((dobles === 0 || dobles === 1) && tipe === 0) return
        if ((dobles === pagTotales || dobles === (pagTotales - 1)) && tipe === 1) return

        if (tipe) {

            this.setState({ dobles: (dobles + 2) }, () => { window.scrollTo(0, 0) })
        } else {

            this.setState({ dobles: (dobles - 2) }, () => { window.scrollTo(0, 0) })
        }
    }

    //Utilizada en caso de vista de dos páginas
    devolverPaginadoDoble = (lista, puntero, estilo) => {

        const total = lista.length - 1;
        let est1 = null
        let est2 = null
        if (puntero === total) {
            est1 = lista[puntero].ESTILO;
        } else {
            est1 = lista[puntero].ESTILO;
            est2 = lista[puntero + 1].ESTILO;

        }

        if ((est1 === 0 && est2 === 0)) {

            return [
                <img className={'reader-page ' + estilo[lista[puntero].ESTILO]} key={'img-paginada'} alt='imagen del capítulo' src={lista[puntero].RUTA} />,
                <img className={'reader-page ' + estilo[lista[puntero + 1].ESTILO]} key={'img-paginada2'} alt='imagen del capítulo' src={lista[puntero + 1].RUTA} />
            ]

        } else {

            return <img className={'reader-page ' + estilo[lista[puntero].ESTILO]} key={'img-paginada'} alt='imagen del capítulo' src={lista[puntero].RUTA} />
        }

    }

    //TODO AÑADIR LECTOR
    render() {

        const { listPages, reader, estilo, styleManga, puntero, dobles } = this.state

        if (listPages === null) { return null }
        if (styleManga === null) { return null }

        return (
            <div className={reader}>

                {reader === 'cascada' && (listPages.map((item, index) => {
                    return [
                        <img className={'reader-page ' + estilo[item.ESTILO]} key={'img' + index} alt='imagen del capítulo' src={item.RUTA} />
                    ]
                }))}

                {reader === 'cascada-oriental' && (styleManga.map((item, index) => {
                    return [
                        <img className={'reader-page ' + estilo[item.ESTILO]} key={'img' + index} alt='imagen del capítulo' src={item.RUTA} />
                    ]
                }))}

                {reader === 'cascada-occidental' && (listPages.map((item, index) => {
                    return [
                        <img className={'reader-page ' + estilo[item.ESTILO]} key={'img' + index} alt='imagen del capítulo' src={item.RUTA} />
                    ]
                }))}

                {reader === 'paginada' && (<img className={'reader-page ' + estilo[listPages[puntero].ESTILO]} key={'img-paginada'} alt='imagen del capítulo' src={listPages[puntero].RUTA} />)}
                {reader === 'paginada-occidental' && (this.devolverPaginadoDoble(listPages, dobles, estilo))}
                {reader === 'paginada-oriental' && (this.devolverPaginadoDoble(styleManga, dobles, estilo))}


            </div>
        );
    }
}