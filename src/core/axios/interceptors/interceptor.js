import axios from "../axios";
import {getToken} from "../../configs/auth.config";
import store from "../../../store";
import {setLoader} from "../../../store/actions/public-actions";
import Swal from "sweetalert2";
import {errorToast} from "../../shared/toast";
import {toast} from "react-toastify";
import Router from "next/router";
import {logout} from "../../../store/actions/auth-actions";
const interceptor = () => {
    axios.interceptors.request.use(function (config) {
        store.dispatch(setLoader(true))

        config.headers = {
            ...config.headers,
            Authorization : getToken() ? `Bearer ${getToken()}` : '',
            // Authorization : '',
            'Access-Control-Allow-Origin': 'https://api-3yarpaq.tk',
            // 'Set-Cookie' : cookie
        }
        return config;
    }, function (error) {
        store.dispatch(setLoader(true))

        // Do something with request error
        return Promise.reject(error);
    });

// Add a response interceptors
    axios.interceptors.response.use(function (response) {
        store.dispatch(setLoader(false))

        if (response.data){
            if (response.data?.statusCode!==200){
                switch (response.data.statusCode) {
                    case 401:
                        // errorToast('Sessiya müddəti bitmişdir!')
                        // history.replace('/auth/login')
                        // localStorage.removeItem('auth-token');
                        // sessionStorage.removeItem('auth-token');
                        // localStorage.removeItem('auth-user');
                        // sessionStorage.removeItem('auth-user');
                        store.dispatch(logout())
                        break;
                    case 422:
                        errorToast(response.data.errors?.ErrorText)
                        break;
                    case 404:
                        Router.push('/404')
                        break;
                    case 500:
                        errorToast(response.data.errors?.ErrorText)
                        break;
                    case 400:
                        errorToast(response.data.errors?.ErrorText)
                        break;
                    default :
                        errorToast(response.data.errors?.ErrorText)
                        break;
                }
                return Promise.reject(response.data.errors)
            }
        }


        return response.data?.response;
    }, function (error) {
        toast.dismiss()
        store.dispatch(setLoader(false))
        errorToast(error)


        return Promise.reject(error);
    });
}

export default interceptor
