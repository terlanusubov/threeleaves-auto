import MainLayout from "../src/core/layouts/main";
import 'light-grid/index.scss'
import '../src/assets/styles/global.scss'
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'
import {Provider, useDispatch, useSelector} from "react-redux";
import store from '../src/store/index'
import {SWRConfig} from "swr";
import axios from "../src/core/axios/axios";
import interceptor from "../src/core/axios/interceptors/interceptor";
import serverInterceptor from "../src/core/axios/interceptors/server-interceptor";
import Router from "next/router";
import {useEffect, useState} from "react";
import {setLoader} from "../src/store/actions/public-actions";
import {ToastContainer} from "react-toastify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'swiper/css'
import SwiperCore, {Keyboard} from 'swiper'
import * as services from "../src/services";
import silentInterceptor from "../src/core/axios/interceptors/silent-interceptor";
SwiperCore.use([Keyboard])
library.add(fas, far, fab)
interceptor()
serverInterceptor()
silentInterceptor()
Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};
function MyApp({Component, pageProps}) {

    return (
        <Provider store={store}>
            <SWRConfig value={
                {
                    fetcher: (url, config = {}) => {
                        return (axios.get(url, config).then(res => res.data).catch(err => err))
                    }
                }
            }>
                <MainLayout>
                    <Component {...pageProps} />
                    <ToastContainer/>
                </MainLayout>
            </SWRConfig>
        </Provider>

    )
}

export default MyApp
