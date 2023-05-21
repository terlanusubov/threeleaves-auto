import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Button from "../../../src/core/shared/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PublishLayout from "../../../src/core/layouts/publish";
import ResetPublish from "../../../src/core/shared/reset-publish";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {carBodyConfig} from "../../../src/core/configs/car-body.config";
import * as services from "../../../src/services";
import {noteSelect} from "../../../src/store/actions/publish-actions";
import PublishGoBack from "../../../src/core/shared/publish-go-back";
import Head from "next/head";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css'
const Quill = dynamic(() => import('react-quill'), {ssr: false})

export async function getServerSideProps() {
    const filters = await services.getFilters().then(res => res.filters)
    const bodyStyles = filters.autoDesigns || []

    return {
        props: {
            bodyStyles,
        }
    }
}
function Notes(props) {

    const [note, setNote] = useState('')

    const steps = useSelector(({publish}) => publish.steps)
    const screen = useSelector(({publicState}) => publicState.screen)
    const stepId = 7
    const router = useRouter()
    const dispatch = useDispatch()
    const body = carBodyConfig(props.bodyStyles.find(item => parseInt(item.id) === parseInt(steps[2]?.value?.autoDesignId))?.code)

    useEffect(() => {
        const prevStep = steps[stepId - 1]
        // if (!prevStep.done) {
        //     router.push(prevStep.route)
        // }
        const thisStep = steps[stepId]
        if (thisStep.done){
            setNote(thisStep.value)
        }
    }, [])

    const handleNext = ()=>{
        const payload = note
        dispatch(noteSelect(payload))
    }

    return (
        <PublishLayout onNext={handleNext}>
            <Head>
                <title>
                    Treo - Model
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
                                Əlavə məlumat
                            </p>
                            <p className={`${screen <= 768 ? 'txt--xs' : 'txt--sm'} gray-txt mb-25`}>
                                Telefon nömrəsi, ünvan və qiymət göstərilməsi qadağandır.
                            </p>
                            <div className={'pb-35'}>
                                    <Quill formats={['']} theme={false} modules={{toolbar: false}}  className='custom-input ' value={note} onChange={(e)=>setNote(e)}/>
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

export default Notes;
