import React from 'react';
import Image from "next/image";
import x from "../../../assets/images/x.svg";
import {useDispatch} from "react-redux";
import {resetPublish} from "../../../store/actions/publish-actions";
import css from './index.module.scss'
function ResetPublishBtn(props) {
    const dispatch = useDispatch()
    const click = ()=>{
        dispatch(resetPublish())
    }
    return (
        <div onClick={click} className={`${css.reset} d-flex justify-center cursor-pointer invisible-md`}>
            <Image src={x}/>
            <span className={'ml-11 gray-txt'}>Sıfırlamaq</span>
        </div>
    );
}

export default ResetPublishBtn;
