import {ProfileTypes} from "../actions/types/profile-types";

const initialState = {
    favorites: [],
    myListings: [],
    profile: null,
}

export const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case ProfileTypes.GET_FAV:
            return {
                ...state,
                favorites: action.payload
            }
        case ProfileTypes.GET_MY_LISTINGS:
            return {
                ...state,
                myListings: action.payload
            }
        case ProfileTypes.GET_PROFILE:
            return {
                ...state,
                profile: action.payload
            }
        case ProfileTypes.RESET_FAV:
            return {
                ...state,
                favorites: []
            }
        default:
            return state;
    }
}
