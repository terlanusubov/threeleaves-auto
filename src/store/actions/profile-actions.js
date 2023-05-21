import {ProfileTypes} from "./types/profile-types";
import * as services from "../../services/profile.services";

export const getFavSuccess = (data)=>({
    type : ProfileTypes.GET_FAV,
    payload : data
})


export const getFav = (sort)=>(dispatch)=>{
    return services.getFavorites(sort)
        .then(res=>{
            dispatch(getFavSuccess([...res.autoAds.map(item=>({...item, categoryId: 10})), ...res.propertyAds.map(item=>({...item, categoryId: 20}))].sort((a,b)=>+a.userWishlistId - +b.userWishlistId)))
            return Promise.resolve(res.ads)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}

export const getMyListingsSuccess = (data)=>({
    type : ProfileTypes.GET_MY_LISTINGS,
    payload : data
})

export const resetFav = ()=>({
    type : ProfileTypes.RESET_FAV,
})

export const getMyListings = ()=>(dispatch)=>{
    return services.getMyListings()
        .then(res=>{
            dispatch(getMyListingsSuccess(res.advertisements))
            return Promise.resolve(res.advertisements)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}

export const getProfileSuccess = (data)=>({
    type : ProfileTypes.GET_PROFILE,
    payload : data
})


export const getProfile = ()=>(dispatch)=>{
    return services.getProfile()
        .then(res=>{
            dispatch(getProfileSuccess(res))
            return Promise.resolve(res)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}


export const getAgenciesSuccess = (data)=>({
    type : ProfileTypes.GET_PROFILE,
    payload : data
})