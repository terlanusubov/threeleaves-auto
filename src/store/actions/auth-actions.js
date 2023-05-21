import {AuthTypes} from "./types/auth-types";
import * as authService from '../../services/auth.service'
import Router from "next/router";
import {clearAuthStorage} from "../../core/configs/auth.config";
import {checkToken} from "../../services/auth.service";

export const logInSuccess = (userData) => ({
    type: AuthTypes.LOG_IN_SUCCESS,
    payload: userData
})

export const logInFail = (error) => ({
    type: AuthTypes.AUTH_FAIL,
    payload: error
})

export const numberSuccess = () => ({
    type: AuthTypes.NUMBER_PASS
})

export const otpSuccess = () => ({
    type: AuthTypes.OTP_PASS
})

export const typeSuccess = () => ({
    type: AuthTypes.TYPE_PASS
})

export const signupSuccess = () => ({
    type: AuthTypes.SIGNUP_SUCCESS
})

export const login = (credentials) => (dispatch) => {
    return authService.login(credentials).then((res) => {
        let storage = credentials.save ? localStorage : sessionStorage
        storage.setItem('auth-token', res.token)
        storage.setItem('auth-user', JSON.stringify(res))
        dispatch(logInSuccess(res))
        Router.replace('/')
        return Promise.resolve(res)

    }).catch(err => {
        // errorToast('İstifadəçi adı ve ya sifrə yalnisdir!')
        // dispatch(loginFail)
    })
}

export const setUserData = (userData) => (dispatch) => {
    dispatch(logInSuccess(userData))
}

export const signupNumber = (number) => (dispatch) => {
    return authService.signupNum(number)
        .then(res => {
            dispatch(numberSuccess())
            return Promise.resolve(res)
        })
        .catch(err => {
            dispatch(logInFail(err))
        })
}


export const signupOtp = (otp) => (dispatch) => {
    return authService.signupOtp(otp)
        .then(res => {
            dispatch(otpSuccess())
            return Promise.resolve(res)
        })
        .catch(err => {
            dispatch(logInFail(err))
        })
}

export const signup = (payload) => (dispatch) => {
    return authService.signup(payload)
        .then(res => {
            dispatch(signupSuccess())
            Router.replace({
                pathname: 'https://user.treo.az',
                query: {site: 'auto', page: 'login'}
            })
            return Promise.resolve(res)
        })
        .catch(err => {
            dispatch(logInFail(err))
        })
}

export const logoutSuccess = () => ({
    type: AuthTypes.LOG_OUT,
})

export const logout = () => (dispatch) => {
    dispatch(logoutSuccess())
    clearAuthStorage()
    Router.replace({
        pathname: 'https://user.treo.az',
        query: {site: 'auto'}
    })
}

export const setSignupStep = (step)=>({
    type : AuthTypes.SET_STEP,
    payload : step
})


export const checkLogin = () => (dispatch) => {
    return authService.checkToken().then((res) => {
        let storage = localStorage
        storage.setItem('auth-token', res.token)
        storage.setItem('auth-user', JSON.stringify(res))
        dispatch(logInSuccess(res))
        return Promise.resolve(res)

    }).catch(err => {
        dispatch(logoutSuccess())
        clearAuthStorage()
        return Promise.reject(err)
    })
}
