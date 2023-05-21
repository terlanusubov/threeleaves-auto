import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import css from './main.module.scss'
import Header from "./components/header";
import MobileNav from "../../shared/mobile-nav";
import {useDispatch, useSelector} from "react-redux";
import {getUserData} from "../../configs/auth.config";
import {checkLogin, setUserData} from "../../../store/actions/auth-actions";
import Loading from "../../shared/loading";
import { getNotificationCount, setContentScroll, setLoader, setScreen } from "../../../store/actions/public-actions";
import debounce from "lodash.debounce";
import Router from "next/router";
import {getProfile} from "../../../store/actions/profile-actions";

function MainLayout({children}) {
    const loading = useSelector(({publicState}) => publicState.loading)
    const dispatch = useDispatch()
    const layoutContentRef = useRef()
    const profile = useSelector(({profile}) => profile.profile)

    const adCategory = useMemo(() => {
        return profile?.adCategoryId
    }, [profile])

    const checkScreen = (size) => {
        let current = 1200
        if (size < 1200) {
            current = 992
        }
        if (size < 992) {
            current = 768
        }
        if (size < 768) {
            current = 576
        }
        dispatch(setScreen(current))
        return current
    }
    const breakPoints = {
        1200: {
            count: 7,
        },
        768: {
            count: 5,
        },
        992: {
            count: 5,
        },
        576: {
            count: 3,
        }
    }
    useEffect(() => {
        checkScreen(document.body.offsetWidth)
        window.addEventListener('resize', (e) => {
            checkScreen(e.target.innerWidth)
        })
    }, [])

    useEffect(() => {
        dispatch(getNotificationCount())
    }, [dispatch])

    const initiateUser = useCallback(async () => {
        try {
            await dispatch(checkLogin())
            if (getUserData()) {
                dispatch(getProfile())

                const userData = {...getUserData()}
                dispatch(setUserData(userData))
            }
        }
        catch (e) {
            console.log(e)
        }
    }, [])
    useEffect(() => {
        initiateUser()
        window.addEventListener('scroll', onContentScroll)

        Router.events.on('routeChangeStart', loadingOn)
        Router.events.on('routeChangeComplete', loadingOff)
        Router.events.on('routeChangeError', loadingOff)
        return () => {
            Router.events.off('routeChangeStart', loadingOn)
            Router.events.off('routeChangeComplete', loadingOff)
            Router.events.off('routeChangeError', loadingOff)

            window.removeEventListener('scroll', onContentScroll)

        }
    }, [])
    useEffect(() => {
        if (getUserData() && profile){
            const userData = {...getUserData(), image : profile.avatar}
            dispatch(setUserData(userData))
        }
    }, [profile])

    const loadingOn = () => {
        dispatch(setLoader(true))
        dispatch(setContentScroll(0))
    }

    const onContentScroll = debounce(() => {
        dispatch(setContentScroll(window.scrollY))
    }, 0)

    const loadingOff = () => {
        dispatch(setLoader(false))
    }

    return (
        <div className={css.wrapper}>
            {loading ? <Loading/> : null}
            <Header/>
            <div ref={layoutContentRef} className="layout-content">
                {children}
            </div>
            <MobileNav/>
        </div>
    );
}

export default MainLayout;
