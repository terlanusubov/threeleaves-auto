import React, {useEffect, useState} from 'react';
import Image from "next/image";
import x from "../../../../src/assets/images/x.svg";
import Button from "../../../../src/core/shared/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import info from '../../../../src/assets/images/info.svg'
import front from '../../../../src/assets/images/img-front.svg'
import side from '../../../../src/assets/images/img-side.svg'
import inter from '../../../../src/assets/images/img-interior.svg'
import {generateGuid} from "../../../../src/core/helpers/common-functions";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import * as services from "../../../../src/services";
import PublishGoBack from "../../../../src/core/shared/publish-go-back";
import EditListingLayout from "../../../../src/core/layouts/edit-listing";
import {imagesSelectEdit} from "../../../../src/store/actions/edit-listing-actions";
import Head from "next/head";

export async function getServerSideProps(context) {
    const filters = await services.getFilters().then(res => res.filters)
    const bodyStyles = filters.autoDesigns || []

    return {
        props: {
            bodyStyles,
        }
    }
}

function Images(props) {

    const [images, setImages] = useState([])
    const [video, setVideo] = useState('')
    const [deleted, setDeleted] = useState([])

    const onUpload = (event) => {
        const files = Array.from(event.target.files)
        const imageObjects = []
        files.forEach((file, index) => {
            if (images.length + index + 1 <= 20) {
                imageObjects.push({
                    id: generateGuid(),
                    file,
                    blob: imgToBlob(file)
                })
            }
        })
        setImages(prev => [...prev, ...imageObjects])

    }

    const imgToBlob = (file) => {
        return URL.createObjectURL(file)
    }

    const removeImg = (id, old) => {
        if (old){
            setImages(prev => prev.filter(img => img.id !== id))
            setDeleted(prev=>[...prev, id])
        }
        else setImages(prev => {
            return prev.filter(img => img.id !== id)
        })
    }

    const steps = useSelector(({editListing}) => editListing.steps)
    const stepId = 2
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        const thisStep = steps[stepId]
        if (thisStep.done) {
            setImages([...thisStep.value.fileObjects])
        }

    }, [steps])

    const checkValid = () => {
        let valid = true;
        valid = images.length >= 3 && valid
        return valid
    }

    const handleNext = () => {
        if (checkValid()) {
            let payload = {
                files: [...images.filter(itm=>!itm.isOld).map(item => item.file)],
                fileObjects: [...images],
                video,
                deletedFiles : deleted
            }
            dispatch(imagesSelectEdit(payload, router.query.adId))
        }
    }

    return (
        <EditListingLayout onNext={handleNext}>
            <Head>
                <title>
                    Treo - Şəkillər
                </title>
            </Head>

            <div className={'py-35'}>
                <div className="pb-34">
                    <div>
                        <p className={'publish-section-title txt--xxl medium-txt mb-25'}>
                            Şəkillər
                        </p>
                        <div>
                            <div className="info-panel mb-25 d-flex flex-column">
                                <div className={'info-panel__icon'}>
                                    <Image src={info}/>
                                </div>
                                <ol>
                                    <li>
                                        Yalnız Azərbaycan Respublikası ərazisində çəkilmiş şəkillər qəbul olunur.
                                    </li>
                                    <li>
                                        Şəkillər işıqlı və aydın yerlərdə çəkilməli, şəklin üzərində heçbir yazı
                                        olmamalıdır.
                                    </li>
                                    <li>
                                        Avtosalonda və ya avtosalonun qarşısında çəkilmiş şəkilləri sayta yükləmək
                                        üçün &quot;Avtosalonlar&quot; bölməsində qeydiyyatdan keçmək lazımdır.
                                    </li>
                                    <li>
                                        Yüklənilən şəkil sayı minimum 3, maksimum 20 ədəd ola bilər. Optimal ölçü
                                        1024x768 piksel.
                                    </li>
                                </ol>
                            </div>
                            <div className={'image-panel'}>
                                <div className="container-fluid">
                                    <div className={'row align-center'}>
                                        <div className={'col-lg-6 col-12 px-10 mb-md-20'}>
                                            <p className={'image-panel__title gray-txt mb-20 mb-md-5'}>
                                                Şəkilləri əlavə etmək
                                            </p>
                                            <p className={'gray-txt txt--lg image-panel__subtitle'}>
                                                Minimum 3, maksimum 20
                                            </p>
                                        </div>
                                        <div className={'col-lg-6 col-12 px-0'}>
                                            <div className={'d-flex align-center image-panel__parts'}>
                                                <label className={'image-panel__item'} htmlFor={'publish-input'}>
                                                    <input value={''} accept={'image/*'} onChange={onUpload} multiple id={'publish-input'} type="file" className={'d-none'}/>
                                                    <div className={'image-panel__item-inner'}>
                                                        <div className={'image-panel__item__content'}>
                                                            <Image src={front}/>
                                                        </div>
                                                    </div>
                                                </label>
                                                <label className={'image-panel__item'} htmlFor={'publish-input'}>
                                                    <div className={'image-panel__item-inner'}>
                                                        <div className={'image-panel__item__content'}>
                                                            <Image src={side}/>
                                                        </div>
                                                    </div>
                                                </label>
                                                <label className={'image-panel__item'} htmlFor={'publish-input'}>
                                                    <div className={'image-panel__item-inner'}>
                                                        <div className={'image-panel__item__content'}>
                                                            <Image src={inter}/>

                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            {
                                images.length > 0 ?
                                    <div className={'pt-20'}>
                                        <div className="row">
                                            {
                                                images.map(img=>{
                                                    return (
                                                        <div key={img.id} className="col-lg-3 col-md-4 col-sm-4 col-6 py-15">
                                                            <div className={'upload-preview__item w-100'}>
                                                                <div className={'upload-preview__item-inner'}>
                                                                    <div className={'upload-preview__delete'}>
                                                                        <Image onClick={()=>removeImg(img.id)} src={x}/>
                                                                    </div>
                                                                    <div className={'upload-preview__item-content'}>

                                                                        <img src={img.blob}/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    :
                                    null
                            }

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

export default Images;
