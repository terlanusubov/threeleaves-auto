import {HomeTypes} from "./types/home-types";
import * as services from '../../services/index'
import {getCarDetailsClient} from "../../services/index";
// HOME
export const addTag = (tag)=>(
    {
        type : HomeTypes.ADD_TAG,
        payload : tag
    }
)

export const removeTag = (id)=>({
    type: HomeTypes.REMOVE_TAG,
    payload: id
})

export const resetTags = ()=>({
    type : HomeTypes.RESET_TAGS
})

export const getFilterCountSuccess = (payload)=>({
    type : HomeTypes.GET_FILTER_COUNT,
    payload
})

export const getModelsSuccess = (payload)=>({
    type : HomeTypes.GET_MODELS,
    payload
})

export const getPopularModelsSuccess = (payload)=>({
    type : HomeTypes.GET_MODELS,
    payload
})

export const getLatestListSuccess = (payload)=>({
    type : HomeTypes.GET_LATEST_SUCCESS,
    payload
})

export const getPlatinumListSuccess = (payload)=>({
    type : HomeTypes.GET_PLATINUM_SUCCESS,
    payload
})

export const getUrgentListSuccess = (payload)=>({
    type : HomeTypes.GET_URGENT_SUCCESS,
    payload
})

export const getSearchResultSuccess = (payload)=>({
    type : HomeTypes.GET_SEARCH_RESULT_SUCCESS,
    payload
})

export const getSimilarResultsSuccess = (payload)=>({
    type : HomeTypes.GET_SIMILAR_SUCCESS,
    payload
})

export const getSearchResultFilterSuccess = (payload)=>({
    type : HomeTypes.GET_SEARCH_RESULT_FILTER_SUCCESS,
    payload
})

export const getUrgentListingsFilterSuccess = (payload)=>({
    type : HomeTypes.GET_URGENT_LISTINGS_FILTER_SUCCESS,
    payload
})
export const getPlatListingsFilterSuccess = (payload)=>({
    type : HomeTypes.GET_PLAT_LISTINGS_FILTER_SUCCESS,
    payload
})

export const getLatestList = (params)=>(dispatch)=>{
    return services.getCarListClient({...params, AdTypeId : 30})
        .then(res=>{
            dispatch(getLatestListSuccess(res.ads))
            return Promise.resolve(res.ads)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}

export const getPlatinumList = (params)=>(dispatch)=>{
    return services.getCarListClient({...params, AdTypeId : 10})
        .then(res=>{
            dispatch(getPlatinumListSuccess(res.ads))
            return Promise.resolve(res.ads)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}

export const getUrgentList = (params)=>(dispatch)=>{
    return services.getCarListClient({...params, AdTypeId : 20})
        .then(res=>{
            dispatch(getUrgentListSuccess(res.ads))
            return Promise.resolve(res.ads)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}

export const getSearchResult = (params)=>(dispatch)=>{
    return services.getCarListClient({...params})
        .then(res=>{
            dispatch(getSearchResultSuccess(res.ads))
            return Promise.resolve(res.ads)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}

export const getSearchResultFilter = (params)=>(dispatch)=>{
    return services.getCarListClient({...params})
        .then(res=>{
            dispatch(getSearchResultFilterSuccess(res.ads))
            return Promise.resolve(res.ads)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}

export const getUrgentListingsFilter = (params)=>(dispatch)=> {
  return services.getCarListClient({...params, AdTypeId : 20})
        .then(res=>{
            dispatch(getUrgentListingsFilterSuccess(res.ads))
            return Promise.resolve(res.ads)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}
export const getPlatListingsFilter = (params)=>(dispatch)=> {
  return services.getCarListClient({...params, AdTypeId : 10})
        .then(res=>{
            dispatch(getPlatListingsFilterSuccess(res.ads))
            return Promise.resolve(res.ads)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}

export const getSimilarResults = (params)=>(dispatch)=>{
    return services.getCarListClient({...params})
        .then(res=>{
            dispatch(getSimilarResultsSuccess(res.ads))
            return Promise.resolve(res.ads)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}

export const getFilterCount = (params)=>(dispatch)=>{
    return services.getFilterCount(params)
        .then(res=>{
            dispatch(getFilterCountSuccess(res.count))
            return Promise.resolve(res.count)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}
export const getModels = (id, isPopular)=>(dispatch)=>{
    return services.getModels(id, isPopular)
        .then(res=>{
            isPopular ? getPopularModelsSuccess(res.models) : dispatch(getModelsSuccess(res.models))
            return Promise.resolve(res.models)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}

export const resetLists = ()=>({
    type : HomeTypes.RESET_LISTS
})


export const getAutoDetailsSuccess = (payload)=>({
    type : HomeTypes.GET_AUTO_DETAILS_SUCCESS,
    payload
})

export const getAutoDetails = (id)=>(dispatch)=>{
    return services.getCarDetailsClient(id)
        .then(res=>{
            dispatch(getAutoDetailsSuccess(res.auto))
            return Promise.resolve(res.auto)
        })
        .catch(err=>{
            return Promise.resolve(err)
        })
}
