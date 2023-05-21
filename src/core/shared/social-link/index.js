import React from 'react';
import css from './social-link.module.scss'
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
function SocialLink(props) {
    const {data} = props
    return (
        <Link href={data.url}>
            <a>
                <div className={`${css.social} ${css[data.bg]} d-flex justify-center align-center`}>
                    <FontAwesomeIcon className={`${css.social__icon} white-txt`} icon={['fab', data.icon]}/>
                </div>
            </a>
        </Link>
    );
}

export default SocialLink;
