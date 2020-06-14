import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

export default class Reader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            obra: '', chapter: '', listPages: null, reader: 'paginada', tipo: '', estilo: ['simple', 'doble'],
            styleManga: null, puntero: 0, dobles: 0, opciones: [], listChapters: []
        }
    }

    //Carga los datos al montarse el componente
    componentDidMount() {

        if (localStorage.getItem('chapter')) {
            const obra = parseInt(localStorage.getItem('obra'));
            const chapter = parseInt(localStorage.getItem('chapter'));
            const rol = localStorage.getItem('rol')
            this.setState({ obra: obra, chapter: chapter, puntero: 0, rol: rol }, async () => {

                if (rol === 'READER') {
                    this.findTipoLector();
                }

                this.setState({ listPages: await this.findPages(), listChapters: await this.findCaracteristicaObra('chapters') }, () => {
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

    //Captura las flechas <- y ->
    eventosKey = (e) => {

        if (e.keyCode === 37) {
            this.modificarPuntero(0);
        }

        if (e.keyCode === 39) {
            this.modificarPuntero(1);
        }
    }

    //Obtiene las distintas caracteristicas de una obra
    findCaracteristicaObra = (option) => {

        const { obra } = this.state

        return axios.post(`https://mcnreader.herokuapp.com/api/find-${option}/`, null, { params: { obra: obra } }).then(function (res) {
            // handle success
            return res.data
        })
    }

    //Modifica los estados puntero y dobles
    modificarPuntero = (tipe) => {

        const { puntero, listPages, dobles, } = this.state
        const pagTotales = listPages.length - 1

        if (puntero === 0 && tipe === 0) return
        if (puntero === pagTotales && tipe === 1) return

        if (tipe) {

            this.setState({ puntero: (puntero + 1) })
        } else {

            this.setState({ puntero: (puntero - 1) })
        }

        if ((dobles === 0 || dobles === 1) && tipe === 0) return
        if ((dobles === pagTotales || dobles === (pagTotales - 1)) && tipe === 1) return

        if (tipe) {

            this.setState({ dobles: (dobles + 2) })
        } else {

            this.setState({ dobles: (dobles - 2) })
        }
    }

    // Obtiene la configuración del lector del usuario
    findTipoLector = () => {

        const tipo = parseInt(localStorage.getItem('tipo'));

        axios.post('https://mcnreader.herokuapp.com/api/find-lector-tipo/', null, {
            params: { tipo: tipo }
        }).then(res => {
            if (res.data.length !== 0) {
                const datos = res.data[0]
                this.devolverReader(datos.CASCADA, datos.PAGINADA, datos.OCCIDENTAL, datos.ORIENTAL)
            }
        })
    }

    //Devuelve las paginas de un capítulo
    findPages = () => {
        const { chapter } = this.state

        return axios.post('https://mcnreader.herokuapp.com/api/find-chapter-pages/', null, {
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
        this.setState({ reader: filtrado[0].estilo })
    }

    //Cambia de capítulo actual
    cambiarCapitulo = (e) => {

        const chapter = parseInt(e.target.value)
        localStorage.setItem("chapter", chapter)
        axios.post('https://mcnreader.herokuapp.com/api/find-chapter-pages/', null, {
            params: { chapter: chapter }
        }).then(res => { this.setState({ listPages: res.data, chapter: chapter, puntero: 0, dobles: 0 }, () => { this.reordenarManga(this.state.listPages) }) })
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
                <div key='pd' >
                    <div className='reader-button'>
                        <ReaderButton onClick={() => { this.modificarPuntero(0) }} className='reader-left-Button' current='Anterior' />
                        <ReaderButton onClick={() => { this.modificarPuntero(1) }} className='reader-right-Button' current='Siguiente' />
                    </div>
                    <div className='reader-grid'>
                        <img onClick={() => { this.modificarPuntero(0) }} className={'reader-page ' + estilo[lista[puntero].ESTILO]} key={'img-paginada'} alt='imagen del capítulo' src={lista[puntero].RUTA} />
                        <img onClick={() => { this.modificarPuntero(1) }} className={'reader-page ' + estilo[lista[puntero + 1].ESTILO]} key={'img-paginada2'} alt='imagen del capítulo' src={lista[puntero + 1].RUTA} />
                    </div>

                    <div className='reader-button'>
                        <ReaderButton onClick={() => { this.modificarPuntero(0) }} className='reader-left-Button' current='Anterior' />
                        <ReaderButton onClick={() => { this.modificarPuntero(1) }} className='reader-right-Button' current='Siguiente' />
                    </div>
                </div>

            ]

        } else {

            return [
                <div key='pd'>
                    <div className='reader-button'>
                        <ReaderButton onClick={() => { this.modificarPuntero(0) }} className='reader-left-Button' current='Anterior' />
                        <ReaderButton onClick={() => { this.modificarPuntero(1) }} className='reader-right-Button' current='Siguiente' />
                    </div>
                    <div className='reader-grid'>
                        <img onClick={() => { this.modificarPuntero(1) }} className={'reader-page ' + estilo[lista[puntero].ESTILO]} key={'img-paginada'} alt='imagen del capítulo' src={lista[puntero].RUTA} />
                    </div>


                    <div className='reader-button'>
                        <ReaderButton onClick={() => { this.modificarPuntero(0) }} className='reader-left-Button' current='Anterior' />
                        <ReaderButton onClick={() => { this.modificarPuntero(1) }} className='reader-right-Button' current='Siguiente' />
                    </div>
                </div>

            ]
        }

    }

    //TODO Cambio de vista ha de ser un nuevo componente
    render() {

        const { listPages, reader, estilo, styleManga, puntero, dobles, listChapters, chapter } = this.state

        if (listPages === null) { return null }
        if (styleManga === null) { return null }

        return (
            <div className={reader + ' border-reader'}>
                <div className='reader-control-tipe'>
                    <ReaderButton onClick={() => { this.devolverReader(0, 1, 0, 0) }} className={'reader-control-tipe-Button ' + (reader==='paginada' && 'select-o') } current='P' />
                    <ReaderButton onClick={() => { this.devolverReader(0, 1, 1, 0) }} className={'reader-control-tipe-Button ' + (reader==='paginada-occidental' && 'select-o') } current='P-D-OC' />
                    <ReaderButton onClick={() => { this.devolverReader(0, 1, 0, 1) }} className={'reader-control-tipe-Button ' + (reader==='paginada-oriental' && 'select-o') } current='P-D-OR' />
                    <ReaderButton onClick={() => { this.devolverReader(1, 0, 0, 0) }} className={'reader-control-tipe-Button ' + (reader==='cascada' && 'select-o') } current='C' />
                    <ReaderButton onClick={() => { this.devolverReader(1, 0, 1, 0) }} className={'reader-control-tipe-Button ' + (reader==='cascada-occidental' && 'select-o') } current='C-D-OC' />
                    <ReaderButton onClick={() => { this.devolverReader(1, 0, 0, 1) }} className={'reader-control-tipe-Button ' + (reader==='cascada-oriental' && 'select-o') } current='C-D-OC' />

                    <div className='reader-control-chapter' >
                        <label>Capítulos: </label>
                        <select id="select-chapter" value={chapter} onChange={(e) => { this.cambiarCapitulo(e) }} >
                            {listChapters.map((item, index) => <option key={item.NUMERO + index + item.ID} value={item.ID}>{item.NUMERO}</option>)}
                        </select>
                    </div>
                </div>
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

                {reader === 'paginada' && (
                    <div>
                        <div className='reader-button'>
                            <ReaderButton onClick={() => { this.modificarPuntero(0) }} className='reader-left-Button' current='Anterior' />
                            <ReaderButton onClick={() => { this.modificarPuntero(1) }} className='reader-right-Button' current='Siguiente' />
                        </div>
                        <div className='reader-grid'>
                            <img onClick={() => { this.modificarPuntero(1) }} className={'reader-page ' + estilo[listPages[puntero].ESTILO]} key={'img-paginada'} alt='imagen del capítulo' src={listPages[puntero].RUTA} />
                        </div>
                        <div className='reader-button'>
                            <ReaderButton onClick={() => { this.modificarPuntero(0) }} className='reader-left-Button' current='Anterior' />
                            <ReaderButton onClick={() => { this.modificarPuntero(1) }} className='reader-right-Button' current='Siguiente' />
                        </div>
                    </div>

                )}
                {reader === 'paginada-occidental' && (this.devolverPaginadoDoble(listPages, dobles, estilo))}
                {reader === 'paginada-oriental' && (this.devolverPaginadoDoble(styleManga, dobles, estilo))}
                
                <div className='reader-control-chapter' >
                        <label>Capítulos: </label>
                        <select id="select-chapter" value={chapter} onChange={(e) => { this.cambiarCapitulo(e) }} >
                            {listChapters.map((item, index) => <option key={item.NUMERO + index + item.ID} value={item.ID}>{item.NUMERO}</option>)}
                        </select>
                </div>
            </div>

        );
    }
}

// Componente usado para mostrar el siguiente elemento a mostrar
const ReaderButton = props => {
    return (
        <div
            className={props.className}
            onClick={props.onClick}
        >
            <div className="inner-container">
                {props.current}
            </div>
        </div>
    );
};