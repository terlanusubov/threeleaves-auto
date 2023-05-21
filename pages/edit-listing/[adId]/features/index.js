import React, {useEffect, useState} from 'react';
import Checkbox from "../../../../src/core/shared/form-elements/checkbox";
import Button from "../../../../src/core/shared/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {generateGuid, handleCheckboxChange} from "../../../../src/core/helpers/common-functions";
import * as services from "../../../../src/services";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import PublishGoBack from "../../../../src/core/shared/publish-go-back";
import {featuresSelectEdit} from "../../../../src/store/actions/edit-listing-actions";
import EditListingLayout from "../../../../src/core/layouts/edit-listing";
import Head from "next/head";
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

    const resetCheckboxes = ()=>{
        setCheckboxes(prev=>{
            let newElements = prev.map(item => ({...item, checked : false}))
            return newElements
        })
    }

    const steps = useSelector(({editListing}) => editListing.steps)
    const stepId = 0
    const router = useRouter()
    const dispatch = useDispatch()

    const handleNext = ()=>{
        let payload = [...checkboxes.filter(item=>item.checked).map(cb=>parseInt(cb.id))]
        dispatch(featuresSelectEdit(payload, router.query.adId))
    }

    useEffect(() => {
        const thisStep = steps[stepId]
        resetCheckboxes()
        if (thisStep.done) {
            thisStep.value.forEach(id=>{
                checkboxChange(true, +id)
            })
        }
    }, [steps])

    return (
        <EditListingLayout onNext={handleNext}>
            <Head>
                <title>
                    Treo - Avtomobilin təchizat
                </title>
            </Head>
            {/*<div className={'mt-60'}>*/}
            {/*    <div className={'d-flex justify-between align-center pb-25 border-bottom border-bottom--soft'}>*/}
            {/*        <span></span>*/}
            {/*        <div>*/}
            {/*            /!*<ResetPublish/>*!/*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
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
                                                    <Checkbox size={screen <= 768 ? 'xs' : 'md'} id={id} label={label} checked={checked} change={(e) => {
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

        </EditListingLayout>
    );
}

export default Features;
