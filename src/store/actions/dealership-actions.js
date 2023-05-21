import {DealershipTypes} from "./types/dealership-types";
import * as services from "../../services/dealership.services";
import {HomeTypes} from "./types/home-types";

export const getAgenciesSuccess = (data)=>({
    type : DealershipTypes.GET_AGENCIES,
    payload : data
})


export const getAgencies = (params)=>(dispatch)=>{
    return services.getAgencies(params)
        .then(res=>{
            dispatch(getAgenciesSuccess(res.agencies))
            return Promise.resolve(res.agencies)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}

export const getAgencyListingsSuccess = (data)=>({
    type : DealershipTypes.GET_AGENCY_LISTINGS,
    payload : data
})


export const getAgencyListings = (id, page)=>(dispatch)=>{
    return services.getAgencyListings(id, page)
        .then(res=>{
            dispatch(getAgencyListingsSuccess(res.autoAds))
            return Promise.resolve(res.autoAds)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}

export const resetDealers = ()=>({
    type : DealershipTypes.RESET_DEALERS
})
