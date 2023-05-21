import React, {useEffect, useState} from 'react';
import PublishLayout from "../../../src/core/layouts/publish";
import css from './exterior.module.scss'
import publishCss from '../publish.module.scss'
import Image from "next/image";
import {carBodyConfig} from "../../../src/core/configs/car-body.config";
import {changeInputValue, generateGuid} from "../../../src/core/helpers/common-functions";
import YearSelect from "../../../src/core/shared/form-elements/year-select";
import Button from "../../../src/core/shared/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import toyota from "../../../src/assets/images/brands/toyota.png";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import ResetPublish from "../../../src/core/shared/reset-publish";
import * as services from "../../../src/services";
import {exteriorSelect} from "../../../src/store/actions/publish-actions";
import PublishGoBack from "../../../src/core/shared/publish-go-back";
import Head from "next/head";

export async function getServerSideProps(context) {
    const filters = await services.getFilters().then(res => res.filters)
    const bodyStyles = filters.autoDesigns || []
    const colors = filters.colors || []
    // const models = await axios.get(endpoints.models).then(res => res.data)
    // const popularModels = await axios.get(endpoints.popularModels).then(res=>res.data)
    return {
        props: {
            bodyStyles,
            colors,
        }
    }
}

function Exterior(props) {
    const stepId = 2
    const router = useRouter()
    const dispatch = useDispatch()
    const steps = useSelector(({publish}) => publish.steps)

    const [carTypes, setCarTypes] = useState([...props.bodyStyles.map((item, index) => ({
        name: item.code,
        isActive: index === 0,
        id: item.id,
        bodyName: item.name
    }))]);
    const [activeType, setActiveType] = useState(props.bodyStyles[0].id)
    const [colors, setColors] = useState([
        ...props.colors.map(({color, id, hexCode}) => ({
            name: color,
            color: hexCode || '#000',
            id,
        }))
    ])
    const [selectedColor, setSelectedColor] = useState(null)
    const [year, setYear] = useState(null)
    const [form, setForm] = useState({
        inputs: {
            vin: {
                type: 'text',
                label: 'VİN kod',
                placeholder: 'VİN kod',
                value: '',
                isNum: true,
                rules: {
                    maxLength: {
                        value: 17,
                        errorText: 'VİN kod 17 simvoldan ibarət olmalıdır'
                    }     ,
                    minLength: {
                        value: 17,
                        errorText: 'VİN kod 17 simvoldan ibarət olmalıdır'
                    }

                },
                currentErrTxt: 'VİN kod 17 simvoldan ibarət olmalıdır',
                touched: false,
                isValid: false
            },
        },
        formValid: false,
    })

    const setActiveBody = (id) => {
        setCarTypes(prevState => (prevState.map(item => {
            if (item.id === id) {
                return {...item, isActive: true}
            }
            return {...item, isActive: false}
        })))
        setActiveType(id)
    }
    const selectColor = (id) => {
        setSelectedColor(id)
    }
    const selectYear = (year) => {
        setYear(year)
    }
    const checkValid = () => {
        let valid = true
        valid = selectedColor && valid;
        valid = year && valid;
        // valid = form.formValid && valid
        return valid
    }
    const handleNext = () => {
        if (checkValid()) {
            const payload = {
                autoDesignId: parseInt(activeType),
                colorId: parseInt(selectedColor),
                releaseYear: year.toString(),
                vinCode: form.inputs.vin.value
            }
            dispatch(exteriorSelect(payload))
        }

    }

    useEffect(() => {
        const prevStep = steps[stepId - 1]
        if (!prevStep.done) {
            router.push(prevStep.route)
        }

        const thisStep = steps[stepId]
        if (thisStep.done) {
            setActiveType(thisStep.value.autoDesignId);
            setSelectedColor(thisStep.value.colorId || null);
            setYear(+thisStep.value.releaseYear || null);
            changeInputValue({target: {value: thisStep.value.vinCode}}, 'vin', form.inputs, setForm);
        }
    }, [steps])

    return (
        <PublishLayout onNext={handleNext}>
            <Head>
                <title>
                    Treo - Avtomobilin eksteryeri
                </title>
            </Head>
            <div className={'mt-50'}>
                <div className={'d-flex justify-between align-center'}>
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
                    </div>
                    <div>
                        <ResetPublish/>
                    </div>
                </div>
                <div>
                    <div className={'pt-50 pt-md-20 pb-5 border-bottom border-bottom--soft'}>
                        <p className={`publish-section-title txt--xxl medium-txt mb-50 mb-md-25`}>
                            Ban növü
                        </p>
                        <div>
                            <div className="d-flex wrap">
                                {
                                    carTypes.map((body, index) => {
                                        const {icon, activeIcon} = carBodyConfig(body.name)
                                        return (
                                            <div className={'col-3 col-lg-2 col-md-3 col-sm-4 pb-30'} key={generateGuid()}>
                                                <div
                                                    className={`${css.carBody} text-center`}
                                                    onClick={() => {
                                                        setActiveBody(body.id)
                                                    }}
                                                >
                                                    <Image className={'w-100'} src={body.isActive ? activeIcon : icon} alt=""/>
                                                    <p className={`${body.isActive ? 'green-txt' : 'gray-txt'}`}>
                                                        {body.bodyName}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className={'py-15 border-bottom border-bottom--soft'}>
                        <p className={'publish-section-title txt--xxl medium-txt mb-25 mb-md-14'}>
                            Rəng
                        </p>
                        <div>
                            <div className="d-flex align-center wrap">
                                {
                                    colors.map((item, index) => {
                                        const {color, id, name} = item
                                        return (
                                            <div key={generateGuid()}
                                                 className={`${css.color}  ${color[0] === 'h' ? css.colorNoBorder : ''}`}
                                                 style={{background: color[0] === 'h' ? `url(${color})` : color}}
                                                 onClick={() => {
                                                     setSelectedColor(id)
                                                 }}
                                            >
                                                <div
                                                    className={`tooltip ${id === selectedColor ? 'tooltip--visible' : ''}`}>
                                                    <p>
                                                        {name}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    </div>
                    <div className={'py-35 border-bottom border-bottom--soft'}>
                        <p className={'publish-section-title txt--xxl medium-txt mb-25 mb-md-14'}>
                            Buraxılış ili
                        </p>
                        <div>
                            <YearSelect change={selectYear} value={year}/>
                        </div>
                    </div>
                    <div className={'pt-35 pb-70'}>
                        <p className={'publish-section-title txt--xxl medium-txt mb-25 mb-md-14'}>
                            VİN kod
                            <span className={'publish-section-title ml-10 gray-txt txt txt--md normal-txt'}>(istəyə görə)</span>
                        </p>
                        <div>
                            <div className="row">
                                <div className="col-lg-6">
                                    <input autoComplete={'off'} onChange={(e) => {
                                        changeInputValue(e, 'vin', form.inputs, setForm)
                                    }}
                                           type={'text'}
                                           className={`custom-input`}
                                           value={form.inputs.vin.value}
                                        // onBlur={(e)=>{inputBlur(e,input, inputs, callback)}}
                                           placeholder={form.inputs.vin.placeholder}/>
                                    <span className={'err-txt'}>
                                {!form.inputs.vin.isValid && form.inputs.vin.touched ? form.inputs.vin.currentErrTxt : null}
                            </span>
                                </div>
                            </div>
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
            </div>
        </PublishLayout>
    );
}

export default Exterior;
