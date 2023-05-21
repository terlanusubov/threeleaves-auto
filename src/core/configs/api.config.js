export const endpoints = {
    // urgent : 'urgentListings',
    // platinum : 'platinumListings',
    // latest : 'latestListings',
    // search : 'searchResults',
    // models : 'models',
    // popularModels : 'popularModels'
    auth : {
        login : 'users/login'
    }

}
export const API = (param)=>({
    auth : {
        login : 'users/login',
        getOtp : 'users/otp',
        verifyOtp : 'users/verify-otp',
        signup : 'users',
        checkToken : 'users/check-token',
    },
    ads : {
        auto : 'advertisements/auto',
        autoDetails : `advertisements/auto/${param}`,
        filters : 'advertisements/auto/filters',
        filterCount : 'advertisements/auto/filter',
        models : `advertisements/auto/brands/${param}/models`,
        parts : 'advertisements/auto/parts',
        search : 'advertisements/auto/search',
        complaint : 'advertisements/complaint'
    },
    user : {
        wishlist : `users/wishlists`,
        ads : 'users/ads',
        profile : 'users/profile',
        workdays : 'users/workdays',
        agencies : 'users/agencies',
        agencyDetails : `users/profile/${param}`,
        agencyListings : `users/agencies/${param}/listings`,
        notificationCount : `notifications/notifications/count`,
    },
    subscription: {
        subscribe: 'subscriptions',
        checkStatus: `subscriptions/status/${param}`,
        plans: `subscriptions/plans/${param}`,
        approve: 'subscriptions/approve',
    }
})
