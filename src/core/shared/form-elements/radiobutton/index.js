import React from 'react';

function RadioButton({id,name, showLabel = true,value,label, checked = false, size = '', classes = '',square = false, color= 'green'}) {
    return (
        <label htmlFor={id} className={`${square ? 'custom-checkbox' : 'custom-radio'}  ${size!=='' ? `custom-radio--${size}` : ''} ${classes}`}>
            <input defaultChecked={checked} name={name} type="radio" id={id} value={value} />
            <span className={!showLabel ? 'hidden' : ''}>{label}</span>
            <span className={`custom-checkmark ${color ? 'custom-checkmark--'+color : ''} ${size!=='' ? `custom-checkmark--${size}` : ''}`}></span>
        </label>
    );
}

export default RadioButton;
