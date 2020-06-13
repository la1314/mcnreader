import React, { useState, useRef } from 'react';
import {Overlay, Tooltip } from 'react-bootstrap';
import logo from '../images/info.png';

function ToolTip(props) {
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const {mensaje} = props

    return (

        <>
            <img className='info-img' alt='icono de información' src={logo} ref={target} onClick={() => setShow(!show)}/>
            <Overlay target={target.current} show={show} placement="right">
                {(props) => (
                    <Tooltip  id="overlay" {...props}>
                        {mensaje}
                    </Tooltip>
                )}
            </Overlay>
        </>
    );
}

export default ToolTip;