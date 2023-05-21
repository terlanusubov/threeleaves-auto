import React, {useEffect, useState} from 'react';
import Select from "../../../../src/core/shared/form-elements/select-elements/select";
import Button from "../../../../src/core/shared/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    changeInputValue,
    toFormData
} from "../../../../src/core/helpers/common-functions";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import * as services from "../../../../src/services";
import css from './finish.module.scss'
import PublishGoBack from "../../../../src/core/shared/publish-go-back";
import {editAd, finishEdit} from "../../../../src/store/actions/edit-listing-actions";
import EditListingLayout from "../../../../src/core/layouts/edit-listing";
import Head from "next/head";

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

function PersonalInfo(props) {

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
        },
        formValid: true
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

    const steps = useSelector(({editListing}) => editListing.steps)
    const allValues = useSelector(({editListing}) => editListing.values)
    const stepId = 5
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        const thisStep = steps[stepId]
        if (thisStep.done){
            changeInputValue({target : {value : thisStep.value.price.toString()}}, 'price', form.inputs, setForm)
        }
    }, [])


    const handleNext = () => {
        if (form.formValid) {
            let payload = {
                price: form.inputs.price.value,
                currencyId : form.inputs.currency.value
            }
            dispatch(finishEdit(payload, router.query.adId))
            let all = {
                ...allValues,
                ...payload,
            }
            delete all['brandId']
            const formData = toFormData(all)
            dispatch(editAd(formData))
        }

    }


    return (
        <EditListingLayout onNext={handleNext}>
            <Head>
                <title>
                    Treo - Elanı yenilə
                </title>
            </Head>
            <div className={'py-35'}>
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
                                <div className="col-lg-3">
                                    <div className="d-flex align-center h-100">
                                    </div>

                                </div>
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

        </EditListingLayout>
    );
}

export default PersonalInfo;
