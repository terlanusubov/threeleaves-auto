import axios from 'axios'

const instance = axios.create({
    baseURL:'https://api.treo.az/api',
    withCredentials: true,
});


export default instance;
