import {EditListingTypes} from "./types/edit-listing-types";
import Router from "next/router";
import * as services from '../../services/publish.services'
import * as publicServices from '../../services'
import {successToast} from "../../core/shared/toast";
import {editCar} from "../../services/publish.services";
export const changeEditStep = (id, value)=>({
    type : EditListingTypes.CHANGE_STEP,
    payload : {id, value}
})

export const setFeaturesEdit = (payload)=>({
    type : EditListingTypes.FEATURES_SELECT,
    payload
})

export const setPartsEdit = (payload)=>({
    type : EditListingTypes.CONDITION_SELECT,
    payload
})

export const setImagesEdit = (payload)=>({
    type : EditListingTypes.IMAGES_SELECT,
    payload
})

export const setNoteEdit = (payload)=>({
    type : EditListingTypes.NOTE_SELECT,
    payload
})

export const setLocationEdit = (payload)=>({
    type : EditListingTypes.LOCATION_SELECT,
    payload
})

export const finishSuccessEdit = (payload)=>({
    type : EditListingTypes.FINISH_ADD,
    payload
})

export const resetEdit = ()=>({
    type : EditListingTypes.RESET_STEPS,
})

export const featuresSelectEdit = (value, routeId)=>(dispatch)=>{
    dispatch(changeEditStep(0, value))
    dispatch(setFeaturesEdit(value))
    Router.push('/edit-listing/'+routeId+'/condition')
}

export const partsSelectEdit = (value, routeId)=>(dispatch)=>{
    dispatch(changeEditStep(1, value))
    dispatch(setPartsEdit(value))
    Router.push('/edit-listing/'+routeId+'/images')
}

export const imagesSelectEdit = (value, routeId)=>(dispatch)=>{
    dispatch(changeEditStep(2, value))
    dispatch(setImagesEdit(value))
    Router.push('/edit-listing/'+routeId+'/notes')
}
export const noteSelectEdit = (value, routeId)=>(dispatch)=>{
    dispatch(changeEditStep(3, value))
    dispatch(setNoteEdit(value))
    Router.push('/edit-listing/'+routeId+'/location')
}

export const locationSelectEdit = (value, routeId)=>(dispatch)=>{
    dispatch(changeEditStep(4, value))
    dispatch(setLocationEdit(value))
    Router.push('/edit-listing/'+routeId+'/finish')
}

export const finishEdit = (value, routeId)=>(dispatch)=>{
    dispatch(changeEditStep(5, value))
    dispatch(finishSuccessEdit(value))
    // Router.push('/publish/finish')
}

export const editAd = (payload)=>(dispatch)=>{
    return services.editCar(payload)
        .then(res=>{
            successToast('Uğurlu əməliyyat', ()=>{Router.replace('https://user.treo.az/profile/my-listings')})
            return Promise.resolve(res)
        })
        .catch(err=>{
            return Promise.reject(err)
        })
}

export const resetEditData = ()=>(dispatch)=>{
    dispatch(resetEdit())
    Router.push('/edit-listing')
}

export const fetchValuesSuccess = (data)=>({
    type : EditListingTypes.FETCH_VALUES,
    payload : data
})

export const fetchValues = (params, fetched)=>(dispatch)=>{
    if (!fetched){
        return publicServices.getCarDetails(params)
            .then(res=>{
                dispatch(fetchValuesSuccess(res.auto))
                return Promise.resolve(res)
            })
            .catch(err=>{
                Router.replace('/404')
                return Promise.reject(err)
            })
    }
}
