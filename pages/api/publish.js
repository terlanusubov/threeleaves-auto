import axios from "axios";
import axiosServer from "../../src/core/axios/axios-server";
import {API} from "../../src/core/configs/api.config";
export default function publishHandler(req, res) {
    if (req.method === 'POST') {
        axiosServer.post(API().subscription.approve, req.body)
            .then(response => {
                console.log(response.data.response)
                res.json(null)
            })
            .catch(error => {
                res.json(null)
            })
    }
    else {
        res.status(404).json({message: 'Not found'})
    }
}
