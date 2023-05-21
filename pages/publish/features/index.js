import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Checkbox from "../../../src/core/shared/form-elements/checkbox";
import Button from "../../../src/core/shared/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PublishLayout from "../../../src/core/layouts/publish";
import {generateGuid, handleCheckboxChange} from "../../../src/core/helpers/common-functions";
import ResetPublish from "../../../src/core/shared/reset-publish";
import * as services from "../../../src/services";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import toyota from "../../../src/assets/images/brands/toyota.png";
import {carBodyConfig} from "../../../src/core/configs/car-body.config";
import {featuresSelect} from "../../../src/store/actions/publish-actions";
import PublishGoBack from "../../../src/core/shared/publish-go-back";
import Head from "next/head";
import publishCss from "../publish.module.scss";
export async function getServerSideProps(context) {
    const filters = await services.getFilters().then(res => res.filters)
    const features = filters.supplies || []
    const bodyStyles = filters.autoDesigns || []

    // const models = await axios.get(endpoints.models).then(res => res.data)
    // const popularModels = await axios.get(endpoints.popularModels).then(res=>res.data)
    return {
        props: {
            features,
            bodyStyles
        }
    }
}
function Features(props) {
    const screen = useSelector(({publicState}) => publicState.screen)

    const [checkboxes, setCheckboxes] = useState([
        ...props.features.map(({id, name})=>({
            id: id,
            label: name,
            checked: false,
        }))
    ])

    const checkboxChange = (val, id) => {

        setCheckboxes(prev=>{
            let newElements = prev.map(item => {
                if (item.id === id) {
                    return {...item, checked: val}
                } else return item
            })
            return newElements
        })
    }

    const steps = useSelector(({publish}) => publish.steps)
    const stepId = 4
    const router = useRouter()
    const dispatch = useDispatch()
    const body = carBodyConfig(props.bodyStyles.find(item=>parseInt(item.id) === parseInt(steps[2]?.value?.autoDesignId))?.code)

    const handleNext = ()=>{
        let payload = [...checkboxes.filter(item=>item.checked).map(cb=>parseInt(cb.id))]
        dispatch(featuresSelect(payload))
    }

    useEffect(() => {
        const prevStep = steps[stepId - 1]
        if (!prevStep.done) {
            router.push(prevStep.route)
        }

        const thisStep = steps[stepId]
        if (thisStep.done) {
            thisStep.value.forEach(id=>{
                checkboxChange(true, +id)
                // handleCheckboxChange(checkboxes,true, 2, setCheckboxes)
            })

        }
    }, [])

    return (
        <PublishLayout onNext={handleNext}>
            <Head>
                <title>
                    Treo - Avtomobilin təchizatı
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
                        <span className={'ml-10 ml-md-8 gray-txt gray-txt--light txt--xl'}>
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
            <div className={'py-35'}>
                <div className="pb-34">
                    <div>
                        <p className={'publish-section-title txt--xxl medium-txt mb-25'}>
                            Avtomobilin təchizatı
                        </p>
                        <div>
                            <div className="row">
                                {
                                    checkboxes.length > 0 ?
                                        checkboxes.map(({id, label, checked}) => {
                                            return (
                                                <div key={generateGuid()} className={`col-lg-4 col-md-6 col-6 py-17 py-md-14`}>
                                                    <Checkbox id={id} size={screen <= 768 ? 'xs' : 'md'} label={label} checked={checked} change={(e) => {
                                                        handleCheckboxChange(checkboxes,e, id, setCheckboxes)
                                                    }}/>
                                                </div>
                                            )
                                        }) : null
                                }
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

export default Features;
