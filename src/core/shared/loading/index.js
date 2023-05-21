import React from 'react';
import spinner from '../../../assets/images/spinner.svg'
import css from './loading.module.scss'
import Image from "next/image";
function Loading(props) {
    return (
        <div className={css.loading}>
            <div className={css.loading__spinner}>
                <Image src={spinner}/>
            </div>
        </div>
    );
}

export default Loading;