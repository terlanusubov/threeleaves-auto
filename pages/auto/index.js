import css from "../index.module.scss";
import Blur from "../../src/core/shared/blur";
import GrayBackdrop from "../../src/core/shared/gray-backdrop";
import Image from "next/image";
import fire from "../../src/assets/images/fire.svg";
import Link from "next/link";
import SearchPanel from "../../src/core/shared/search-panel";
import UrgentItems from "../../src/core/shared/urgent-items";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Select from "../../src/core/shared/form-elements/select-elements/select";
import {createOptionsRange, generateGuid} from "../../src/core/helpers/common-functions";
import SaleCard from "../../src/core/shared/listing/sale-card";
import Button from "../../src/core/shared/button";
import {SocialLinksConfig} from "../../src/core/configs/social-links.config";
import SocialLink from "../../src/core/shared/social-link";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {
    getFilterCount,
    getLatestList,
    getLatestListSuccess,
    getModels,
    getPlatinumList,
    getPlatinumListSuccess, getPlatListingsFilter,
    getSearchResult,
    getSearchResultFilter,
    getSearchResultSuccess,
    getUrgentListingsFilter,
    removeTag,
    resetLists
} from "../../src/store/actions/home-actions";
import * as services from "../../src/services";
import FloatingPanel from "../../src/core/shared/floating-panel";
import Head from "next/head";

export async function getServerSideProps(context) {
    const query = context.query
    const brandId = context.query.brandId
    let models = []
    if (context.query !== {}) {
        // const [listings, urgentListings, filters] = await Promise.all([
        const [filters] = await Promise.all([
            // services.getCarList({...query, page : 1}).then(res => res.ads) || [],
            services.getFilters().then(res => res.filters),
        ]);

        const brands = filters.brands || []
        const transmissions = filters.gearBoxes || []
        const bodyStyles = filters.autoDesigns || []
        const colors = filters.colors || []
        const countries = filters.producerCountries || []
        const fuel = filters.fuelTypes || []
        const equipment = filters.supplies || []
        const conditions = filters.rideTypes || []
        const cities = filters.cities.sort((a, b) => a.name.localeCompare(b.name)) || []
        if (brandId) {
            models = await services.getModels(brandId).then(res => res.models)
            const brandExists = !!brands.find(br => br.id.toString().trim() === brandId.toString().trim())
            if (!brandExists) {
                return {
                    notFound: true
                }
            }
        }
        // const models = await axios.get(endpoints.models).then(res => res.data)
        // const popularModels = await axios.get(endpoints.popularModels).then(res=>res.data)
        return {
            props: {
                query,
                // listings,
                filters,
                brands,
                transmissions,
                bodyStyles,
                colors,
                countries,
                fuel,
                equipment,
                conditions,
                cities
            }
        }
    }
    return {
        redirect: {
            permanent: false,
            destination: '/'
        }
    }
}

