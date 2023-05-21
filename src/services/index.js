import {API} from "../core/configs/api.config";
import axiosServer from "../core/axios/axios-server";
import axios from "../core/axios/axios";
import axiosSilent from "../core/axios/axios-silent";

export const getCarList = (params) => (
    axiosServer.get(API().ads.auto, {params})
)

export const getCarDetails = (id, ip) => (
    axiosServer.get(API(id).ads.autoDetails, {headers: {clientIp: ip || null}})
)
export const getCarDetailsClient = (id) => (
    axios.get(API(id).ads.autoDetails)
)
export const getCarListClient = (params) => (
    axios.get(API().ads.auto, {params})
)

export const getFilters = () => axiosServer.get(API().ads.filters)

export const getModels = (id, isPopular) => axiosServer.get(API(id).ads.models, {params : {popular : isPopular}})

export const getParts = (id) => axiosServer.get(API(id).ads.parts)

export const getFilterCount = (params)=>axiosSilent.get(API().ads.filterCount, {params})

export const generalSearch = (brand) => axiosSilent.get(API().ads.search, {params : {brand}})

export const postComplaint = (data) => axios.post(API().ads.complaint, data)
export const getNotificationCount = () => axiosSilent.get(API().user.notificationCount)
