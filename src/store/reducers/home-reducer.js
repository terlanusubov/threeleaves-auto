import {HomeTypes} from "../actions/types/home-types";

const initialState = {
    platinumListings: [],
    urgentListings: [],
    latestListings: [],
    searchResult: [],
    urgentListingsFilter: [],
    platinumListingsFilter: [],
    similarResults: [],
    tags: [],
    filterCount: 0,
    models: [],
    popularModels: [],
    shouldPaginatePlat: true,
    shouldPaginateLatest: true,
    shouldPaginateSearch: true,
    shouldPaginateSimilar: true,
    shouldPaginateUrgent: true,
    shouldPaginatePlatFilter: true,
}

export const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        case HomeTypes.GET_LISTINGS_START:
            return {
                ...state,
                loading: true
            }
        case HomeTypes.GET_LISTINGS_SUCCESS:
            return {
                ...state,
                loading: false,
                notifications: action.payload,
                error: null
            }
        case HomeTypes.GET_LISTINGS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case HomeTypes.ADD_TAG:
            return {
                ...state,
                tags: [...state.tags, action.payload]
            }
        case HomeTypes.REMOVE_TAG:
            const newTags = state.tags.filter(item => item.id !== action.payload)
            return {
                ...state,
                tags: [...newTags],
            }
        case HomeTypes.RESET_TAGS:
            return {
                ...state,
                tags: [],
            }
        case HomeTypes.GET_FILTER_COUNT:
            return {
                ...state,
                filterCount: action.payload,
            }
        case HomeTypes.GET_MODELS:
            return {
                ...state,
                models: action.payload,
            }

        case HomeTypes.GET_LATEST_SUCCESS:
            let shouldPaginateLatest = !!action.payload.length && action.payload.length === 12
            return {
                ...state,
                shouldPaginateLatest,
                latestListings: [...state.latestListings, ...action.payload],
            }

        case HomeTypes.GET_PLATINUM_SUCCESS:
            let shouldPaginatePlat = !!action.payload.length && action.payload.length === 12
            return {
                ...state,
                shouldPaginatePlat,
                platinumListings: [...state.platinumListings, ...action.payload],
            }
        case HomeTypes.GET_URGENT_SUCCESS:
            return {
                ...state,
                urgentListings: action.payload,
            }
        case HomeTypes.GET_SEARCH_RESULT_SUCCESS:
            let shouldPaginateSearch = !!action.payload.length && action.payload.length === 12
            return {
                ...state,
                shouldPaginateSearch,
                searchResult: [...state.searchResult, ...action.payload],
            }
        case HomeTypes.GET_SEARCH_RESULT_FILTER_SUCCESS:
            shouldPaginateSearch = !!action.payload.length && action.payload.length === 12
            return {
                ...state,
                shouldPaginateSearch,
                searchResult: [...action.payload],
            }
        case HomeTypes.GET_URGENT_LISTINGS_FILTER_SUCCESS:
            let shouldPaginateUrgent = !!action.payload.length && action.payload.length === 12
            return {
                ...state,
                shouldPaginateUrgent,
                urgentListingsFilter: [...action.payload],
            }
        case HomeTypes.GET_PLAT_LISTINGS_FILTER_SUCCESS:
            let shouldPaginatePlatFilter = !!action.payload.length && action.payload.length === 12
            return {
                ...state,
                shouldPaginatePlatFilter,
                platinumListingsFilter: [...action.payload],
            }
        case HomeTypes.GET_SIMILAR_SUCCESS :
            let shouldPaginateSimilar = !!action.payload.length && action.payload.length === 12
            return {
                ...state,
                shouldPaginateSimilar,
                similarResults: [...state.similarResults, ...action.payload]
            }
        case HomeTypes.RESET_LISTS :
            shouldPaginateSearch = true
            shouldPaginatePlat = true
            shouldPaginateLatest = true
            shouldPaginateSimilar = true
            shouldPaginateUrgent = true
            shouldPaginatePlatFilter= true
            return {
                ...state,
                platinumListings: [],
                latestListings: [],
                searchResult: [],
                similarResults: [],
                urgentListingsFilter: [],
                platinumListingsFilter: [],
                shouldPaginateSearch,
                shouldPaginatePlat,
                shouldPaginateLatest,
                shouldPaginateSimilar,
                shouldPaginateUrgent,
                shouldPaginatePlatFilter
            }
        default:
            return state;
    }
}
