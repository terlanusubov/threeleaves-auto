import { combineReducers } from 'redux';
import {homeReducer} from "./home-reducer";
import {publicReducer} from "./public-reducer";
import {publishReducer} from "./publish-reducer";
import {authReducer} from "./auth-reducer";
import {profileReducer} from "./profile-reducer";
import {dealershipReducer} from "./dealership-reducer";
import {editListingReducer} from "./edit-listing-reducer";
export const rootReducer = combineReducers({
    home : homeReducer,
    publicState : publicReducer,
    publish : publishReducer,
    editListing : editListingReducer,
    auth : authReducer,
    profile : profileReducer,
    dealership : dealershipReducer,
})
