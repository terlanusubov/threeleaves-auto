import React, {useEffect, useState} from 'react';
import PublishLayout from "../../../src/core/layouts/publish";
import Image from "next/image";
import {carBodyConfig} from "../../../src/core/configs/car-body.config";
import {
    changeInputValue,
    createOptionsRange,
} from "../../../src/core/helpers/common-functions";
import Select from "../../../src/core/shared/form-elements/select-elements/select";
import LineSelect from "../../../src/core/shared/form-elements/line-select";
import Button from "../../../src/core/shared/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ResetPublish from "../../../src/core/shared/reset-publish";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import * as services from "../../../src/services";
import RadioButton from "../../../src/core/shared/form-elements/radiobutton";
import toyota from "../../../src/assets/images/brands/toyota.png";
import { specsSelect} from "../../../src/store/actions/publish-actions";
import PublishGoBack from "../../../src/core/shared/publish-go-back";
import Head from "next/head";
import publishCss from "../publish.module.scss";

export async function getServerSideProps(context) {
    const filters = await services.getFilters().then(res => res.filters)
    const transmissions = filters.gearBoxes || []
    const countries = filters.producerCountries || []
    const fuel = filters.fuelTypes || []
    const units = filters.rideTypes || []
    const bodyStyles = filters.autoDesigns || []

    // const models = await axios.get(endpoints.models).then(res => res.data)
    // const popularModels = await axios.get(endpoints.popularModels).then(res=>res.data)
    return {
        props: {
            transmissions,
            countries,
            fuel,
            units,
            bodyStyles
        }
    }
}

