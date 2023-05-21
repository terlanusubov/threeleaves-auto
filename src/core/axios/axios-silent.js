import axios from 'axios'

const silentInstance = axios.create({
    baseURL:'https://api.treo.az/api',
    withCredentials: true,
});


export default silentInstance;
