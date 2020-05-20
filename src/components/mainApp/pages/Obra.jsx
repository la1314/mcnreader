import React, { Component } from 'react';
//import axios from 'axios';

export default class Obra extends Component {

    constructor(props) {
        super(props);
        this.state = {
            obra: this.props.obra
        }
    }

    componentDidMount(){
        //TODO
    }

    /* Funciones que afectan a la Obra */
    //Edita el nombre de la obra
    editName = () => {}

    //Modifica la descripción de la obra
    editDescription = () => {}

    //Edita el Autor de la Obra
    editAutor = () => {}

    //Edita el año de lanzamiento de la Obra
    editLanzamiento = () => {}

    //Añade/Reemplaza el cover actual
    editCover = () => {}

    //Edita el estado actual de la obra
    editEstado = () => {}

    //Edita el tipo actual de la obra
    editTipo = () => {}

    //Edita la visibilidad actual de la obra
    editVisibilidad = () => {}


    /* Funciones que afectan a los Capítulos de la obra */

    //Añade/Elimina un capítulo
    editChapter = () => {}

    //Edita el número de un capítulo
    editNumberChapter = () => {}

    //Edita el nombre de un capítulo
    editNameChapter = () => {}

    //Edita la fecha de un capítulo
    editFechaChapter = () => {}

    //Edita la visibilidad del capítulo de la obra
    editVisibilidadChapter = () => {}

    
    /* Funciones que afectan a las páginas de los capítulos */

     //Añane las paginas a un capítulo
     addChapterPages = () => {}

     //Elimina las paginas de un capítulo
     deleteChapterPages = () => {}

     //Edita el número de una pagina
     editNumberPages = () => {}

    render() {

        return (
            <div>Obra div</div>
        );
    }
}