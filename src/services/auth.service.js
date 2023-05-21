import axios from "../core/axios/axios";
import {API} from "../core/configs/api.config";
import axiosSilent from "../core/axios/axios-silent";

export const login = ({phoneNumber, password}) => (
    axios.post(
        API().auth.login,
        {
            phoneNumber,
            password
        }
    )

)

export const checkToken = () => (
    axiosSilent.get(
        API().auth.checkToken,
        {withCredentials: true}
    )

)

export const signupNum = (phoneNumber) => (
    axios.post(
        API().auth.getOtp,
        {
            phoneNumber,
            register : true
        }
    ))

export const signupOtp = (phoneNumber, code) => (
    axios.post(
        API().auth.verifyOtp,
        {
            phoneNumber,
            code
        }
    ))

export const signup = (payload) => (
    axios.post(
        API().auth.signup,
        payload
    ))
