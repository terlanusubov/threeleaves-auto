import React from 'react';
import Link from "next/link";
function Button(props) {
    const {classes='', children, disabled, isLink, href, type, color = 'primary', inverted = false, click = ()=>false} = props
    return (
        <>
        {
            isLink ?
                <Link href={href}>
                    <a className={`custom-btn p-20 ${color ? `custom-btn--${color}` : ''} ${inverted ? `custom-btn--outline-${color}` : ''} ${classes}`}>
                        {children}
                    </a>
                </Link >
                :
                <button type={type}
                        className={`custom-btn p-20 ${color ? `custom-btn--${color}` : ''} ${inverted ? `custom-btn--outline-${color}` : ''} ${classes}`}
                        onClick={(e)=>{click(e)}}
                        disabled={disabled}
                >
                    {children}
                </button>
        }
        </>
    );
}

export default Button;
