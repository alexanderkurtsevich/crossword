import React from 'react';
import './Header.scss';
import { TEXT } from '../constants'

const Header = (props) => {

    return (
        <header className={`${props.className} header`}>
            <h1 className="header__heading">{TEXT.HEADER}</h1>
        </header>
    )
}
export default Header;