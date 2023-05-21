import axios from 'axios'

const serverInstance = axios.create({
    baseURL:'https://api.treo.az/api',
    withCredentials: true,
});


export default serverInstance;
