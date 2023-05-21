import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {carBodyConfig} from "../../../src/core/configs/car-body.config";
import PublishLayout from "../../../src/core/layouts/publish";
import Image from "next/image";
import ResetPublish from "../../../src/core/shared/reset-publish";
import Button from "../../../src/core/shared/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as services from "../../../src/services";
import toyota from "../../../src/assets/images/brands/toyota.png";
import {changeInputValue} from "../../../src/core/helpers/common-functions";
import Select from "../../../src/core/shared/form-elements/select-elements/select";
import {locationSelect} from "../../../src/store/actions/publish-actions";
import PublishGoBack from "../../../src/core/shared/publish-go-back";
import Head from "next/head";

export async function getServerSideProps(context) {
    const filters = await services.getFilters().then(res => res.filters)
    const bodyStyles = filters.autoDesigns || []
    const cities = filters.cities.sort((a, b) => a.name.localeCompare(b.name)) || []

    return {
        props: {
            bodyStyles,
            cities
        }
    }
}

function Location(props) {
    const steps = useSelector(({publish}) => publish.steps)
    const stepId = 8
    const router = useRouter()
    const dispatch = useDispatch()
    const body = carBodyConfig(props.bodyStyles.find(item => parseInt(item.id) === parseInt(steps[2]?.value?.autoDesignId))?.code)
    const [form, setForm] = useState({
        inputs: {
            city: {
                type: 'select',
                value: '0',
                name: 'city',
                rules: {
                    required: {
                        value: true,
                        errorText: 'Şəhər seçin'
                    },
                },
                placeholder: 'Şəhər',
                options: [
                    {title: 'Şəhər', value: '0'},
                    ...props.cities.map(({name, id}) => ({title: name, value: id.toString()}))
                ],
                currentErrTxt: 'Şəhər seçin',
                touched: false,
                isValid: false,

            },
        },
        formValid : false
    })
    useEffect(() => {
        const prevStep = steps[stepId - 1]
        if (!prevStep.done) {
            router.push(prevStep.route)
        }
        const thisStep = steps[stepId]
        if (thisStep.done){
            changeInputValue({target: {value : thisStep.value.toString()}}, 'city', form.inputs, setForm)
        }
    }, [])

    const handleNext = ()=>{
        const payload = parseInt(form.inputs.city.value)
        if (form.formValid){
            dispatch(locationSelect(payload))
        }
    }

    return (
        <PublishLayout onNext={handleNext}>
            <Head>
                <title>
                    Treo - Şəhər
                </title>
            </Head>
            <div className={'mt-60'}>
                <div className={'d-flex justify-between align-center pb-25 border-bottom border-bottom--soft'}>
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
                <div>
                    <div>
                        <p className={'publish-section-title txt--xxl medium-txt mb-15'}>
                            Şəhər
                        </p>
                        <div className={'pb-35'}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <Select change={(value) => {
                                        changeInputValue({target: {value}}, 'city', form.inputs, setForm)
                                    }} data={form.inputs.city}/>
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

        </PublishLayout>
    );
}

export default Location;
