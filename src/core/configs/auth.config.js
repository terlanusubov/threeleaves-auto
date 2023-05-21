import {serialize, parse} from "cookie";

// export const getToken = ()=>localStorage.getItem('auth-token')
export const getToken = () => localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token')
export const getUserData = () => JSON.parse(localStorage.getItem('auth-user')) || JSON.parse(sessionStorage.getItem('auth-user'))

export const setUserDataLocal = (userData) => {
    if (localStorage.getItem('auth-user')){
        localStorage.setItem('auth-user', JSON.stringify(userData))
    }
    else if(sessionStorage.getItem('auth-user')){
        sessionStorage.setItem('auth-user', JSON.stringify(userData))
    }
}

export const clearAuthStorage = () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-user')
    sessionStorage.removeItem('auth-token')
    sessionStorage.removeItem('auth-user')
}