function Auto(props) {
    const makeSureItIsArray = (data) => {
        if (data) {
            const dt = []
            if (!Array.isArray(data)) {
                return [+data]
            }
            return data.map(it => +it)
        }
        return []
    }
    const dispatch = useDispatch()
    const tags = useSelector(({home}) => home.tags)
    const searchFocused = useSelector(({publicState}) => publicState.searchFocused)
    const searchbarOpen = useSelector(({publicState}) => publicState.searchOpen)
    const filterCount = useSelector(({home}) => home.filterCount)
    const models = useSelector(({home}) => home.models)
    const popularModels = useSelector(({home}) => home.popularModels)
    const searchResult = useSelector(({home}) => home.searchResult)
    const urgentListingsFilter = useSelector(({home}) => home.urgentListingsFilter)
    const platinumListingsFilter = useSelector(({home}) => home.platinumListingsFilter)
    const searchPaginate = useSelector(({home}) => home.shouldPaginateSearch)
    const platPaginate = useSelector(({home}) => home.shouldPaginatePlatFilter)

    // const urgentList = useSelector(({home}) => home.popularModels)
    const router = useRouter()

    //STATE
    const [page, setPage] = useState(2)
    const [pagePlat, setPagePlat] = useState(2)
    const [sorted, setSorted] = useState(false)
    const [footerLinks, setFooterLinks] = useState([
        {title: 'Avtosalonlar', url: '/dealerships'},
        {title: 'Qaydalar', url: 'https://user.treo.az/rules'},

        // {title: 'Reklamın yerləşdirilməsi', url: '/ad'}
    ])
    const [gotModels, setGotModels] = useState(false)
    const [deletedInput, setDeletedInput] = useState(null)
    const [otherInputs, setOtherInputs] = useState({
        sort: {
            type: 'select',
            value: '10',
            name: 'sort',
            placeholder: null,
            options: [
                // {title: 'Hamısı', value: '0'},
                {title: 'Tarixə görə', value: '10'},
                {title: 'Qiymət artan', value: '20'},
                {title: 'Qiymət azalan', value: '30'},
                {title: 'Buraxılış ili', value: '50'},
                {title: 'Yürüş', value: '40'},
            ]
        },
    })
    const [inputs, setInputs] = useState({
        condition: {
            value: props.query.rideTypeId || '0',
            options: [
                {title: 'Hamısı', value: '0', active: !props.query.rideTypeId},
                {title: 'Yeni', value: '1', active: props.query.rideTypeId === '1'},
                {title: 'Yürüş ilə', value: '2', active: props.query.rideTypeId === '2'},
                // ...props.conditions.map(({name, id}) => ({title: name, value: id, active: false}))
            ],
        },
        city: {
            type: 'select',
            value: +props.query.cityId || '0',
            name: 'city',
            placeholder: 'Şəhər',
            options: [
                {title: 'Şəhər', value: '0'},
                ...props.cities.map(({name, id}) => ({title: name, value: id}))
            ]
        },
        brand: {
            type: 'select',
            placeholder: 'Marka',
            value: +props.query.brandId || '0',
            // value: '0',
            options: [
                {title: 'Marka', value: '0'},
                ...props.brands.map(({name, id}) => ({title: name, value: id}))
                // {title: 'Nissan', value: '01'},
                // {title: 'BMW', value: '02'},
                // {title: 'Mazda', value: '03'},
            ]
        },
        model: {
            name: 'model',
            type: 'multi-select',
            value: makeSureItIsArray(props.query.models),
            // value : [],
            placeholder: 'Model',
            options: [
                // {title: 'GTR', value: 'model01', checked: false},
                // {title: 'Silvia', value: 'model02', checked: false},
                // {title: 'Lauren', value: 'model03', checked: false},
            ],
            optionsParsed: [],
            popular: []
        },
        year: {
            type: 'range',
            isNum: true,
            value: {min: props.query.minYear || '', max: props.query.maxYear || ''},
            // value: {min: '', max: ''},
            tagPre: 'İl',
            defaults: {max: new Date().getFullYear(), min: '1600'},
            rules: {maxLength: 4}
        },
        price: {
            type: 'range',
            isNum: true,
            tagPre: 'Qiymət',
            defaults: {max: 'X', min: '0'},
            value: {min: props.query.priceMin || '', max: props.query.priceMax || ''},
            // value: {min: '', max: ''}
        },
        yearMax: {
            type: 'range',
            value: '0',
            placeholder: "maks.",
            options: [
                {title: 'Bütün illər', value: '0'},
                {title: '100', value: '100'},
                {title: '200', value: '200'},
                {title: '300', value: '300'},
                {title: '400', value: '400'},
            ],
            tagField: {type: 'max', field: 'year'}

        },
        yearMin: {
            type: 'range',
            value: '0',
            placeholder: "İl min",
            options: [
                {title: 'Bütün illər', value: '0'},
                {title: '100', value: '100'},
                {title: '200', value: '200'},
                {title: '300', value: '300'},
                {title: '400', value: '400'},
            ],
            tagField: {type: 'min', field: 'year'}
        },
        currency: {
            value: 'azn',
            options: [
                {title: '₼', value: 'azn'},
                {title: '$', value: 'usd'}
            ]
        },
        mileage: {
            type: 'range',
            isNum: true,
            tagPre: 'Yürüş',
            defaults: {max: 'X', min: '0'},
            // value: {min: '', max: ''},
            value: {min: props.query.rideMin || '', max: props.query.rideMax || ''},

        },
        // engine: {
        //     type: 'range',
        //     isNum: true,
        //     tagPre: 'Mühərrik',
        //     defaults: {max: 'X', min: '0'},
        //     value: {min: props.query.engineMin || '', max: props.query.engineMax || ''},
        //     // value: {min: '', max: ''}
        // },
        engineMin: {
            tagPre: 'Mühərrik',
            type: 'select-range',
            value: props.query.engineMin || '0',
            placeholder: "Mühərrik min",
            maxKey: 'engineMax',
            options: [
                // {title: 'Bütün illər', value: '0'},
                {title: 'Həcm, sm3', value: '0'},

                ...createOptionsRange(100, 18000, 100)
            ],
            tagField: {type: 'min', field: 'year'}
        },
        engineMax: {
            tagPre: 'Mühərrik',
            isMax: true,
            type: 'select-range',
            value: props.query.engineMax || '0',
            placeholder: "maks.",
            options: [
                // {title: 'Bütün illər', value: '0'},
                {title: 'Həcm, sm3', value: '0'},

                ...createOptionsRange(100, 18000, 100)

            ],
            tagField: {type: 'max', field: 'year'}

        },
        transmission: {
            placeholder: 'Sürətlər qutusu',
            type: 'select',
            value: +props.query.gearBoxId || '0',
            options: [
                {title: 'Sürətlər qutusu', value: '0'},
                ...props.transmissions.map(({name, id}) => ({title: name, value: id}))
            ]
        },
        bodyStyle: {
            placeholder: 'Ban növü',
            type: 'select',
            // value: makeSureItIsArray(props.query.autoDesigns),
            value: +props.query.autoDesigns || '0',
            // value : [],
            options: [
                {title: 'Ban növu', value: '0'},
                ...props.bodyStyles.map(({name, id}) => ({title: name, value: id}))
            ]
        },
        color: {
            name: 'color',
            type: 'multi-select',
            value: makeSureItIsArray(props.query.colors),
            // value : [],
            placeholder: 'Rəng',
            options: [
                // {title: 'Qırmızı', value: 'col00001', hex: '#BC0000', checked: false},
                ...props.colors.map(({color, id, hexCode}) => ({
                    title: color,
                    value: id,
                    hex: hexCode || '#0000',
                    checked: props.query.colors?.includes(id.toString())
                }))

            ]
        },
        fuel: {
            placeholder: 'Yanacaq növü',
            type: 'select',
            value: +props.query.FuelTypeId || '0',
            options: [
                {title: 'Yanacaq növü', value: '0'},
                ...props.fuel.map(({name, id}) => ({title: name, value: id}))

            ]
        },
        country: {
            type: 'select',
            placeholder: 'İstehsalçı ölkə',
            value: +props.query.producerCountryId || '0',
            options: [
                {title: 'İstehsalçı ölkə', value: '0'},
                ...props.countries.map(({name, id}) => ({title: name, value: id}))
            ]
        }
    })
    const [shouldSubmit, setShouldSubmit] = useState(false)
    const [mainCheckboxes, setMainCheckboxes] = useState([
        {
            id: 'test0',
            label: 'Kredit',
            checked: !!props?.query.canCredit,
        },
        {
            id: 'test00',
            label: 'Barter',
            checked: !!props?.query.canBarter,
        },
    ])
    const [checkboxes, setCheckboxes] = useState([
        ...props.equipment.map(({id, name}) => ({
            id: id,
            label: name,
            checked: props.query.suppliesId?.includes(id.toString()),
        }))
    ])
    const [canCount, setCanCount] = useState(false)
    const [removedTags, setRemovedTags] = useState([])
    //HANDLERS
    const getFilterResultCount = async () => {
        const params = {
            rideTypeId: inputs.condition.value === '0' ? '' : inputs.condition.value,
            BrandId: inputs.brand.value === '0' ? '' : inputs.brand.value,
            Models: inputs.brand.value === '0' ? [] : inputs.model.value,
            MinYear: parseInt(inputs.year.value.min) || '',
            MaxYear: parseInt(inputs.year.value.max) || '',
            PriceMin: inputs.price.value.min,
            PriceMax: inputs.price.value.max,
            FuelTypeId: inputs.fuel.value === '0' ? '' : inputs.fuel.value,
            EngineMin: inputs.engineMin.value === '0' ? '' : inputs.engineMin.value,
            EngineMax: inputs.engineMax.value === '0' ? '' : inputs.engineMax.value,
            RideMin: parseInt(inputs.mileage.value.min) || '',
            RideMax: parseInt(inputs.mileage.value.max) || '',
            ProducerCountryId: inputs.country.value === '0' ? '' : inputs.country.value,
            Colors: inputs.color.value,
            AutoDesigns: inputs.bodyStyle.value === '0' ? [] : [inputs.bodyStyle.value],
            GearBoxId: inputs.transmission.value === '0' ? '' : inputs.transmission.value,
            CanCredit: mainCheckboxes[0].checked ? true : '',
            CanBarter: mainCheckboxes[1].checked ? true : '',
            CityId: inputs.city.value === '0' ? '' : inputs.city.value,
            SuppliesId: checkboxes.filter(cb => cb.checked).map(item => item.id),
            sortById: otherInputs.sort.value
        }
        const result = await dispatch(getFilterCount(params))
        console.log(result)
    }
    const handleOtherSelectChange = (value, input) => {
        setSorted(true)
        changeCanCount()
        setOtherInputs(prevState => {
            let newInput = {...prevState[input], value}
            return {
                ...prevState,
                [input]: {...newInput}
            }
        })
    }
    const changeCanCount = () => {
        if (!canCount) {
            setCanCount(true)
        }
    }
    const handleTagRemove = (id, input, value, type) => {
        dispatch(removeTag(id))
        changeCanCount()
        if (type === 'checkbox') {
            if (value === 'other') {
                setCheckboxes(prev => {
                    const newCb = prev.map(cb => {
                        if (cb.id === input) {
                            return {...cb, checked: false}
                        }
                        return cb
                    })
                    return [...newCb]
                })
            } else if (value === 'main') {
                setMainCheckboxes(prev => {
                    const newCb = prev.map(cb => {
                        if (cb.id === input) {
                            return {...cb, checked: false}
                        }
                        return cb
                    })
                    return [...newCb]
                })
            }
        } else if (type === 'range') {
            setInputs(prev => {
                return {
                    ...prev,
                    [input]: {
                        ...prev[input],
                        value: {min: '', max: ''}
                    }
                }
            })
        } else if (type === 'select-range') {
            setInputs(prev => {
                return {
                    ...prev,
                    [input]: {
                        ...prev[input],
                        value: '0'
                    },
                    [prev[input]?.maxKey]: {
                        ...prev[prev[input].maxKey],
                        value: '0'
                    }
                }
            })
        } else {
            setInputs(prev => {
                if (Array.isArray(prev[input].value)) {
                    let newValue = prev[input].value.filter(item => item !== value)
                    const newOptions = prev[input].options.map(opt => {
                        if (newValue.includes(opt.value)) {
                            return {...opt, checked: true}
                        }
                        return {...opt, checked: false}
                    })
                    return {
                        ...prev,
                        [input]: {
                            ...prev[input],
                            value: newValue,
                            options: newOptions
                        }
                    }
                } else {
                    return {
                        ...prev,
                        [input]: {
                            ...prev[input],
                            value: '0'
                        }
                    }
                }

            })
        }
        setRemovedTags(id)
    }

    const onShowMore = () => {
        const params = {
            rideTypeId: inputs.condition.value === '0' ? '' : inputs.condition.value,
            BrandId: inputs.brand.value === '0' ? '' : inputs.brand.value,
            Models: inputs.brand.value === '0' ? [] : inputs.model.value,
            MinYear: parseInt(inputs.year.value.min) || '',
            MaxYear: parseInt(inputs.year.value.max) || '',
            PriceMin: inputs.price.value.min,
            PriceMax: inputs.price.value.max,
            FuelTypeId: inputs.fuel.value === '0' ? '' : inputs.fuel.value,
            EngineMin: inputs.engineMin.value === '0' ? '' : inputs.engineMin.value,
            EngineMax: inputs.engineMax.value === '0' ? '' : inputs.engineMax.value,
            RideMin: parseInt(inputs.mileage.value.min) || '',
            RideMax: parseInt(inputs.mileage.value.max) || '',
            ProducerCountryId: inputs.country.value === '0' ? '' : inputs.country.value,
            Colors: inputs.color.value,
            AutoDesigns: inputs.bodyStyle.value === '0' ? [] : [inputs.bodyStyle.value],
            GearBoxId: inputs.transmission.value === '0' ? '' : inputs.transmission.value,
            CanCredit: mainCheckboxes[0].checked ? true : '',
            CanBarter: mainCheckboxes[1].checked ? true : '',
            CityId: inputs.city.value === '0' ? '' : inputs.city.value,
            SuppliesId: checkboxes.filter(cb => cb.checked).map(item => item.id),
            sortById: otherInputs.sort.value
        }
        dispatch(getSearchResult({...params, page}))
        setPage(prev => prev + 1)
    }
    const onShowMorePlat = () => {
        const params = {
            rideTypeId: inputs.condition.value === '0' ? '' : inputs.condition.value,
            BrandId: inputs.brand.value === '0' ? '' : inputs.brand.value,
            Models: inputs.brand.value === '0' ? [] : inputs.model.value,
            MinYear: parseInt(inputs.year.value.min) || '',
            MaxYear: parseInt(inputs.year.value.max) || '',
            PriceMin: inputs.price.value.min,
            PriceMax: inputs.price.value.max,
            FuelTypeId: inputs.fuel.value === '0' ? '' : inputs.fuel.value,
            EngineMin: inputs.engineMin.value === '0' ? '' : inputs.engineMin.value,
            EngineMax: inputs.engineMax.value === '0' ? '' : inputs.engineMax.value,
            RideMin: parseInt(inputs.mileage.value.min) || '',
            RideMax: parseInt(inputs.mileage.value.max) || '',
            ProducerCountryId: inputs.country.value === '0' ? '' : inputs.country.value,
            Colors: inputs.color.value,
            AutoDesigns: inputs.bodyStyle.value === '0' ? [] : [inputs.bodyStyle.value],
            GearBoxId: inputs.transmission.value === '0' ? '' : inputs.transmission.value,
            CanCredit: mainCheckboxes[0].checked ? true : '',
            CanBarter: mainCheckboxes[1].checked ? true : '',
            CityId: inputs.city.value === '0' ? '' : inputs.city.value,
            SuppliesId: checkboxes.filter(cb => cb.checked).map(item => item.id),
            sortById: otherInputs.sort.value
        }
        dispatch(getPlatListingsFilter({...params, pagePlat}))
        setPagePlat(prev => prev + 1)
    }
    // SEARCH PANEL HANDLERS
    const changeMultiSelectChecked = (checked, option, name) => {
        changeCanCount()
        setInputs(prev => {
            let prevInput = {...prev[name]}
            let newOptions = prevInput.options.map(item => {
                if (item.value === option.value) {
                    return {...item, checked}
                }
                return {...item}
            })

            let prevValue = [...prev[name].value]
            let exists = prevValue.find(item => item === option.value)
            if (exists) {
                let existingOpt = prevInput.options.find(opt => opt.value === exists)
                let newVal = prevValue.filter(val => val !== exists)
                const removeOpt = tags.find(tag => tag.title === existingOpt.title)
                // if (removeOpt){
                //     dispatch(removeTag(removeOpt.id))
                // }

                return {
                    ...prev,
                    [name]: {
                        ...prev[name],
                        options: [...newOptions],
                        value: [...newVal]
                    },
                }
            } else {
                let newVal = [...prevValue, option.value]
                // dispatch(addTag({id : generateGuid(), title: option.title}))
                return {
                    ...prev,
                    [name]: {
                        ...prev[name],
                        options: [...newOptions],
                        value: [...newVal]
                    },
                }
            }

        })
    }
    const checkboxChange = (val, id, isMain) => {
        changeCanCount()
        let cb = isMain ? mainCheckboxes : checkboxes;
        let newElements = cb.map(item => {
            if (item.id === id) {
                return {...item, checked: val}
            } else return item
        })
        isMain ? setMainCheckboxes(newElements) : setCheckboxes(newElements)
    }
    const slidingRadioChange = (val, options) => {
        changeCanCount()
        if (options.length) {
            let items = options.map(item => {
                if (item.value === val) {
                    return {...item, active: true}
                } else return {...item, active: false}
            })
            setInputs(prevState => (
                {
                    ...prevState,
                    condition: {
                        ...prevState.condition,
                        options: [...items],
                        value: val
                    }
                }
            ))
        }

    }
    const inputChange = (e, input, isDouble = false, side = 'min') => {
        changeCanCount()
        let value = e.target.value;
        if (inputs[input].isNum) {
            if (!Number(value) && value.trim() !== '') {
                return;
            }
        }
        if (inputs[input].rules && inputs[input].rules.maxLength) {
            if (inputs[input].value[side].length === inputs[input].rules.maxLength) {
                value = value.slice(0, 4)
            }
        }
        let newInput;
        if (!isDouble) {
            newInput = {...inputs[input], value};
            setInputs(prevState => (
                {
                    ...prevState,
                    [input]: {...newInput}
                }
            ))
        } else {
            newInput = {...inputs[input], value: {...inputs[input].value, [side]: value}};
        }
        setInputs(prevState => (
            {
                ...prevState,
                [input]: {...newInput}
            }
        ))
    }
    const handleSelectChange = (value, input) => {
        changeCanCount()
        let shouldResetModel = false
        if (input === 'brand') {
            dispatch(getModels(parseInt(value)))
            dispatch(getModels(parseInt(value), true))
            shouldResetModel = true
        }
        setInputs(prevState => {
            let newInput = {...prevState[input], value}
            return {
                ...prevState,
                [input]: {...newInput},
                model: {
                    ...prevState.model,
                    value: shouldResetModel ? [] : prevState.model.value
                }
            }
        })
    }

    const selectAllOptions = (value, name) => {
        changeCanCount()
        setInputs(prev => {
            let prevInput = {...prev[name]}
            let newOptions = prevInput.options.map(item => {
                return {...item, checked: value}
            })
            if (value) {
                let newVal = newOptions.map(opt => opt.value)
                return {
                    ...prev,
                    [name]: {
                        ...prev[name],
                        options: [...newOptions],
                        value: [...newVal]
                    },
                }
            } else {
                return {
                    ...prev,
                    [name]: {
                        ...prev[name],
                        options: [...newOptions],
                        value: []
                    },
                }
            }


        })

    }

    const formSubmit = (brand) => {
        const params = {
            rideTypeId: inputs.condition.value === '0' ? '' : inputs.condition.value,
            BrandId: brand ? brand : inputs.brand.value === '0' ? '' : inputs.brand.value,
            Models: inputs.brand.value === '0' ? [] : inputs.model.value,
            MinYear: parseInt(inputs.year.value.min) || '',
            MaxYear: parseInt(inputs.year.value.max) || '',
            PriceMin: inputs.price.value.min,
            PriceMax: inputs.price.value.max,
            FuelTypeId: inputs.fuel.value === '0' ? '' : inputs.fuel.value,
            EngineMin: inputs.engineMin.value === '0' ? '' : inputs.engineMin.value,
            EngineMax: inputs.engineMax.value === '0' ? '' : inputs.engineMax.value,
            RideMin: parseInt(inputs.mileage.value.min) || '',
            RideMax: parseInt(inputs.mileage.value.max) || '',
            ProducerCountryId: inputs.country.value === '0' ? '' : inputs.country.value,
            Colors: inputs.color.value,
            AutoDesigns: inputs.bodyStyle.value === '0' ? [] : [inputs.bodyStyle.value],
            GearBoxId: inputs.transmission.value === '0' ? '' : inputs.transmission.value,
            CanCredit: mainCheckboxes[0].checked ? true : '',
            CanBarter: mainCheckboxes[1].checked ? true : '',
            CityId: inputs.city.value === '0' ? '' : inputs.city.value,
            SuppliesId: checkboxes.filter(cb => cb.checked).map(item => item.id),
            sortById: otherInputs.sort.value
        }
        dispatch(getSearchResultFilter(params))
        dispatch(getUrgentListingsFilter(params))
        dispatch(getPlatListingsFilter(params))
    }
    useEffect(() => {
        canCount && getFilterResultCount()
    }, [canCount, inputs, otherInputs, mainCheckboxes, checkboxes])
    useEffect(() => {
        let allModels = []
        if (props.query.brandId && !gotModels) {
            dispatch(getModels(parseInt(props.query.brandId)))
            dispatch(getModels(parseInt(props.query.brandId), true))
            setGotModels(true)
        }

        models.forEach(trim => {
            if (trim.models) {
                trim.models.forEach(model => {
                    allModels.push({title: model.name, value: model.id, checked: false})
                })
            } else allModels.push({title: trim.name, value: trim.id, checked: false})
        })

        // dispatch(getSearchResultSuccess(props.listings))

        setInputs(prev => (
            {
                ...prev,
                model: {
                    ...prev.model,
                    options: [...allModels],
                    optionsParsed: [...models],
                    // popular: []
                    popular: [...popularModels]
                }
            }
        ))
    }, [models, popularModels])
    useEffect(() => {
        formSubmit()
        setShouldSubmit(true)
    }, [removedTags])
    useEffect(() => {
        if (router.query.brandId) {
            setInputs(prevState => {
                return {
                    ...prevState,
                    brand: {
                        ...prevState.brand,
                        value: +router.query.brandId
                    }
                }
            })
        }
        if (shouldSubmit) {
            formSubmit(+router.query.brandId)
        }
    }, [router.query])
    useEffect(() => {
        if (sorted) {
            formSubmit()
            setPage(2)
        }
    }, [otherInputs, sorted])

    return (
        <div className={`${css.home} page-content ${searchbarOpen ? css.homeActive : ''} pt-40`}>
            <Head>
                <title>
                    Treo - Avtomobillər
                </title>
            </Head>
            {
                searchFocused ? <Blur/> : null
            }
            <GrayBackdrop/>
            <div className="custom-container">

                <div className={'mb-14'}>
                    <div className="d-flex gray-txt txt--sm align-center">
                        <Link href={'/'}>
                            <a className={'gray-txt txt--sm'}>
                                Əsas səhifə
                            </a>
                        </Link>
                        {
                            props.query.brandId && (
                                <>
                                    <span className={'gray-txt txt mx-5'}>—</span>
                                    <Link href={'/dealerships'} shallow>
                                        <a className={'gray-txt txt--sm'}>
                                            {inputs.brand.options.find(opt => opt.value.toString().trim() === props.query.brandId.toString().trim())?.title}
                                        </a>
                                    </Link>
                                </>
                            )
                        }

                    </div>
                </div>
                <div className={`row align-center`}>
                    <div className={`col-lg-9`}>

                    </div>
                    <div className={`col-lg-3 invisible-md`}>

                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-9 pb-100">
                        {
                            props.query.brandId && (
                                <p className={'card-title bold-txt'}>
                                    {inputs.brand.options.find(opt => opt.value.toString().trim() === props.query.brandId.toString().trim())?.title}
                                </p>
                            )
                        }
                        <SearchPanel handleSelectChange={handleSelectChange}
                                     inputChange={inputChange}
                                     slidingRadioChange={slidingRadioChange}
                                     checkboxChange={checkboxChange}
                                     changeMultiSelectChecked={changeMultiSelectChecked}
                                     selectAllOptions={selectAllOptions}
                                     inputs={inputs}
                                     checkboxes={checkboxes}
                                     mainCheckboxes={mainCheckboxes}
                                     deleted={deletedInput}
                                     filterCount={filterCount}
                                     formSubmit={formSubmit}
                        />
                        <div className="pt-10 pb-20 invisible visible-md">
                            <div className={`d-flex justify-between align-end pb-15`}>
                                <div className="d-flex align-end bold-txt">
                                    <Image src={fire} alt={'Urgent'}/>
                                    <span className={'red-txt ml-10'}>
                                        Təcili satılır
                                    </span>
                                </div>
                                <Link href={'/auto/urgent'}>
                                    <a>
                                        <span className={'gray-txt'}>Hamısı</span>
                                    </a>
                                </Link>
                            </div>
                            <UrgentItems listings={urgentListingsFilter} mobile/>
                        </div>
                        <div>
                            {
                                !!tags.length && (
                                    <div className={`d-flex align-center justify-between ${tags.length > 0 ? css.home__sectionHead : ''}`}>
                                        {
                                            tags.length > 0 ? (
                                                    <div className={`d-flex align-center w-100 ${css.home__tagsWrapper}`}>
                                                        {
                                                            tags.map(tag => (
                                                                <div key={tag.id} className={'filter-tag mb-10'}>
                                                                    <p>
                                                                        {tag.title}
                                                                    </p>
                                                                    <FontAwesomeIcon onClick={() => {
                                                                        handleTagRemove(tag.id, tag.input, tag.value, tag.type)
                                                                    }} className={'filter-tag__icon'}
                                                                                     icon={['far', 'times-circle']}/>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>

                                                )
                                                :
                                                <span></span>

                                        }

                                        <div>
                                            <div className="d-flex align-center">
                                        <span className={'invisible-md'}>
                                          Sıralama:
                                        </span>
                                                <div className={`${css.home__sortWrapper}`}>
                                                    <Select color={'gray'} classes={'py-3 pl-10'} change={(value) => {
                                                        handleOtherSelectChange(value, 'sort')
                                                    }} data={otherInputs.sort}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div>
                            {
                                platinumListingsFilter.length ?
                                    <>
                                        <div
                                            className={`d-flex align-center justify-between py-30 ${tags.length > 0 ? css.home__sectionHead : ''}`}>
                                            <p className={'section-title section-title--red bold-txt'}>
                                                Platinum elanlar
                                            </p>
                                            <div>
                                                {
                                                    (platinumListingsFilter.length && !tags.length) &&
                                                    <div className="d-flex align-center">
                                        <span className={ 'invisible-md' }>
                                          Sıralama:
                                        </span>
                                                        <div className={ `${ css.home__sortWrapper }` }>
                                                            {/*<select className="custom-input custom-input--light-bg py-13 px-16">
                                                <option value="0">
                                                    Tarix üzrə
                                                </option>
                                                <option value="1">
                                                    Qiymət üzrə
                                                </option>
                                            </select>*/ }
                                                            <Select color={ 'gray' } classes={ 'py-3 pl-10' } change={ (value) => {
                                                                handleOtherSelectChange(value, 'sort')
                                                            } } data={ otherInputs.sort } />
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <>
                                            <div className="row">
                                                {
                                                    platinumListingsFilter ?
                                                        platinumListingsFilter.map(data => {
                                                            return <div key={generateGuid()}
                                                                        className={`col-lg-4 col-md-4 col-sm-6 col-6 mb-30 ${css.home__saleWrapper}`}>
                                                                <SaleCard hasShadow={false} data={data} hasFav={true}/>
                                                            </div>
                                                        })
                                                        :
                                                        <p>empty</p>
                                                }
                                            </div>
                                            {
                                                platPaginate &&
                                                <div className='w-100 mt-5'>
                                                    <Button click={() => onShowMorePlat()} inverted={true}
                                                            color={'primary'} classes={'w-100'}>
                                                        Daha çox göstərmək
                                                    </Button>
                                                </div>
                                            }

                                        </>
                                    </>
                                    :
                                    null
                            }


                        </div>
                        <div className={`py-30`}>
                            <div className={`d-flex align-center justify-between ${tags.length > 0 ? css.home__sectionHead : ''}`}>
                                <p className={'section-title bold-txt'}>
                                    Axtarış nəticələri
                                </p>
                                <div>
                                    {
                                        (!platinumListingsFilter.length && !tags.length) &&
                                        <div className="d-flex align-center">
                                        <span className={ 'invisible-md' }>
                                          Sıralama:
                                        </span>
                                            <div className={ `${ css.home__sortWrapper }` }>
                                                {/*<select className="custom-input custom-input--light-bg py-13 px-16">
                                                <option value="0">
                                                    Tarix üzrə
                                                </option>
                                                <option value="1">
                                                    Qiymət üzrə
                                                </option>
                                            </select>*/ }
                                                <Select color={ 'gray' } classes={ 'py-3 pl-10' } change={ (value) => {
                                                    handleOtherSelectChange(value, 'sort')
                                                } } data={ otherInputs.sort } />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            {
                                searchResult.length ?
                                    <>
                                        <div className="row pt-30">
                                            {
                                                searchResult ?
                                                    searchResult.map(data => {
                                                        return <div key={generateGuid()}
                                                                    className={`col-lg-4 col-md-4 col-sm-6 col-6 mb-30 ${css.home__saleWrapper}`}>
                                                            <SaleCard hasShadow={false} data={data} hasFav={true}/>
                                                        </div>
                                                    })
                                                    :
                                                    <p>empty</p>
                                            }
                                        </div>
                                        {
                                            searchPaginate &&
                                            <div className='w-100 mt-5'>
                                                <Button click={onShowMore} inverted={true} color={'primary'}
                                                        classes={'w-100'}>
                                                    Daha çox göstərmək
                                                </Button>
                                            </div>
                                        }

                                    </>
                                    :
                                    null
                            }

                        </div>
                    </div>
                    <div className="col-lg-3 invisible-md">
                        <FloatingPanel>
                            <div className={`d-flex justify-between align-end py-16`}>
                                <div className="d-flex align-end bold-txt">
                                    <Image src={fire} alt={'Urgent'}/>
                                    <span className={'red-txt ml-10 medium-txt'}>
                                        Təcili satılır
                                    </span>
                                </div>
                                <Link href={'/auto/urgent'}>
                                    <a>
                                        <span className={'gray-txt'}>Hamısı</span>
                                    </a>
                                </Link>
                            </div>
                            <div className={'invisible-md'}>
                                <UrgentItems listings={urgentListingsFilter}/>
                            </div>
                            <div className="mt-40 invisible-md">
                                <p className={'txt--sm gray-txt text-center mb-20'}>
                                    Sosial şəbəkələrimiz
                                </p>
                                <div className={`d-flex justify-between px-25 mb-50`}>
                                    {
                                        SocialLinksConfig.map(data => {
                                            return <SocialLink key={data.url + data.icon + data.bg} data={data}/>
                                        })
                                    }
                                </div>
                                <div>
                                    {
                                        footerLinks.map(link => (
                                            <Link key={link.url + link.title} href={link.url}>
                                                <a className={'gray-txt medium-txt mb-20 d-block text-center'}>
                                                    {link.title}
                                                </a>
                                            </Link>
                                        ))
                                    }
                                </div>
                                <div className={'pt-20'}>
                                    <p className={'gray-txt gray-txt--light text-center'}>
                                        © «Treo», 2023
                                    </p>
                                </div>
                            </div>
                        </FloatingPanel>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Auto;
