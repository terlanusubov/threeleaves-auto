import React, {useEffect, useState} from 'react';
import Button from "../../../../src/core/shared/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import * as services from "../../../../src/services";
import PublishGoBack from "../../../../src/core/shared/publish-go-back";
import {noteSelectEdit} from "../../../../src/store/actions/edit-listing-actions";
import EditListingLayout from "../../../../src/core/layouts/edit-listing";
import Head from "next/head";
import dynamic from "next/dynamic";
import 'react-quill/dist/quill.snow.css'
const Quill = dynamic(() => import('react-quill'), {ssr: false})
export async function getServerSideProps(context) {
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

    const steps = useSelector(({editListing}) => editListing.steps)
    const screen = useSelector(({publicState}) => publicState.screen)
    const stepId = 3
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {

        const thisStep = steps[stepId]
        if (thisStep.done){
            setNote(thisStep.value)
        }
    }, [])

    const handleNext = ()=>{
        const payload = note
        dispatch(noteSelectEdit(payload, router.query.adId))
    }

    return (
        <EditListingLayout onNext={handleNext}>
            <Head>
                <title>
                    Treo - Qeydlər
                </title>
            </Head>
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

        </EditListingLayout>
    );
}

export default Notes;
