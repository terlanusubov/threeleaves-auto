import React, {useEffect, useState} from 'react';
import css from './index.module.scss'
import GrayBackdrop from "../src/core/shared/gray-backdrop";
import fire from '../src/assets/images/fire.svg'
import Image from "next/image";
import Link from "next/link";
import SearchPanel from "../src/core/shared/search-panel";
import UrgentItems from "../src/core/shared/urgent-items";
import SocialLink from "../src/core/shared/social-link";
import {SocialLinksConfig} from "../src/core/configs/social-links.config";
import SaleCard from "../src/core/shared/listing/sale-card";
import {createOptionsRange, generateGuid} from "../src/core/helpers/common-functions";
import Button from "../src/core/shared/button";
import Select from "../src/core/shared/form-elements/select-elements/select";
import {
    getFilterCount, getLatestList,
    getModels, getPlatinumList,
    removeTag, resetLists
} from "../src/store/actions/home-actions";
import {useDispatch, useSelector} from "react-redux";
import Blur from "../src/core/shared/blur";
import * as services from '../src/services/index'
import {useRouter} from "next/router";
import FloatingPanel from "../src/core/shared/floating-panel";
import Head from "next/head";
export async function getServerSideProps(context) {
    const [filters] = await Promise.all([
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
    const currencies = filters.currencies || []
    const cities = filters.cities.sort((a, b) => a.name.localeCompare(b.name)) || []
    // const models = await axios.get(endpoints.models).then(res => res.data)
    // const popularModels = await axios.get(endpoints.popularModels).then(res=>res.data)
    return {
        props: {
            // platinumListings,
            // latestListings,
            filters,
            brands,
            transmissions,
            bodyStyles,
            colors,
            countries,
            fuel,
            equipment,
            conditions,
            cities,
            currencies
        }
    }
}

function Home(props) {
    //REDUX
    const dispatch = useDispatch()
    const tags = useSelector(({home}) => home.tags)
    const searchFocused = useSelector(({publicState}) => publicState.searchFocused)
    const searchbarOpen = useSelector(({publicState}) => publicState.searchOpen)
    const filterCount = useSelector(({home}) => home.filterCount)
    const models = useSelector(({home}) => home.models)
    const popularModels = useSelector(({home}) => home.popularModels)

    const latestList = useSelector(({home}) => home.latestListings)
    const platinumList = useSelector(({home}) => home.platinumListings)
    const platPaginate = useSelector(({home}) => home.shouldPaginatePlat)
    const latestPaginate = useSelector(({home}) => home.shouldPaginateLatest)
    // const urgentList = useSelector(({home}) => home.popularModels)
    const router = useRouter()
    //STATE
    // const [latestList, setLatestList] = useState(props.latestListings)
    // const [platinumList, setPlatinumList] = useState(props.platinumListings)
    const [page, setPage] = useState(1)
    const [platPage, setPlatPage] = useState(1)
    const [footerLinks, setFooterLinks] = useState([
        {title: 'Avtosalonlar', url: '/dealerships'},
        {title: 'Qaydalar', url: 'https://user.treo.az/rules'},

        // {title: 'Reklamın yerləşdirilməsi', url: '/ad'}
    ])
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
    const [sorted, setSorted] = useState(false)
    const [inputs, setInputs] = useState({
        condition: {
            value: '0',
            options: [
                {title: 'Hamısı', value: '0', active: true},
                {title: 'Yeni', value: '1', active: false},
                {title: 'Yürüş ilə', value: '2', active: false},
                // ...props.conditions.map(({name, id}) => ({title: name, value: id, active: false}))
            ],
        },
        city: {
            type: 'select',
            value: '0',
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
            value: '0',
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
            value: [],
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
            value: {min: '', max: ''},
            tagPre: 'İl',
            defaults: {max: new Date().getFullYear(), min: '1600'},
            rules: {maxLength: 4}
        },
        price: {
            type: 'range',
            isNum: true,
            tagPre: 'Qiymət',
            defaults: {max: 'X', min: '0'},
            value: {min: '', max: ''}
        },

        currency: {
            value: props.currencies[0]?.id,
            options: [
                ...props.currencies.map(({icon, id}) => ({title: icon, value: id}))

            ]
        },
        mileage: {
            type: 'range',
            isNum: true,
            tagPre: 'Yürüş',
            defaults: {max: 'X', min: '0'},
            value: {min: '', max: ''}
        },
        // engine: {
        //     type: 'range',
        //     isNum: true,
        //     tagPre: 'Mühərrik',
        //     defaults: {max: 'X', min: '0'},
        //     value: {min: '', max: ''}
        // },
        engineMin: {
            tagPre: 'Mühərrik',
            type: 'select',
            value: '0',
            placeholder: "Mühərrik min",
            options: [
                // {title: 'Bütün illər', value: '0'},
                {title: 'Həcm, sm3', value: '0'},

                ...createOptionsRange(100, 18000, 100)
            ],
            tagField: {type: 'min', field: 'engine'}
        },
        engineMax: {
            tagPre: 'Mühərrik',
            type: 'select',
            value: '0',
            placeholder: "maks.",
            options: [
                // {title: 'Bütün illər', value: '0'},
                {title: 'Həcm, sm3', value: '0'},

                ...createOptionsRange(100, 18000, 100)

            ],
            tagField: {type: 'max', field: 'engine'}
        },
        transmission: {
            placeholder: 'Sürətlər qutusu',
            type: 'select',
            value: '0',
            options: [
                {title: 'Sürətlər qutusu', value: '0'},
                ...props.transmissions.map(({name, id}) => ({title: name, value: id}))
            ]
        },
        bodyStyle: {
            placeholder: 'Ban növü',
            type: 'select',
            value: '0',
            options: [
                {title: 'Ban növu', value: '0'},
                ...props.bodyStyles.map(({name, id}) => ({title: name, value: id}))

            ]
        },
        color: {
            name: 'color',
            type: 'multi-select',
            value: [],
            placeholder: 'Rəng',
            options: [
                // {title: 'Qırmızı', value: 'col00001', hex: '#BC0000', checked: false},
                ...props.colors.map(({color, id, hexCode}) => ({
                    title: color,
                    value: id,
                    hex: hexCode || '#0000',
                    checked: false
                }))

            ]
        },
        fuel: {
            placeholder: 'Yanacaq növü',
            type: 'select',
            value: '0',
            options: [
                {title: 'Yanacaq növü', value: '0'},
                ...props.fuel.map(({name, id}) => ({title: name, value: id}))

            ]
        },
        country: {
            type: 'select',
            placeholder: 'İstehsalçı ölkə',
            value: '0',
            options: [
                {title: 'İstehsalçı ölkə', value: '0'},
                ...props.countries.map(({name, id}) => ({title: name, value: id}))

            ]
        }
    })
    const [mainCheckboxes, setMainCheckboxes] = useState([
        {
            id: 'test0',
            label: 'Kredit',
            checked: false,
        },
        {
            id: 'test00',
            label: 'Barter',
            checked: false,
        },
    ])
    const [checkboxes, setCheckboxes] = useState([
        ...props.equipment.map(({id, name}) => ({
            id: id,
            label: name,
            checked: false,
        }))
    ])
    const [canCount, setCanCount] = useState(false)

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
        changeCanCount()
        setSorted(true)
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
    }
    const onShowMore = (section) => {
        switch (section) {
            case 'platinum' :
                dispatch(getPlatinumList({page: platPage, sortById: +otherInputs.sort.value}))
                setPlatPage(prev => prev + 1)
                break;
            case 'latest' :
                dispatch(getLatestList({page, sortById: +otherInputs.sort.value}))
                setPage(prev => prev + 1)
                break;
            default :
                break;
        }
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
    const handleRangeChange = (value, input) => {
        changeCanCount()

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

    const formSubmit = () => {
        const params = {
            // AdTypeId : '',
            // RideTypeId: inputs.condition.value,
            rideTypeId: inputs.condition.value === '0' ? '' : inputs.condition.value,
            brandId: inputs.brand.value === '0' ? '' : inputs.brand.value,
            models: inputs.brand.value === '0' ? [] : inputs.model.value,
            minYear: parseInt(inputs.year.value.min) || '',
            maxYear: parseInt(inputs.year.value.max) || '',
            priceMin: inputs.price.value.min,
            priceMax: inputs.price.value.max,
            FuelTypeId: inputs.fuel.value === '0' ? '' : inputs.fuel.value,
            // engineMin: inputs.engine.value.min,
            // engineMax: inputs.engine.value.max,
            engineMin: inputs.engineMin.value === '0' ? '' : inputs.engineMin.value,
            engineMax: inputs.engineMax.value === '0' ? '' : inputs.engineMax.value,
            rideMin: parseInt(inputs.mileage.value.min) || '',
            rideMax: parseInt(inputs.mileage.value.max) || '',
            producerCountryId: inputs.country.value === '0' ? '' : inputs.country.value,
            colors: inputs.color.value,
            autoDesigns: inputs.bodyStyle.value === '0' ? [] : [inputs.bodyStyle.value],
            gearBoxId: inputs.transmission.value === '0' ? '' : inputs.transmission.value,
            canCredit: mainCheckboxes[0].checked ? true : '',
            canBarter: mainCheckboxes[1].checked ? true : '',
            cityId: inputs.city.value === '0' ? '' : inputs.city.value,
            suppliesId: checkboxes.filter(cb => cb.checked).map(item => item.id)
        }
        const query = {}
        for (let key in params) {
            if (!Array.isArray(params[key])) {
                if (params[key] !== '') {
                    query[key] = params[key]
                }
            } else {
                if (params[key].length !== 0) {
                    query[key] = params[key]
                }
            }

        }

        router.push({
            pathname: '/auto',
            query
        })

    }

    useEffect(() => {
        canCount && getFilterResultCount()
    }, [canCount, inputs, otherInputs, mainCheckboxes, checkboxes])
    useEffect(() => {
        let allModels = []
        models.forEach(trim => {
            if (trim.models){
                trim.models.forEach(model => {
                    allModels.push({title: model.name, value: model.id, checked: false})
                })
            }
            else allModels.push({title: trim.name, value : trim.id, checked : false})
        })

        if (page === 1) {
            dispatch(resetLists())
            dispatch(getLatestList({page}))
            setPage(2)
        }

        if (platPage === 1) {
            dispatch(resetLists())
            dispatch(getPlatinumList({page: platPage}))
            setPlatPage(2)
        }

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
        if (sorted) {
            dispatch(resetLists())
            dispatch(getPlatinumList({page: 1, sortById: +otherInputs.sort.value}))
            dispatch(getLatestList({page: 1, sortById: +otherInputs.sort.value}))
            setPage(2)
            setPlatPage(2)
        }
    }, [otherInputs, sorted])

    return (
        <div className={`${css.home} page-content ${searchbarOpen ? css.homeActive : ''} pt-40`}>
            <Head>
                <title>
                    Treo
                </title>
            </Head>
            {
                searchFocused ? <Blur/> : null
            }
            <GrayBackdrop/>
            <div className="custom-container">
                <div className="row">
                    <div className="col-lg-9 pb-100">
                        <span className={`${css.home__searchPanelTitle} px-30 py-20 txt--lg bold-txt`}>Axtarış</span>
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
                            <UrgentItems mobile/>
                        </div>
                        <div className={`py-30`}>
                            <div className={`d-flex align-center justify-between ${tags.length > 0 ? css.home__sectionHead : ''}`}>
                                {
                                    platinumList.length ?
                                        <p className={'section-title section-title--red bold-txt'}>
                                            Platinum elanlar
                                        </p>
                                        :
                                        <span></span>
                                }

                                <div>
                                    <div className="d-flex align-center">
                                        <span className={'invisible-md'}>
                                          Sıralama:
                                        </span>
                                        <div className={`${css.home__sortWrapper}`}>
                                            {/*<select className="custom-input custom-input--light-bg py-13 px-16">
                                                <option value="0">
                                                    Tarix üzrə
                                                </option>
                                                <option value="1">
                                                    Qiymət üzrə
                                                </option>
                                            </select>*/}
                                            <Select color={'gray'} classes={'py-3 pl-10'} change={(value) => {
                                                handleOtherSelectChange(value, 'sort')
                                            }} data={otherInputs.sort}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                platinumList.length ?
                                    <>
                                        <div className="row pt-30">
                                            {
                                                platinumList ?
                                                    platinumList.map(data => {
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
                                                <Button click={() => onShowMore('platinum')} inverted={true}
                                                        color={'primary'} classes={'w-100'}>
                                                    Daha çox göstərmək
                                                </Button>
                                            </div>
                                        }

                                    </>
                                    :
                                    null
                            }

                        </div>
                        {
                            latestList.length ?
                                <div className="py-30">
                                    <div className="d-flex align-center justify-between">
                                        <p className={'section-title bold-txt'}>
                                            Son elanlar
                                        </p>
                                    </div>
                                    <div className="row pt-30">
                                        {
                                            latestList ?
                                                latestList.map(data => {
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
                                        latestPaginate &&
                                        <div className='w-100 mt-5'>
                                            <Button click={() => onShowMore('latest')} inverted={true} color={'primary'}
                                                    classes={'w-100'}>
                                                Daha çox göstərmək
                                            </Button>
                                        </div>
                                    }


                                </div>
                                :
                                null
                        }
                    </div>
                    <div className="col-lg-3">
                        <FloatingPanel className={'floating-panel floating-panel--scrollable pb-30'}>
                            <div className={`d-flex justify-between align-end py-16 invisible-md`}>
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
                                <UrgentItems/>
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


export default Home;
