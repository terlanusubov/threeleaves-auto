import {AuthTypes, stepTypes} from "../actions/types/auth-types";

const initialState = {
    user: null,
    token: null,
    error: null,
    signupSteps: {
        phone: false,
        otp: false,
        type: false,
        final: false
    },
    currentStep: stepTypes.phone
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AuthTypes.AUTH_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case AuthTypes.LOG_IN_SUCCESS:
            return {
                ...state,
                token: action.payload.token,
                user: {...action.payload},
                error: null
            }
        case AuthTypes.NUMBER_PASS:
            return {
                ...state,
                signupSteps: {
                    ...state.signupSteps,
                    phone: true
                },
                currentStep: stepTypes.otp
            }

        case AuthTypes.OTP_PASS:
            return {
                ...state,
                signupSteps: {
                    ...state.signupSteps,
                    otp: true
                },
                currentStep: stepTypes.type
            }
        case AuthTypes.TYPE_PASS:
            return {
                ...state,
                signupSteps: {
                    ...state.signupSteps,
                    type: true
                },
                currentStep: stepTypes.final
            }
        case AuthTypes.SIGNUP_SUCCESS:
            return {
                ...state,
                signupSteps: {
                    ...state.signupSteps,
                    final: true
                },
            }

        case AuthTypes.AUTH_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case AuthTypes.AUTH_SUCCESS:
            return {
                ...state,
                error: null,
                signupSteps: {
                    phone: false,
                    otp: false,
                    type: false,
                    final: false
                },
                currentStep: stepTypes.phone
            }
        case AuthTypes.LOG_OUT:
            return {
                ...state,
                error: null,
                user : null,
                token : null
            }
        case AuthTypes.SET_STEP:
            return {
                ...state,
                currentStep: action.payload,
                signupSteps: {
                    ...state.signupSteps,
                    [action.payload] : true
                }
            }
        default:
            return state;
    }
}
