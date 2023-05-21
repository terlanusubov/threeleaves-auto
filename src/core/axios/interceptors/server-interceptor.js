import axiosServer from "../axios-server";

const serverInterceptor = () => {
    axiosServer.interceptors.request.use(function (config) {
        config.headers = {
            ...config.headers,
            'Access-Control-Allow-Origin': 'https://api-3yarpaq.tk',

            // 'Set-Cookie': cookie
        }
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });

    axiosServer.interceptors.response.use(function (response) {
        return response.data.response;
    }, function (error) {
        return Promise.reject(error);
    });
}

export default serverInterceptor
