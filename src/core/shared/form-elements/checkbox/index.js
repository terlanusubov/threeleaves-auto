import React from 'react';

function Checkbox({id, label, checked, size = '', classes = '', change, hasColor, hex, color}) {
    return (
        <label htmlFor={id + label} className={`custom-checkbox  ${size!=='' ? `custom-checkbox--${size}` : ''} ${classes}`}>
            <input onChange={(e)=>{
                change(e.target.checked)
            }} type="checkbox" id={id + label} checked={checked}/>
            {
                hasColor ?<span className={`colorTag mr-10 ${hex[0] === 'h' ? 'colorTag--no-border' : ''}`} style={{background : hex[0] === 'h' ? `url(${hex})` : hex}}></span> : null
            }
            {label}
            <span className={`custom-checkmark ${color ? 'custom-checkmark--'+color : ''}  ${size!=='' ? `custom-checkmark--${size}` : ''}`}></span>
        </label>
    );
}

export default Checkbox;
