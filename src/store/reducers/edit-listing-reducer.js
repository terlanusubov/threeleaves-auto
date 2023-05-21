import {EditListingTypes} from "../actions/types/edit-listing-types";
const initialState = {
    steps: [
        {
            id: 0,
            name: 'Avtomobilin təchizatı',
            done: false,
            value: null,
            route: '/edit-listing/[adId]/features'
        },
        {
            id: 1,
            name: 'Detallar',
            done: false,
            value: null,
            route: '/edit-listing/[adId]/condition'
        },
        {
            id: 2,
            name: 'Şəkillər',
            done: false,
            value: null,
            route: '/edit-listing/[adId]/images'
        },
        {
            id: 3,
            name: 'Əlavə məlumat',
            done: false,
            value: null,
            route: '/edit-listing/[adId]/notes'
        },
        {
            id: 4,
            name: 'Şəhər',
            done: false,
            value: null,
            route: '/edit-listing/[adId]/location'
        },
        {
            id: 5,
            name: 'Elanı yenilə',
            done: false,
            value: null,
            route: '/edit-listing/[adId]/finish'
        }
    ],
    values: {
        supplies: [],
        parts: [],
        files: [],
        description: null,
        langitude: 'test',
        latitude: 'test',
        cityId: null,
        address: null,
        // canCredit : false,
        // canBarter : false,
        price : null,
        deletedFiles : [],
        adId : null
    },
    valuesFetched : false,
}

const initiateValues = (payload)=>{
    const val = {
        supplies: [...payload.supplies.map(item=>item.id)],
        parts: [...payload.parts.map(({id, partTypeId})=>({
            partId : id,
            partTypeId,
        }))],
        files: [],
        description: payload.description,
        langitude: payload.langitude,
        latitude: payload.latitude,
        cityId: payload.cityId,
        address: payload.address,
        // canCredit : false,
        // canBarter : false,
        price : payload.price,
        deletedFiles : [],
        adId : payload.adId
    }
    return val
}
const initiateSteps = (payload)=>{
    let val = [
        {
            id: 0,
            name: 'Avtomobilin təchizatı',
            done: true,
            value: [...payload.supplies.map(item=>item.id)],
            route: '/edit-listing/[adId]/features'
        },
        {
            id: 1,
            name: 'Detallar',
            done: true,
            value: [
                ...payload.parts.map(({id, code, partTypeId})=>({partId : id, partTypeId, key : code}))
            ],
            route: '/edit-listing/[adId]/condition'
        },
        {
            id: 2,
            name: 'Şəkillər',
            done: true,
            value: {
                files : [],
                fileObjects : [
                    {id : payload.mainImageModel.id,file : null, isOld : true, blob : payload.mainImageModel.url},
                    ...payload.imagesModel.map(img=>({id : img.id,file : null, isOld : true, blob : img.url}))
                ],
                video : ''
            },
            route: '/edit-listing/[adId]/images'
        },
        {
            id: 3,
            name: 'Əlavə məlumat',
            done: true,
            value: payload.description,
            route: '/edit-listing/[adId]/notes'
        },
        {
            id: 4,
            name: 'Şəhər',
            done: true,
            value: {
                cityId :payload.cityId,
                address : payload.address,
                latitude : payload.latitude,
                langitude : payload.langitude
            },
            route: '/edit-listing/[adId]/location'
        },
        {
            id: 5,
            name: 'Elanı yenilə',
            done: true,
            value: {
                price: payload.price,
                contactName: payload.contactName,
                canBarter: payload.canBarter,
                canCredit: payload.canCredit
            },
            route: '/edit-listing/[adId]/finish'
        }
    ]
    return val
}
const mutateSteps = (state, id, value) => {
    const steps = state.steps.map(item => {
        if (item.id === id) {
            return {...item, done: true, value}
        } else return item
    })
    return steps
}

const resetSteps = (state) => {
    const steps = state.steps.map(item => {
        return {...item, done: false, value: null}
    })

    const values = state.values
    for (let key in values) {
        if (Array.isArray(values[key])) {
            values[key] = []
        } else values[key] = null
    }
    return {
        ...state,
        steps,
        values
    }
}

const mutateValues = (state, key, value) => {
    if (Array.isArray(key)) {
        let values = {...state.values}
        key.forEach(item => {
            values[item] = value[item]
        })
        return {...values}
    }
    return {...state.values, [key]: value}
}

export const editListingReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case EditListingTypes.CHANGE_STEP:
            const steps = mutateSteps(state, payload.id, payload.value)
            return {
                ...state,
                steps
            }
        case EditListingTypes.RESET_STEPS:
            return {
                ...resetSteps(state)
            }
        case EditListingTypes.FEATURES_SELECT:
            return {
                ...state,
                values: mutateValues(state, 'supplies', payload)
            }
        case EditListingTypes.CONDITION_SELECT:
            return {
                ...state,
                values: mutateValues(state, 'parts', payload)
            }
        case EditListingTypes.IMAGES_SELECT:
            return {
                ...state,
                values: mutateValues(state, ['files', 'video', 'deletedFiles'], payload)
            }
        case EditListingTypes.NOTE_SELECT:
            return {
                ...state,
                values: mutateValues(state, 'description', payload)
            }
        case EditListingTypes.LOCATION_SELECT:
            return {
                ...state,
                values: mutateValues(state, ['cityId', 'address', 'latitude', 'langitude'], payload)
            }
        case EditListingTypes.FINISH_ADD:
            return {
                ...state,
                values: mutateValues(state, 'price', payload)
            }
        case EditListingTypes.FETCH_VALUES:
            return {
                ...state,
                valuesFetched: true,
                values: initiateValues(payload),
                steps: initiateSteps(payload)
            }
        default:
            return state;
    }
}
