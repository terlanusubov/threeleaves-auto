import {PublishTypes} from "./types/publish-types";
import Router from "next/router";
import * as services from '../../services/publish.services'
import Swal from "sweetalert2";
import {successToast} from "../../core/shared/toast";
import {recursiveLister} from "../../core/helpers/common-functions";
export const changeStep = (id, value)=>({
    type : PublishTypes.CHANGE_STEP,
    payload : {id, value}
})

export const setBrand = (brand)=>({
    type : PublishTypes.BRAND_SELECT,
    payload: brand
})
export const setModel = (model)=>({
    type : PublishTypes.MODEL_SELECT,
    payload: model
})

export const setExterior = (payload)=>({
    type : PublishTypes.EXTERIOR_SELECT,
    payload
})

export const setSpecs = (payload)=>({
    type : PublishTypes.SPECS_SELECT,
    payload
})

export const setFeatures = (payload)=>({
    type : PublishTypes.FEATURES_SELECT,
    payload
})

export const setParts = (payload)=>({
    type : PublishTypes.CONDITION_SELECT,
    payload
})

export const setImages = (payload)=>({
    type : PublishTypes.IMAGES_SELECT,
    payload
})

export const setNote = (payload)=>({
    type : PublishTypes.NOTE_SELECT,
    payload
})

export const setLocation = (payload)=>({
    type : PublishTypes.LOCATION_SELECT,
    payload
})

export const finishSuccess = (payload)=>({
    type : PublishTypes.FINISH_ADD,
    payload
})

export const reset = ()=>({
    type : PublishTypes.RESET_STEPS,
})
export const brandSelect = (value)=>(dispatch)=>{
    dispatch(changeStep(0, value))
    dispatch(setBrand(value))
    Router.push('/publish/model?brandId='+value.id)
}
export const modelSelect = (value)=>(dispatch)=>{
    dispatch(changeStep(1, value))
    dispatch(setModel(value))
    Router.push('/publish/exterior')
}

export const exteriorSelect = (value)=>(dispatch)=>{
    dispatch(changeStep(2, value))
    dispatch(setExterior(value))
    Router.push('/publish/specs')
}

export const specsSelect = (value)=>(dispatch)=>{
    dispatch(changeStep(3, value))
    dispatch(setSpecs(value))
    Router.push('/publish/features')
}

export const featuresSelect = (value)=>(dispatch)=>{
    dispatch(changeStep(4, value))
    dispatch(setFeatures(value))
    Router.push('/publish/condition')
}

export const partsSelect = (value)=>(dispatch)=>{
    dispatch(changeStep(5, value))
    dispatch(setParts(value))
    Router.push('/publish/images')
}

export const imagesSelect = (value)=>(dispatch)=>{
    dispatch(changeStep(6, value))
    dispatch(setImages(value))
    Router.push('/publish/notes')
}
export const noteSelect = (value)=>(dispatch)=>{
    dispatch(changeStep(7, value))
    dispatch(setNote(value))
    Router.push('/publish/location')
}

export const locationSelect = (value)=>(dispatch)=>{
    dispatch(changeStep(8, value))
    dispatch(setLocation(value))
    Router.push('/publish/finish')
}

export const finishAdd = (value)=>(dispatch)=>{
    dispatch(changeStep(9, value))
    dispatch(finishSuccess(value))
    // Router.push('/publish/finish')
}

export const postAd = (payload)=>(dispatch)=>{
    return services.postCar(payload)
        .then(res=>{
            successToast('Uğurlu əməliyyat', ()=>{Router.replace('https://user.treo.az/profile/my-listings')})
            return Promise.resolve(res)
        })
        .catch(err=>{
            return Promise.reject(err)
        })
}

export const resetPublish = ()=>(dispatch)=>{
    dispatch(reset())
    Router.push('/publish')
}

export const getPlansSuccess = (payload)=>({
    type : PublishTypes.GET_PLANS,
    payload
})

export const getAdditionalPlansSuccess = (payload)=>({
    type : PublishTypes.GET_ADDITIONAL_PLANS,
    payload
})

export const getPlans = (categoryId)=>(dispatch)=>{
    return services.getPlans(categoryId)
        .then(res=>{
            dispatch(getPlansSuccess(res.plans))
            return Promise.resolve(res.plans)
        })
        .catch(err=>{
            return Promise.reject(err)
        })
}
export const getAdditionalPlans = (categoryId)=>(dispatch)=>{
    return services.getAdditionalPlans(categoryId)
        .then(res=>{
            dispatch(getAdditionalPlansSuccess(recursiveLister(res.plans, 'parentId', null)))
            return Promise.resolve(res.plans)
        })
        .catch(err=>{
            return Promise.reject(err)
        })
}

export const onSubscribe = (data)=>(dispatch)=>{
    return services.onSubscribe(data)
        .then(res=>{
            return Promise.resolve(res.paymentUrl)
        })
        .catch(err=>{
            return Promise.reject(err)
        })
}
export const checkTransaction = (transactionId)=>(dispatch)=>{
    return services.checkTransaction(transactionId)
        .then(res=>{
            return Promise.resolve(res)
        })
        .catch(err=>{
            return Promise.reject(err)
        })
}
