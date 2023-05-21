import axiosSilent from "../axios-silent";
import {getToken} from "../../configs/auth.config";
import {toast} from "react-toastify";
const silentInterceptor = () => {
    axiosSilent.interceptors.request.use(function (config) {
        config.headers = {
            ...config.headers,
            Authorization : getToken() ? `Bearer ${getToken()}` : '',
            'Access-Control-Allow-Origin': 'https://api.treo.az',
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

// Add a response interceptors
    axiosSilent.interceptors.response.use(function (response) {
        toast.dismiss()

        if (response.data){
            if (response.data?.statusCode!==200){
                return Promise.reject(response.data.errors)
            }
        }


        return response.data?.response;
    }, function (error) {
        toast.dismiss()
        return Promise.reject(error);
    });
}

export default silentInterceptor
