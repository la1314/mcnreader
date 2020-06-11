import React, { Component } from 'react';

export default class EditorHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            select: 0,
            clsname: 'select'
        }

    }

    changeSelect = () => {
        if (localStorage.getItem('page')) {
            const n = parseInt(localStorage.getItem('page'));
            this.setState({ select: n })
        }
    }

    render() {

        const { select, clsname } = this.state;

        return (
            <div className='header-app'>
                <div className='menu-logo'>
                    <img alt='logo de la página' onClick={() => Promise.resolve(this.props.changePage(0)).then(() => { this.changeSelect() })} src={'https://tuinki.gupoe.com/media/app-images/logo.png'} />
                </div>
                <div className='menu-item-container'>
                    <MenuItem className={`menu-item ` + (select === 0 && clsname)} nameItem='Gestor' onClick={() => Promise.resolve(this.props.changePage(0)).then(() => { this.changeSelect() })} />
                    <MenuItem className={'menu-item ' + (select === 1 && clsname)} nameItem='Biblioteca' onClick={() => Promise.resolve(this.props.changePage(1)).then(() => { this.changeSelect() })} />
                    <MenuItem className={'menu-item ' + (select === 2 && clsname)} nameItem='Perfil' onClick={() => Promise.resolve(this.props.changePage(2)).then(() => { this.changeSelect() })} />
                    <MenuItem className="menu-item-logout" nameItem='' onClick={() => this.props.logout()} />
                </div>

            </div>
        );
    }
}

const MenuItem = props => {
    return (
        <div
            className={props.className}
            onClick={props.onClick}
        >
            <div className="'menu-item-text'">{props.nameItem}</div>
        </div>
    );
};