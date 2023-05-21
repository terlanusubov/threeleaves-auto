import React from 'react';
import css from './card.module.scss'
function Card(props) {
    const {classes='', children, padding} = props
    return (
        <div className={`${padding ? 'p-' + padding : 'p-24'} ${classes} ${css.card}`}>
            {children}
        </div>
    );
}

export default Card;
