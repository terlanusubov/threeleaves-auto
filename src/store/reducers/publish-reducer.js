import {PublishTypes} from "../actions/types/publish-types";

const initialState = {
    steps: [
        {
            id: 0,
            name: 'Marka',
            done: false,
            value: null,
            route: '/publish/brand',
            noNext: true
        },
        {
            id: 1,
            name: 'Model',
            done: false,
            value: null,
            route: '/publish/model',
            noNext: true
        },
        {
            id: 2,
            name: 'Avtomobilin eksterieri',
            done: false,
            value: null,
            route: '/publish/exterior'
        },
        {
            id: 3,
            name: 'Texniki göstəricilər',
            done: false,
            value: null,
            route: '/publish/specs'
        },
        {
            id: 4,
            name: 'Avtomobilin təchizatı',
            done: false,
            value: null,
            route: '/publish/features'
        },
        {
            id: 5,
            name: 'Detallar',
            done: false,
            value: null,
            route: '/publish/condition'
        },
        {
            id: 6,
            name: 'Şəkillər',
            done: false,
            value: null,
            route: '/publish/images'
        },
        {
            id: 7,
            name: 'Əlavə məlumat',
            done: false,
            value: null,
            route: '/publish/notes'
        },
        {
            id: 8,
            name: 'Şəhər',
            done: false,
            value: null,
            route: '/publish/location'
        },
        // {
        //     id: 9,
        //     name: 'Özünüz haqqında',
        //     done: false,
        //     value: null,
        //     route: '/publish/finish'
        // },
        {
            id: 9,
            name: 'Elanı yerləşdir',
            done: false,
            value: null,
            route: '/publish/finish',
            noNext: true
        }
    ],
    values: {
        brandId: null,
        modelId: null,
        autoDesignId: null,
        colorId: null,
        releaseYear: null,
        vinCode: null,
        producerCountryId: null,
        ride: null,
        rideTypeId: null,
        fuelTypeId: null,
        gearBoxId: null,
        engine: null,
        horsePower: null,
        supplies: [],
        parts: [],
        files: [],
        video: null,
        description: null,
        langitude: 'test',
        latitude: 'test',
        cityId: null,
        contactName : null,
        address: null,
        canCredit : false,
        canBarter : false,
        price : null,
    },
    plans: [],
    additionalPlans: [],
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

export const publishReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case PublishTypes.CHANGE_STEP:
            const steps = mutateSteps(state, payload.id, payload.value)
            return {
                ...state,
                steps
            }
        case PublishTypes.RESET_STEPS:
            return {
                ...resetSteps(state)
            }
        case PublishTypes.BRAND_SELECT:
            return {
                ...state,
                values: mutateValues(state, 'brandId', payload.id)
            }
        case PublishTypes.MODEL_SELECT:
            return {
                ...state,
                values: mutateValues(state, 'modelId', payload.id)
            }
        case PublishTypes.EXTERIOR_SELECT:
            return {
                ...state,
                values: mutateValues(state, ['autoDesignId', 'colorId', 'releaseYear', 'vinCode'], payload)
            }
        case PublishTypes.SPECS_SELECT:
            return {
                ...state,
                values: mutateValues(state, ['producerCountryId', 'ride', 'rideTypeId', 'fuelTypeId', 'gearBoxId', 'engine', 'horsePower'], payload)
            }
        case PublishTypes.FEATURES_SELECT:
            return {
                ...state,
                values: mutateValues(state, 'supplies', payload)
            }
        case PublishTypes.CONDITION_SELECT:
            return {
                ...state,
                values: mutateValues(state, 'parts', payload)
            }
        case PublishTypes.IMAGES_SELECT:
            return {
                ...state,
                values: mutateValues(state, ['files', 'video'], payload)
            }
        case PublishTypes.NOTE_SELECT:
            return {
                ...state,
                values: mutateValues(state, 'description', payload)
            }
        case PublishTypes.LOCATION_SELECT:
            return {
                ...state,
                values: mutateValues(state, 'cityId', payload)
            }
        case PublishTypes.FINISH_ADD:
            return {
                ...state,
                values: mutateValues(state, ['canCredit', 'canBarter', 'price', 'contactName'], payload)
            }
        case PublishTypes.GET_PLANS:
            return {
                ...state,
                plans: payload
            }
            case PublishTypes.GET_ADDITIONAL_PLANS:
            return {
                ...state,
                additionalPlans: payload
            }
        default:
            return state;
    }
}
