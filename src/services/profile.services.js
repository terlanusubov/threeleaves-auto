import axios from "../core/axios/axios";
import {API} from "../core/configs/api.config";
import axiosServer from "../core/axios/axios-server";
import axiosSilent from "../core/axios/axios-silent";

export const getFavorites = (sort) => (
    axios.get(
        API().user.wishlist,
        {
            params : {sortById : sort}
        }
    )
)
export const getMyListings = () => (
    axios.get(
        API().user.ads
    )
)
export const addToFav = (adId) => (
    axiosSilent.post(
        API().user.wishlist,
        {
            adId
        }
    )
)

export const getProfile = () => (
    axios.get(
        API().user.profile
    )
)

export const getWorkDays = () => (
    axiosServer.get(
        API().user.workdays
    )
)

export const getAgencyById = (id) => (
    axiosServer.get(
        API(id).user.agencyDetails
    )
)

export const updateProfile = (formData) => (
    axios.put(
        API().user.profile,
        formData
    )
)