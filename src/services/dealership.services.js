import axios from "../core/axios/axios";
import {API} from "../core/configs/api.config";
import axiosServer from "../core/axios/axios-server";

export const getAgencies = (params) => (
    axios.get(
        API().user.agencies,
        {
            params : {...params, adCategoryId : 10}
        }
    )
)

export const getAgencyListings = (id, page) => (
    axiosServer.get(
        API(id).user.agencyListings,
        {
            params : {page}
        }
    )
)
