import React, {useEffect, useState} from 'react';
import css from './auto.module.scss'
import Blur from "../../shared/blur";
import GrayBackdrop from "../../shared/gray-backdrop";
import {useDispatch, useSelector} from "react-redux";
import Card from "../../shared/card";
import {generateGuid} from "../../helpers/common-functions";
import checkIcon from '../../../assets/images/check.svg'
import checkFillIcon from '../../../assets/images/check-fill.svg'
import Image from "next/image";
import subuwu from "../../../assets/images/brands/subuwu.png";
import posts from '../../../assets/images/profile-menu/posts.svg'
import letter from '../../../assets/images/profile-menu/letter.svg'
import heart from '../../../assets/images/fav.svg'
import settings from '../../../assets/images/profile-menu/settings.svg'
import logoutIcon from '../../../assets/images/profile-menu/logout.svg'

import postsActive from '../../../assets/images/profile-menu/posts-active.svg'
import letterActive from '../../../assets/images/profile-menu/letter-active.svg'
import settingsActive from '../../../assets/images/profile-menu/settings-active.svg'
import {getUserData} from "../../configs/auth.config";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import NavLink from "../../shared/nav-link";
import {logout} from "../../../store/actions/auth-actions";

function AutoLayout(props) {
    const {children} = props
    const router = useRouter()
    const dispatch = useDispatch()
    //REDUX
    const searchFocused = useSelector(({publicState}) => publicState.searchFocused)
    //STATE


    return (
        <div className={`position-relative page-content pt-40 pt-md-30`}>
            {
                searchFocused ? <Blur/> : null
            }
            <GrayBackdrop/>
            {children}

        </div>
    );
}

export default AutoLayout;
