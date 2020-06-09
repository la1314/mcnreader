import React, { Component } from 'react';

export default class EditorHeader extends Component {

    render() {
        return (
            <div className='header-app'>
                <div className='menu-item-container'>
                    <MenuItem className='menu-item' nameItem='Gestor' onClick={() => this.props.changePage(0)} />
                    <MenuItem className='menu-item' nameItem='Biblioteca' onClick={() => this.props.changePage(1)} />
                    <MenuItem className='menu-item' nameItem='Perfil' onClick={() => this.props.changePage(2)} />
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