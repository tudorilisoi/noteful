import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import "./App.css";
const Header = () => {
    return (
            <header>
                <Link to='/'>
                <h1>Noteful</h1>
                </Link>
            </header>
        
    )
}
Header.propTypes = {
    name: PropTypes.string
}
export default Header