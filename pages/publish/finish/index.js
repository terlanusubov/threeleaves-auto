import React, {useEffect, useMemo, useState} from 'react';
import Select from "../../../src/core/shared/form-elements/select-elements/select";
import Checkbox from "../../../src/core/shared/form-elements/checkbox";
import Button from "../../../src/core/shared/button";
import PublishLayout from "../../../src/core/layouts/publish";
import {
    changeInputValue,
    generateGuid,
    toFormData
} from "../../../src/core/helpers/common-functions";
import ResetPublish from "../../../src/core/shared/reset-publish";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {carBodyConfig} from "../../../src/core/configs/car-body.config";
import * as services from "../../../src/services";
import css from './finish.module.scss'
import {
    checkTransaction,
    finishAdd,
    getAdditionalPlans,
    onSubscribe,
    postAd
} from "../../../src/store/actions/publish-actions";
import Head from "next/head";
import {setLoader} from "../../../src/store/actions/public-actions";
import {errorToast} from "../../../src/core/shared/toast";
import PlanCard from "../../../src/core/shared/plan-card";
import Modal from "../../../src/core/shared/modal";
import RadioButton from "../../../src/core/shared/form-elements/radiobutton";

export async function getServerSideProps(context) {
    const filters = await services.getFilters().then(res => res.filters)
    const bodyStyles = filters.autoDesigns || []
    const currencies = filters.currencies || []

    return {
        props: {
            bodyStyles,
            currencies
        }
    }
}

