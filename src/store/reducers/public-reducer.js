import {PublicTypes} from "../actions/types/public-types";

const initialState = {
    searchOpen: false,
    searchFocused: false,
    loading: false,
    contentScroll: 0,
    screen: 1200,
    notCount: 0,
}

export const publicReducer = (state = initialState, action) => {
    switch (action.type) {
        case PublicTypes.TOGGLE_SEARCHBAR:
            return {
                ...state,
                searchOpen: action.payload
            }
        case PublicTypes.SET_LOADER:
            return {
                ...state,
                loading: action.payload
            }
        case PublicTypes.TOGGLE_SEARCHBAR_BACKDROP:
            return {
                ...state,
                searchFocused: action.payload
            }
        case PublicTypes.SET_SCROLL:
            return {
                ...state,
                contentScroll: action.payload
            }
        case PublicTypes.SET_SCREEN:
            return {
                ...state,
                screen: action.payload
            }
        case PublicTypes.SET_NOTIFICATION_COUNT:
            return {
                ...state,
                notCount: action.payload
            }
        default:
            return state;
    }
}
