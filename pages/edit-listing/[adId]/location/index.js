import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import Button from "../../../../src/core/shared/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as services from "../../../../src/services";
import {changeInputValue} from "../../../../src/core/helpers/common-functions";
import Select from "../../../../src/core/shared/form-elements/select-elements/select";
import PublishGoBack from "../../../../src/core/shared/publish-go-back";
import {locationSelectEdit} from "../../../../src/store/actions/edit-listing-actions";
import EditListingLayout from "../../../../src/core/layouts/edit-listing";
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
    const steps = useSelector(({editListing}) => editListing.steps)
    const screen = useSelector(({publicState}) => publicState.screen)
    const stepId = 4
    const router = useRouter()
    const dispatch = useDispatch()
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

        const thisStep = steps[stepId]
        if (thisStep.done){
            changeInputValue({target: {value : thisStep.value.cityId.toString()}}, 'city', form.inputs, setForm)
        }
    }, [])

    const handleNext = ()=>{
        const payload = {
            cityId : parseInt(form.inputs.city.value),
            address : '',
            latitude : '',
            langitude : ''
        }
        if (form.formValid){
            dispatch(locationSelectEdit(payload, router.query.adId))
        }
    }

    return (
        <EditListingLayout onNext={handleNext}>
            <Head>
                <title>
                    Treo - Şəhər
                </title>
            </Head>

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

        </EditListingLayout>
    );
}

export default Location;
