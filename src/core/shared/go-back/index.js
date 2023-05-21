import React, {useEffect} from 'react';
import css from './go-back.module.scss'
import goBack from '../../../assets/images/go-back.svg'
import Image from "next/image";
import {useRouter} from "next/router";
function GoBack({onClick}) {
    const router = useRouter()
    const handleClick = ()=>{
        if (onClick){
            onClick()
        }
        else router.back()
    }
    return (
        <div className={css.goBack} onClick={handleClick}>
            <div className={css.goBack__icon}>
                <Image src={goBack}/>
            </div>
            <span>
                Geriyə
            </span>
        </div>
    );
}

export default GoBack;