function Specs(props) {
    const stepId = 3
    const router = useRouter()
    const dispatch = useDispatch()
    const steps = useSelector(({publish}) => publish.steps)

    const [country, setCountry] = useState({
        type: 'select',
        value: '0',
        name: 'city',
        placeholder: 'Ölkə',
        options: [
            {title: 'Ölkə', value: '0'},
            ...props.countries.map(({id, name}) => ({title: name, value: id}))
        ]
    })

    const [form, setForm] = useState({
        inputs: {
            mileage: {
                type: 'number',
                label: 'Yürüş',
                placeholder: 'Yürüş',
                value: '',
                isNum: true,
                rules: {
                    required: {
                        value: true,
                        errorText: 'Yürüş daxil edin'
                    },
                    regexp: {
                        value: /^\d+$/,
                        errorText: 'Yürüş rəqəm olmalıdır!'
                    },
                    maxLength : {
                        value : 6,
                        errorText: 'Yürüş maks. 6 rəqəmli ola bilər!'
                    }
                },
                currentErrTxt: 'Yürüş daxil edin',
                touched: false,
                isValid: false
            },
            power: {
                type: 'number',
                label: 'Güc, at gücü',
                placeholder: 'Güc, at gücü',
                value: '',
                isNum: true,
                rules: {
                    required: {
                        value: true,
                        errorText: 'Güc daxil edin'
                    },
                    regexp: {
                        value: /^\d+$/,
                        errorText: 'Güc rəqəm olmalıdır!'
                    },
                    maxLength : {
                        value : 4,
                        errorText: 'At gücü maks. 4 rəqəmli ola bilər!'
                    }
                },
                currentErrTxt: 'Güc daxil edin',
                touched: false,
                isValid: false
            },
            displacement: {
                type: 'text',
                label: 'Həcm, sm3',
                placeholder: 'Həcm, sm3',
                value: '0',
                options: [
                    {title: 'Həcm, sm3', value: '0'},
                    ...createOptionsRange(100, 18000, 100)
                ],
                rules: {
                    required: {
                        value: true,
                        errorText: 'Güc daxil edin'
                    },
                    regexp: {
                        value: /^\d+$/,
                        errorText: 'Güc rəqəm olmalıdır!'
                    },
                },
                currentErrTxt: 'Güc daxil edin',
                touched: false,
                isValid: false
            },
            country: {
                type: 'text',
                label: 'Ölkə',
                placeholder: 'Ölkə',
                value: '0',
                options: [
                    {title: 'Ölkə', value: '0'},
                    ...props.countries.map(({id, name}) => ({title: name, value: id.toString()}))
                ],
                rules: {
                    required: {
                        value: true,
                        errorText: 'Ölkə seçin'
                    }
                },
                currentErrTxt: 'Ölkə seçin',
                touched: false,
                isValid: false
            },
        },
        formValid: false,
    })


    const [mileage, setMileage] = useState({
        type: 'text',
        value: '',
        name: 'mileage',
        placeholder: 'Yürüş',
    })

    const [power, setPower] = useState({
        type: 'text',
        value: '',
        name: 'mileage',
        placeholder: 'Yürüş',
    })

    const [checkboxes, setCheckboxes] = useState([
        ...props.units.map(({name, id}, index) => ({
            id: name + id,
            label: name,
            checked: index === 0,
            value: id
        }))
    ])

    const [unit, setUnit] = useState(props.units[0].id)

    const [fuelTypes, setFuelTypes] = useState([
        ...props.fuel.map(({id, name}) => ({id, name}))
        // {
        //     id: 0,
        //     name: 'Benzin'
        // },
        // {
        //     id: 1,
        //     name: 'Dizel'
        // },
        // {
        //     id: 2,
        //     name: 'Hibrid'
        // },
        // {
        //     id: 3,
        //     name: 'Gaz'
        // },
        // {
        //     id: 4,
        //     name: 'Elektrik'
        // },
        // {
        //     id: 5,
        //     name: 'Plug in Hibrid'
        // }
    ])

    const [fuel, setFuel] = useState(fuelTypes[0])

    const [gearboxTypes, setGearboxTypes] = useState([
        ...props.transmissions.map(({name, id}) => ({name, id}))
    ])

    const [gearbox, setGearbox] = useState(gearboxTypes[0])

    const unitChange = (id) => {
        setUnit(parseInt(id))
    }

    const lineSelectChange = (state, id, callback) => {
        const val = state.find(el => el.id === id)
        callback(val || null)
    }

    const handleNext = () => {
        if (form.formValid) {
            const payload = {
                producerCountryId: parseInt(form.inputs.country.value),
                ride: form.inputs.mileage.value,
                rideTypeId: unit,
                fuelTypeId: fuel.id,
                gearBoxId: gearbox.id,
                horsePower: form.inputs.power.value,
                engine: form.inputs.displacement.value
            }
            dispatch(specsSelect(payload))
        }
        touchInputs(['mileage', 'power', 'displacement', 'country'])

    }

    const touchInputs = (keys) => {
        setForm(prev => {
            let inputs = {...prev.inputs}
            if (Array.isArray(keys)) {
                keys.forEach(key => {
                    inputs[key].touched = true
                })
            }
            else inputs[keys].touched = true
            return {
                ...prev,
                inputs
            }
        })
    }

    useEffect(() => {
        const prevStep = steps[stepId - 1]
        if (!prevStep.done) {
            router.push(prevStep.route)
        }
        const thisStep = steps[stepId]
        if (thisStep.done) {
            const {producerCountryId, ride, rideTypeId, fuelTypeId, gearBoxId, horsePower, engine} = thisStep.value
            changeInputValue({target: {value: producerCountryId.toString()}}, 'country', form.inputs, setForm)
            changeInputValue({target: {value: ride}}, 'mileage', form.inputs, setForm)
            unitChange(rideTypeId)
            lineSelectChange(fuelTypes, fuelTypeId, setFuel)
            lineSelectChange(gearboxTypes, gearBoxId, setGearbox)
            changeInputValue({target: {value: engine}}, 'displacement', form.inputs, setForm)
            changeInputValue({target: {value: horsePower}}, 'power', form.inputs, setForm)
            setForm(prev => ({...prev, formValid: true}))
        }
    }, [])
    const body = carBodyConfig(props.bodyStyles.find(item => parseInt(item.id) === parseInt(steps[2]?.value?.autoDesignId))?.code)
    return (
        <PublishLayout onNext={handleNext}>
            <Head>
                <title>
                    Treo - Texniki göstəricilər
                </title>
            </Head>
            <div className={'mt-60'}>
                <div className={'d-flex justify-between align-center pb-25 border-bottom border-bottom--soft'}>
                    <div className={'d-flex align-center'}>
                        <div key={steps[0]?.name + steps[0]?.id} className='d-flex align-center'>
                            <div className={'publish-brand'}>

                            <img src={steps[0]?.value?.icon} alt=""/>
                            </div>
                            <span className={`${publishCss.publish__crumb} blue-txt bold-txt ml-10 ml-md-8`}>{steps[0]?.value?.name}</span>
                        </div>
                        <span className={'ml-10 ml-md-8 gray-txt gray-txt--light txt--xl'}>
                                /
                            </span>
                        <div className='d-flex align-center'>
                            <span className={'blue-txt bold-txt ml-10 ml-md-8'}>
                                <span className={`${publishCss.publish__crumb} blue-txt bold-txt`}>{steps[1]?.value?.name}</span>
                            </span>
                        </div>
                        <span className={'ml-10 ml-md-8 gray-txt gray-txt--light txt--xl'}>
                                /
                            </span>
                        <div className='d-flex align-center'>
                            <span className={`${publishCss.publish__crumb} blue-txt bold-txt ml-10 ml-md-8`}>
                                {steps[2]?.value?.releaseYear}
                            </span>
                        </div>
                        <span className={`${publishCss.publish__crumb} ml-10 ml-md-8 gray-txt gray-txt--light txt--xl`}>
                                /
                            </span>
                        <div className='d-flex align-center'>
                            <span className={`${publishCss.publish__crumb} blue-txt bold-txt ml-10 ml-md-8`}>
                                {body?.nameAZ}
                            </span>
                        </div>
                    </div>
                    <div>
                        <ResetPublish/>
                    </div>
                </div>
            </div>
                <div className="row pt-35 pb-20 pt-md-24 border-bottom border-bottom--soft">
                    <div className="col-lg-6">
                        <p className={'publish-section-title txt--xxl medium-txt mb-25 mb-md-14'}>
                            İstehsalçı ölkə
                        </p>
                        <div>
                            <Select change={(value) => {
                                changeInputValue({target: {value}}, 'country', form.inputs, setForm)
                            }} data={form.inputs.country}/>
                            <span className={'err-txt'}>
                                {!form.inputs.country.isValid && form.inputs.country.touched ? form.inputs.country.currentErrTxt : null}
                            </span>
                        </div>
                    </div>
                </div>
            <div className={'py-35 py-md-24 border-bottom border-bottom--soft'}>
                <p className={'publish-section-title txt--xxl medium-txt mb-25 mb-md-14'}>
                    Yürüş
                </p>
                <div>
                    <div className="row align-center justify-between">
                        <div className={'col-lg-6'}>
                            <input type={form.inputs.mileage.type}
                                   className={'custom-input'}
                                   value={form.inputs.mileage.value}
                                   onChange={(e) => {
                                       changeInputValue(e, 'mileage', form.inputs, setForm)
                                   }}
                                   placeholder={form.inputs.mileage.placeholder}
                                   onWheel={(e) => e.target.blur()}
                            />
                            <span className={'err-txt'}>
                                {!form.inputs.mileage.isValid && form.inputs.mileage.touched ? form.inputs.mileage.currentErrTxt : null}
                            </span>
                        </div>
                        <div className="col-lg-6 mt-md-25">
                            <div className="d-flex" onChange={(e) => {
                                unitChange(e.target.value)
                            }}>
                                {
                                    checkboxes.map(({id, label, checked, value}) => {
                                        return (
                                            <div key={label + id} className="mr-30">
                                                <RadioButton
                                                    key={label + id + value}
                                                    id={id}
                                                    name={'account-type'}
                                                    value={value}
                                                    square
                                                    color={'b'}
                                                    label={label}
                                                    checked={checked}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className={'py-35 py-md-24 border-bottom border-bottom--soft'}>
                <p className={'publish-section-title txt--xxl medium-txt mb-25 mb-md-14'}>
                    Yanacaq növü
                </p>
                <LineSelect value={fuel} items={fuelTypes} change={(val) => {
                    lineSelectChange(fuelTypes, val, setFuel)
                }}/>
            </div>
            <div className={'py-35 py-md-24 border-bottom border-bottom--soft'}>
                <p className={'publish-section-title txt--xxl medium-txt mb-25 mb-md-14'}>
                    Sürətlər qutusu
                </p>
                <LineSelect value={gearbox} items={gearboxTypes} change={(val) => {
                    lineSelectChange(gearboxTypes, val, setGearbox)
                }}/>
            </div>
            <div className={'pb-75 pt-35 border-bottom border-bottom--soft'}>
                <p className={'publish-section-title txt--xxl medium-txt mb-25 mb-md-14'}>
                    Mühərrik
                </p>
                <div className={'row'}>
                    <div className="col-lg-6">
                        <Select
                            change={(value) => {
                                changeInputValue({target: {value}}, 'displacement', form.inputs, setForm)
                            }}
                            data={form.inputs.displacement}
                        />
                        <span className={'err-txt'}>
                                {!form.inputs.displacement.isValid && form.inputs.displacement.touched ? form.inputs.displacement.currentErrTxt : null}
                            </span>
                    </div>
                    <div className="col-lg-6">
                        <input type={form.inputs.power.type}
                               className={'custom-input'}
                               value={form.inputs.power.value}
                               onChange={(e) => {
                                   changeInputValue(e, 'power', form.inputs, setForm)
                               }}
                               placeholder={form.inputs.power.placeholder}
                        />
                        <span className={'err-txt'}>
                                {!form.inputs.power.isValid && form.inputs.power.touched ? form.inputs.power.currentErrTxt : null}
                            </span>
                    </div>
                </div>
            </div>
            <div className={'pb-100 invisible-md'}>
                <div className="row">
                    <div className="col-6">
                        <PublishGoBack/>
                    </div>
                    <div className="col-6">
                        <Button click={handleNext} color='primary' classes={'w-100'}>
                            <FontAwesomeIcon icon={'chevron-right'}/>
                            İrəli
                        </Button>
                    </div>
                </div>
            </div>

        </PublishLayout>

    );
}

export default Specs;