function Finish(props) {
    const profile = useSelector(({profile}) => profile.profile)

    const [form, setForm] = useState({
        inputs: {
            currency: {
                type: 'text',
                label: '',
                placeholder: '',
                value: props.currencies[0].id.toString(),
                options: [
                    ...props.currencies.map(({name, id, icon}) => ({title: icon, value: id.toString()}))
                ],
                touched: false,
                isValid: true
            },
            price: {
                type: 'number',
                label: 'Qiymət',
                placeholder: 'Qiymət',
                value: '',
                isNum: true,
                rules: {
                    required: {
                        value: true,
                        errorText: 'Qiymət daxil edin'
                    },
                    regexp: {
                        value: /^\d+$/,
                        errorText: 'Qiymət rəqəm olmalıdır!'
                    },
                },
                currentErrTxt: 'Qiymət daxil edin',
                touched: false,
                isValid: false
            },
            name: {
                type: 'text',
                label: 'Ad Soyad',
                placeholder: 'Ad Soyad',
                value: '',
                rules: {
                    required: {
                        value: true,
                        errorText: 'Ad Soyad daxil edin'
                    }
                },
                currentErrTxt: 'Ad Soyad daxil edin',
                touched: false,
                isValid: false
            },

        },
        formValid: false
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

    const steps = useSelector(({publish}) => publish.steps)
    const allValues = useSelector(({publish}) => publish.values)
    const additionalPlans = useSelector(({publish}) => publish.additionalPlans)


    const allPlans = useMemo(() => {
        return additionalPlans.filter(({isCreate}) => isCreate)
    }, [additionalPlans])

    const urgentPlanData = useMemo(() => {
        return additionalPlans.find(({id}) => id === 30)
    }, [additionalPlans])

    const platPlanData = useMemo(() => {
        return additionalPlans.find(({id}) => id === 20)
    }, [additionalPlans])

    const simplePlanData = useMemo(() => {
        return additionalPlans.find(({isSimple}) => isSimple)
    }, [additionalPlans])

    const stepId = 9
    const router = useRouter()
    const dispatch = useDispatch()
    const body = carBodyConfig(props.bodyStyles.find(item => parseInt(item.id) === parseInt(steps[2]?.value?.autoDesignId))?.code)

    useEffect(() => {
        const prevStep = steps[stepId - 1]
        if (!prevStep.done) {
            router.push(prevStep.route)
        }
    }, [router, steps])

    useEffect(() => {
        dispatch(getAdditionalPlans(10))
    }, [dispatch])

    useEffect(() => {
        // is profile isBusiness name is not required
        if (profile?.isBusiness) {
            setForm(prevState => {
                let newInputs = {...prevState.inputs}
                newInputs.name = {
                    ...newInputs.name,
                    rules: {},
                    isValid: true
                }
                return {
                    ...prevState,
                    inputs: newInputs
                }
            })
        }
    }, [profile])

    const checkboxChange = (val, id) => {
        let cb = mainCheckboxes;
        let newElements = cb.map(item => {
            if (item.id === id) {
                return {...item, checked: val}
            } else return item
        })
        setMainCheckboxes(newElements)
    }

    const handleNext = (transactionId) => {
        if (form.formValid) {
            let payload = {
                price: form.inputs.price.value,
                contactName: form.inputs.name.value,
                canBarter: mainCheckboxes[1].checked,
                canCredit: mainCheckboxes[0].checked,
                currencyId: form.inputs.currency.value,
            }
            dispatch(finishAdd(payload))
            let all = {
                ...allValues,
                ...payload,
            }
            if (transactionId) all['transactionId'] = transactionId
            delete all['brandId']
            const formData = toFormData(all)
            dispatch(postAd(formData))
        } else errorToast('Əvvəlcə məlumatları doldurun')

    }

    const onSelect = async (plan) => {
        if (form.formValid) {
            const {id: planId, children} = plan
            if (children && children.length) {
                changeModalVisibility(true, children)
            }
        } else errorToast('Əvvəlcə məlumatları doldurun')
    }

    const onPlaceOrder = async (plan) => {
        if (modalValue && form.formValid) {
            const transactionId = generateGuid()
            const planId = plan ? +plan.id : +modalValue
            const paymentUrl = await dispatch(onSubscribe({planId, transactionId}))
            const x = window.innerWidth / 2 + window.screenX - (700 / 2);
            const popup = window.open(paymentUrl, '_blank', `fullscreen=no,top=${0},left=${x}`)
            dispatch(setLoader(true))
            let timePassed = 0;
            const interval = setInterval(async () => {
                const statusResult = await dispatch(checkTransaction(transactionId))
                timePassed += 3000;
                if (!!statusResult.status || timePassed >= 240000) {
                    clearInterval(interval)
                    setTimeout(() => {
                        dispatch(setLoader(false))
                        popup.close()
                        changeModalVisibility(false)
                        if (!!statusResult.paymentStatus) {
                            handleNext(transactionId)
                        } else errorToast('Ödəmə uğursuz oldu')
                    }, 3000)
                }
            }, 3000)
        }
    }

    const [modal, setModal] = useState(false)
    const [modalValue, setModalValue] = useState(null)
    const [modalInputs, setModalInputs] = useState([])
    const changeModalVisibility = (val, inputs) => {
        setModal(val)
        if (inputs && inputs.length) {
            setModalInputs(inputs)
            setModalValue(inputs[0].id)
        } else {
            setModalInputs([])
            setModalValue(null)
        }
    }
    return (
        <PublishLayout onNext={() => handleNext()}>
            <Head>
                <title>
                    Treo - Elanı yerləşdir
                </title>
            </Head>
            <div className={'mt-60'}>
                <div className={'d-flex justify-between align-center pb-25 border-bottom border-bottom--soft pb-md-0'}>
                    <div className={'d-flex align-center'}>
                        <div key={steps[0]?.name + steps[0]?.id} className='d-flex align-center'>
                            <div className={'publish-brand'}>
                                <img src={steps[0]?.value?.icon} alt=""/>
                            </div>
                            <span className={'blue-txt bold-txt ml-10'}>{steps[0]?.value?.name}</span>
                        </div>
                        <span className={'ml-10 gray-txt gray-txt--light txt--xl'}>
                                /
                            </span>
                        <div className='d-flex align-center'>
                            <span className={'blue-txt bold-txt ml-10'}>
                                <span className={'blue-txt bold-txt'}>{steps[1]?.value?.name}</span>
                            </span>
                        </div>
                        <span className={'ml-10 gray-txt gray-txt--light txt--xl'}>
                                /
                            </span>
                        <div className='d-flex align-center'>
                            <span className={'blue-txt bold-txt ml-10'}>
                                {steps[2]?.value?.releaseYear}
                            </span>
                        </div>
                        <span className={'ml-10 gray-txt gray-txt--light txt--xl'}>
                                /
                            </span>
                        <div className='d-flex align-center'>
                            <span className={'blue-txt bold-txt ml-10'}>
                                {body?.nameAZ}
                            </span>
                        </div>
                    </div>
                    <div>
                        <ResetPublish/>
                    </div>
                </div>
            </div>
            <div className={'py-35'}>
                {
                    !profile?.isBusiness &&
                    <div>
                        <p className={'publish-section-title txt--xxl medium-txt mb-25'}>
                            Adınız
                        </p>
                        <div>
                            <div className={'pb-35'}>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <input value={form.inputs.name.value}
                                               onChange={(e) => changeInputValue(e, 'name', form.inputs, setForm)}
                                               type="text"
                                               className={'custom-input'}
                                               placeholder={'Ad'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <div className={'pt-15'}>
                    <p className={`${css.finish__priceLabel} publish-section-title txt txt--xxl bold-txt mb-25`}>
                        Qiymət
                    </p>
                    <div>
                        <div className={'pb-35'}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className={'d-flex position-relative align-center'}>
                                        <input value={form.inputs.price.value}
                                               onChange={(e) => changeInputValue(e, 'price', form.inputs, setForm)}
                                               type="number"
                                               className={'custom-input'}
                                        />
                                        <div className={`${css.finish__currencySelectWrapper} position-absolute`}>
                                            <Select
                                                change={(value) => {
                                                    changeInputValue({target: {value}}, 'currency', form.inputs, setForm)
                                                }}
                                                classes={css.finish__currencySelect}
                                                data={form.inputs.currency}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 mt-md-25">
                                    <div className="d-flex align-center h-100">
                                        {
                                            mainCheckboxes.map(({id, label, checked}) => {
                                                return (
                                                    <div key={id} className="col-6 p-0">
                                                        <Checkbox id={id} label={label} checked={checked}
                                                                  change={(e) => {
                                                                      checkboxChange(e, id)
                                                                  }}/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pb-100">
                    <div className="row">
                        {
                            allPlans?.map((plan, index) => {
                                return <div key={plan.name + plan.description + plan.color}
                                            className={`${(index + 1) % 3 === 0 ? 'col-lg-12 col-md-12' : 'col-lg-6 col-md-6'} col-12 mt-30`}>
                                    <PlanCard
                                        onClick={plan.isSimple ? (simplePlanData.price === 0 ? () => handleNext() : () => onPlaceOrder(simplePlanData)) : () => onSelect(plan)}
                                        name={plan.name}
                                        count={plan.adCount}
                                        desc={plan.description}
                                        price={plan.price}
                                        free={plan.price === 0}
                                        color={plan.color}
                                    />
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
            <Modal panelClass='p-30' setShow={(val) => {
                changeModalVisibility(val)
            }} show={modal} title={'Gün müddəti'}>
                <div className='d-flex align-center' onChange={(e) => {
                    setModalValue(e.target.value)
                }}>
                    {
                        modalInputs.map(({id, name, description}) => {
                            return <div key={id + name + description} className={'d-flex justify-between w-100'}>
                                <RadioButton
                                    id={`${id}-plan`}
                                    color={'green'}
                                    name={'plan-day'}
                                    label={name}
                                    value={id}
                                    checked={+modalValue === +id}
                                />
                            </div>

                        })
                    }
                </div>
                <div className={'mt-40'}>
                    <Button click={() => onPlaceOrder()} classes={'w-100'}>
                        Yerləşdirmək
                    </Button>
                </div>

            </Modal>
        </PublishLayout>
    );
}

export default Finish;
