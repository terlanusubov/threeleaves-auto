import {API} from "../core/configs/api.config";
import axios from "../core/axios/axios";
import axiosServer from "../core/axios/axios-server";
import axiosSilent from "../core/axios/axios-silent";

export const getPlans = (categoryId)=> axios.get(API(categoryId).subscription.plans)
export const getAdditionalPlans = (categoryId)=> axios.get(API(categoryId).subscription.plans, {params : {user: true}})
export const onSubscribe = (data)=> axios.post(API().subscription.subscribe, data)
export const checkTransaction = (transactionId)=> axiosSilent.get(API(transactionId).subscription.checkStatus)
export const postCar = (payload) => axios.post(API().ads.auto, payload)
export const editCar = (payload) => axios.put(API().ads.auto, payload)
