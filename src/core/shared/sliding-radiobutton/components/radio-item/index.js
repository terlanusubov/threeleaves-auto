import React from 'react';
import css from "./radio-item.module.scss";
function RadioItem({title, isActive}) {
    return (
        <div className="col-4">
            <p className={`${css.radioItem}`}>
                Hamısı
            </p>
        </div>
    );
}

export default RadioItem;
