import {PublicTypes} from "./types/public-types";
import * as services from "../../services";

export const setLoader = (val)=>({
    type : PublicTypes.SET_LOADER,
    payload : val
})

export const toggleSearchbar = (val)=>({
    type : PublicTypes.TOGGLE_SEARCHBAR,
    payload : val
})

export const toggleSearchbarBackdrop = (val)=>({
    type : PublicTypes.TOGGLE_SEARCHBAR_BACKDROP,
    payload : val
})

export const setContentScroll = (val)=>({
    type : PublicTypes.SET_SCROLL,
    payload : val
})
export const setScreen = (val)=>({
    type : PublicTypes.SET_SCREEN,
    payload : val
})
export const getNotificationCountSuccess = (val)=>({
    type : PublicTypes.SET_NOTIFICATION_COUNT,
    payload : val
})

export const getNotificationCount = ()=>(dispatch)=>{
    return services.getNotificationCount()
      .then(res=>{
          dispatch(getNotificationCountSuccess(res))
          return Promise.resolve(res)
      })
      .catch(err=>{
          return Promise.resolve(err)
      })
}
