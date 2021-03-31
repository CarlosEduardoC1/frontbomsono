import axios from 'axios';
import https from 'https';

let token = sessionStorage.getItem('user/Token');

const api = axios.create({
    baseURL: `https://serverbomsono.herokuapp.com`,
    headers: {
        "Authorization": "Bearer " + token,
        "Access-Control-Allow-Origin": "*",
    },
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

export default api;