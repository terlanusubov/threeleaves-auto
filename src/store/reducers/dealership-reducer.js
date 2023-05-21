import {DealershipTypes} from "../actions/types/dealership-types";

const initialState = {
    dealerships: [],
    dealershipPaginate: true,
    dealershipListingsPaginate: true,
    dealershipListings: []
}

export const dealershipReducer = (state = initialState, action) => {
    switch (action.type) {
        case DealershipTypes.GET_AGENCIES:
            let dealershipPaginate = !!action.payload.length && action.payload.length === 12
            return {
                ...state,
                dealerships: [...state.dealerships, ...action.payload],
                dealershipPaginate
            }
        case DealershipTypes.GET_AGENCY_LISTINGS:
            let dealershipListingsPaginate = !!action.payload.length && action.payload.length === 12
            return {
                ...state,
                dealershipListings: [...state.dealershipListings, ...action.payload],
                dealershipListingsPaginate
            }
        case DealershipTypes.RESET_DEALERS :
            dealershipPaginate = true
            dealershipListingsPaginate = true
            return {
                ...state,
                dealerships: [],
                dealershipListings: [],
                dealershipPaginate,
                dealershipListingsPaginate
            }
        default:
            return state;
    }
}
