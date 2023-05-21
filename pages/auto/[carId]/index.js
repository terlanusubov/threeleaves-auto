import React, {useEffect, useMemo, useState} from 'react';
import AutoLayout from "../../../src/core/layouts/auto";
import Card from "../../../src/core/shared/card";
import css from './style.module.scss'
import {useDispatch, useSelector} from "react-redux";
import Button from "../../../src/core/shared/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import bolt from '../../../src/assets/images/listing/bolt.svg'
import fire from '../../../src/assets/images/listing/fire.svg'
import diamond from '../../../src/assets/images/listing/diamond.svg'
import warning from '../../../src/assets/images/listing/warning.svg'
import clock from '../../../src/assets/images/listing/clock.svg'
import eye from '../../../src/assets/images/listing/eye.svg'
import phone from '../../../src/assets/images/listing/phone.svg'
import check from '../../../src/assets/images/check-green.svg';
import chevronLeft from '../../../src/assets/images/listing/chevron-left.svg'
import chevronSmall from '../../../src/assets/images/listing/chevron-small.svg'
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import SaleCard from "../../../src/core/shared/listing/sale-card";
import CarModel from "../../../src/core/shared/car-model";
import * as services from "../../../src/services";
import {
    beautifyLargeNumbers,
    changeInputValue,
    extractTime,
    generateGuid,
    renderDateFormat, simplifyPhoneNumber
} from "../../../src/core/helpers/common-functions";
import {useRouter} from "next/router";
import Modal from "../../../src/core/shared/modal";
import AgencyPanel from "../../../src/core/shared/agency-panel";
import * as profileServices from '../../../src/services/profile.services'
import {postComplaint} from "../../../src/services";
import {errorToast, successToast} from "../../../src/core/shared/toast";
import {getSimilarResults, resetLists} from "../../../src/store/actions/home-actions";
import InputMask from "react-input-mask";
import FloatingPanel from "../../../src/core/shared/floating-panel";
import phoneMaskConfig from "../../../src/core/configs/phone.config";
import Head from "next/head";
import MobileSellerPanel from "../../../src/core/shared/mobile-seller-panel";
import {checkTransaction, getAdditionalPlans, onSubscribe} from "../../../src/store/actions/publish-actions";
import RadioButton from "../../../src/core/shared/form-elements/radiobutton";
import {setLoader} from "../../../src/store/actions/public-actions";

export async function getServerSideProps(context) {
    const ip = context.req.headers['x-real-ip'] || context.req.connection.remoteAddress;
    const id = context.query.carId
    let images = []
    const [data] = await Promise.all([
        services.getCarDetails(id, ip).then(res => res.auto),
    ]);

    if (!data) {
        return {
            notFound: true
        }
    }
    const profileData = await profileServices.getAgencyById(data.userId).then(res => res);

    images = [data.mainImageModel, ...data.imagesModel]
    return {
        props: {
            data,
            images,
            profileData,
            ip
        }
    }
}

function ListingDetails({data, images, profileData, ip}) {
    const router = useRouter()
    console.log(ip)
    const Arrow = ({className, onClick, ...p}) => {
        return (
            <button
                onClick={onClick}
                className={`${data.isBusiness ? css.details__arrowSmall : css.details__arrow} ${p.prev ? css.details__arrowPrev : ''}`}>
                <Image className={css.details__chevron} src={data.isBusiness ? chevronSmall : chevronLeft}/>
            </button>
        )
    }
    const dispatch = useDispatch()
    const [listData, setListData] = useState([])
    const [complaintForm, setComplaintForm] = useState({
        inputs: {
            name: {
                type: 'text',
                label: 'Sizin adınız',
                placeholder: 'Sizin adınız',
                value: '',
                rules: {
                    required: {
                        value: true,
                        errorText: 'Ad daxil edin'
                    },
                },
                currentErrTxt: 'Ad daxil edin',
                touched: false,
                isValid: false
            },
            phone: {
                type: 'text',
                label: 'Sizin nömrəniz',
                placeholder: 'Sizin nömrəniz',
                value: '',
                isNum: true,
                rules: {
                    required: {
                        value: true,
                        errorText: 'Nömrə daxil edin'
                    },
                    regexp: {
                        value: /^(?=.*[0-9])[- +()0-9]+$/,
                        errorText: 'Nömrəni düzgün daxil edin'
                    },
                    minLength: {
                        value: 15,
                        errorText: 'Nömrəni düzgün daxil edin'
                    },
                    maxLength: {
                        value: 15,
                        errorText: 'Nömrəni düzgün daxil edin'
                    }
                },
                currentErrTxt: 'Nömrə daxil edin',
                touched: false,
                isValid: false
            },
            desc: {
                type: 'text',
                label: 'Ətraflı',
                placeholder: 'Zəhmət olmasa şikayətinizi ətraflı şəkildə izah edin',
                value: '',
                rules: {
                    required: {
                        value: true,
                        errorText: 'Şikayətinizi ətraflı şəkildə izah edin'
                    },
                },
                currentErrTxt: 'Şikayətinizi ətraflı şəkildə izah edin',
                touched: false,
                isValid: false
            },
        },
        formValid: false,
    })
    const similarResults = useSelector(({home}) => home.similarResults)
    const similarResultsFiltered = useMemo(() => {
        return similarResults.filter(item => +item.adId !== +data.adId)
    }, [data.adId, similarResults])
    const similarPaginate = useSelector(({home}) => home.shouldPaginateSimilar)
    const screen = useSelector(({publicState}) => publicState.screen)
    const sliderSettings = {
        dots: false,
        arrows: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <Arrow next/>,
        prevArrow: <Arrow prev/>
    }
    const [similarParams, setSimilarParams] = useState({
        brandId: data.brandId,
        models: [data.modelId],
    })
    const user = useSelector(({auth}) => auth.user)
    const dataListKeys = {
        brand: {
            title: 'Marka',
            highlighted: true
        },
        model: {
            title: 'Model',
            highlighted: true
        },
        city: {
            title: 'Şəhər',
            highlighted: false
        },
        releaseYear: {
            title: 'Buraxılış ili',
            highlighted: false
        },
        design: {
            title: 'Ban',
            highlighted: false
        },
        color: {
            title: 'Rəng',
            highlighted: false
        },
        engine: {
            title: 'Mühərrikin həcmi',
            highlighted: false
        },
        horsePower: {
            title: 'Mühərrikin at gücü',
            highlighted: false
        },
        ride: {
            title: 'Yürüş',
            highlighted: false
        },
        fuelType: {
            title: 'Yanacaq növü',
            highlighted: false
        },
        gearBox: {
            title: 'Sürətlər qutusu',
            highlighted: false
        },
        producerCountry: {
            title: 'İstehsalçı ölkə',
            highlighted: false
        },
        vinCode: {
            title: 'VİN',
            highlighted: true,
            url: 'https://www.google.com/search?q='
        }
    }
    const [modal, setModal] = useState(false)
    const [fav, setFav] = useState(false)
    const [page, setPage] = useState(1)
    const additionalPlans = useSelector(({publish}) => publish.additionalPlans)
    
    const additionalPlansOrdered = useMemo(() => {
        const arr = [...additionalPlans]
        const plat = arr.findIndex(item => item.id === 20)
        const urgent = arr.findIndex(item => item.id === 30)
        const other = arr.findIndex(item => item.id === 70)
        let newArr = [...arr]
        if (+data.currentPlanId){
            newArr = arr.filter(({id})=>+id!==+data.currentPlanId)
        }
        return newArr.reverse().filter(({isSimple})=>!isSimple)
    }, [additionalPlans, data.currentPlanId])

    const urgentPlanData = useMemo(() => {
        return additionalPlans.find(({id}) => id === 30)
    }, [additionalPlans])

    const platPlanData = useMemo(() => {
        return additionalPlans.find(({id}) => id === 20)
    }, [additionalPlans])

    useEffect(() => {
        const dataListArray = []
        const keys = Object.keys(dataListKeys)

        keys.forEach((ky => {
            if (data[ky]) {
                let value = data[ky]
                if (ky === 'ride') {
                    value = `${beautifyLargeNumbers(data[ky])} ${data.rideType}`
                }
                if (ky === 'vinCode'){
                    value = data[ky]?.toUpperCase()
                }
                const listItem = {
                    name: dataListKeys[ky].title,
                        value,
                        highlighted: dataListKeys[ky].highlighted
                }
                if (dataListKeys[ky].url) {
                    listItem.url = dataListKeys[ky].url + value
                }
                dataListArray.push(listItem)
            }
        }))

        setListData(dataListArray || [])

        if (page === 1) {
            dispatch(resetLists())
            dispatch(getSimilarResults({...similarParams, page}))
            setPage(2)
        }
        services.getCarDetailsClient(+data.adId)
            .then(ad => {
                setFav(ad.auto.isWishlist)
            })
    }, [])
    
    useEffect(() => {
        dispatch(getAdditionalPlans(10))
    }, [dispatch])

    const onShowMore = () => {
        dispatch(getSimilarResults({...similarParams, page}))
        setPage(prev => prev + 1)
    }

    const handleOtherImgClick = (index) => {
        slick.slickGoTo(index)
    }
    const handleSliderClick = (index) => {
        const id = router.query.carId
        router.push({
            pathname: '/auto/' + id + '/media',
            query: {
                index
            }
        })
    }
    const [slick, setSlick] = useState(null)
    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <Arrow next/>,
        prevArrow: <Arrow prev/>
    }
    const [desc, setDesc] = useState(null)
    useEffect(() => {
        setDesc(data.description)
        console.log(data.description)
    }, [data.description])
    const changeModalState = () => {
        setModal(prev => !prev)
    }
    const onFav = () => {
        setFav(prev => !prev)
        profileServices.addToFav(+data.adId)
    }
    const complaintSubmit = (e) => {
        e.preventDefault()
        const complaintData = {
            adId: +data.adId,
            contactNumber: simplifyPhoneNumber(complaintForm.inputs.phone.value),
            fullname: complaintForm.inputs.name.value,
            description: complaintForm.inputs.desc.value
        }
        if (complaintForm.formValid) {
            postComplaint(complaintData)
                .then(res => {
                    successToast('Şikayətiniz qeyd olundu!')
                    setModal(false)
                })
        }
    }
    const planColors = {
        20: 'primary',
        30: 'danger',
        70: 'secondary'
    }
    const icons = {30: fire, 70: bolt, 20: diamond}
    const [planModal, setPlanModal] = useState(false)
    const [modalValue, setModalValue] = useState(null)
    const [modalInputs, setModalInputs] = useState([])

    const modalContents = {
        20: {
            title: 'Elanı Platinum et',
            text: 'Bu xidmətdən istifadə etdiyiniz zaman elanınız ana səhifədə və axtarış nəticələrinə uyğun olaraq "Platinum elanlar" bölməsində göstəriləcək',
        },
        30: {
            title: 'Elanı təcili et',
            text: 'Bu xidmətdən istifadə etdiyiniz zaman elanınız ana səhifədə və axtarış nəticələrinə uyğun olaraq "Təcili elanlar" bölməsində göstəriləcək',
        },
        70: {
            title: 'Elanı irəli çək',
            text: 'Bu xidmətdən istifadə etdiyiniz zaman elanınız ana səhifədə və axtarış nəticələrində ən son əlavə olunan elan kimi birinci yerə qalxacaq. Xidmət müddətini 1 dəfədən çox seçdiyiniz halda hər 24 saatdan bir avtomatik yenilənəcəkdir',
        }
    }

    const [currentModalContent, setCurrentModalContent] = useState(null)
    const changeModalVisibility = (val, inputs) => {
        setPlanModal(val)
        if (inputs && inputs.length) {
            setModalInputs(inputs)
            setModalValue(inputs[0].id)
        }
        else {
            setModalInputs([])
            setModalValue(null)
            setCurrentModalContent(null)
        }
    }
    const onPlaceOrder = async (plan) => {
        if (modalValue){
            const transactionId = generateGuid()
            const paymentUrl = await dispatch(onSubscribe({planId: +modalValue, transactionId, adId: +data.adId}))
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
                            successToast('Uğurlu əməliyyat!')
                        } else errorToast('Ödəmə uğursuz oldu')
                    }, 3000)
                }
            }, 3000)
        }
    }
    const onSelect = async (id, children) => {
        setCurrentModalContent(modalContents[id])
        if (children && children.length){
            changeModalVisibility(true, children)
        }
    }
    return (
        <AutoLayout>
            <Head>
                <title>
                    Treo - {data.brand} {data.model}
                </title>
            </Head>
            <Modal setShow={changeModalState} size={'lg'} title={'Şikayətiniz'} show={modal} closeBtn>
                <form onSubmit={complaintSubmit}>
                    <div className="row">
                        <div className="col-lg-6">
                            <InputMask
                                maskChar={''}

                                onChange={(e) => {
                                    changeInputValue(e, 'phone', complaintForm.inputs, setComplaintForm)
                                    // if (!isNaN(Number(e.target.value))) setPhone(e.target.value)
                                }}
                                mask={'(099) 999-99-99'}
                                value={complaintForm.inputs.phone.value}
                            >
                                {
                                    (inputProps) => (
                                        <input type="text"
                                               className={'custom-input'}
                                               {...inputProps}
                                               placeholder={'Sizin nömrəniz'}
                                        />
                                    )
                                }
                            </InputMask>

                            <span className={'err-txt'}>
                                {!complaintForm.inputs.phone.isValid && complaintForm.inputs.phone.touched ? complaintForm.inputs.phone.currentErrTxt : null}
                            </span>
                        </div>
                        <div className="col-lg-6">
                            <input type="text"
                                   className={'custom-input'}
                                   value={complaintForm.inputs.name.value}
                                   onChange={(e) => {
                                       changeInputValue(e, 'name', complaintForm.inputs, setComplaintForm)
                                       // if (!isNaN(Number(e.target.value))) setPhone(e.target.value)
                                   }}
                                   placeholder={'Sizin adınız'}
                            />
                            <span className={'err-txt'}>
                                {!complaintForm.inputs.name.isValid && complaintForm.inputs.name.touched ? complaintForm.inputs.name.currentErrTxt : null}
                            </span>
                        </div>

                    </div>
                    <div className={'pt-30'}>
                            <textarea className={'custom-input p-20'}
                                      rows={10}
                                      value={complaintForm.inputs.desc.value}
                                      onChange={(e) => {
                                          changeInputValue(e, 'desc', complaintForm.inputs, setComplaintForm)
                                      }}
                                      placeholder={'Zəhmət olmasa şikayətinizi ətraflı şəkildə izah edin'}
                            ></textarea>
                        <span className={'err-txt'}>
                                {!complaintForm.inputs.desc.isValid && complaintForm.inputs.desc.touched ? complaintForm.inputs.desc.currentErrTxt : null}
                            </span>
                    </div>
                    <div className="d-flex justify-center w-100 pt-30">
                        <div className={'w-50'}>
                            <Button classes={'w-100'}>
                                Göndərmək
                            </Button>
                        </div>

                    </div>
                </form>
            </Modal>
            <div className={css.details}>
                <div className="custom-container">
                    <div className="row">
                        <div className="col-lg-9">
                            <div className={'d-flex justify-between align-center mb-20'}>
                                <div
                                    className={`d-flex gray-txt align-center ${screen <= 768 ? 'txt--xs' : 'txt--sm'}`}>
                                    <Link href={'/'}>
                                        <a className={`gray-txt ${screen <= 768 ? 'txt--xs' : 'txt--sm'}`}>
                                            Əsas səhifə
                                        </a>
                                    </Link>
                                    <span className={'gray-txt txt mx-5'}>—</span>
                                    <Link href={{
                                        pathname: '/auto',
                                        query: {brandId: data.brandId}
                                    }}>
                                        <a className={`gray-txt ${screen <= 768 ? 'txt--xs' : 'txt--sm'}`}>
                                            {data.brand}
                                        </a>
                                    </Link>
                                    <span className={'gray-txt txt mx-5'}>—</span>
                                    <Link href={'/auto/' + data.adId}>
                                        <a className={`gray-txt ${screen <= 768 ? 'txt--xs' : 'txt--sm'}`}>
                                            Elan #{data.adId}
                                        </a>
                                    </Link>
                                </div>
                                <div
                                    className={`d-flex gray-txt ${screen <= 768 ? 'txt--xs' : 'txt--sm'} cursor-pointer`}
                                    onClick={changeModalState}>
                                    <Image src={warning}/>
                                    <span className={'ml-9 invisible-md'}>
                                        Şikayət et
                                    </span>
                                </div>
                            </div>
                            <div className={'mb-20'}>
                                <p className={css.details__name + ' bold-txt'}>
                                    {data.brand} {data.model}
                                </p>
                            </div>
                            <div className={'mb-30'}>
                                <div className="d-flex align-center justify-between">
                                    <div className="d-flex flex-wrap align-center">
                                        <div className={css.details__favBtn} onClick={onFav}>
                                            <FontAwesomeIcon className={`${fav && 'green-txt'}`}
                                                             icon={[!fav ? 'far' : 'fa', 'heart']}/>
                                            <span className={`${screen < 992 && 'txt--xs'} ml-10`}>
                                            {
                                                !fav ? 'Bəyəndiklərimə əlavə et' : 'Bəyəndiklərimdən çıxar'
                                            }

                                        </span>
                                        </div>
                                        <div className={`d-flex align-center ${screen < 992 ? 'col-12' : ''}`}>
                                            <div className="d-flex gray-txt txt--sm mr-24 pt-md-20 pl-md-5">
                                                <Image src={clock}/>
                                                <span
                                                    className={'ml-9'}>{renderDateFormat(data.published)} {extractTime(data.published)}</span>
                                            </div>
                                            <div className="d-flex gray-txt txt--sm pt-md-20">
                                                <Image src={eye}/>
                                                <span className={'ml-9'}>{data.viewCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {data.isBusiness && <div className={css.details__businessBadge}>Avtosalon</div>}
                                </div>

                            </div>
                            <div className={'mb-30'}>
                                <div className={`row ${screen < 992 ? 'row-reverse' : ''}`}>
                                    {
                                        data.isBusiness &&
                                        <div className="col-lg-4 invisible-md">
                                            <AgencyPanel data={{...profileData, userId: data.userId}}/>
                                        </div>
                                    }
                                    {
                                        screen >= 992 ?
                                            <div className={`${data.isBusiness ? 'col-lg-8' : 'col-lg-12'}`}>
                                                <div className={css.details__sliderMain}>
                                                    <Slider ref={slider => setSlick(slider)} {...sliderSettings}>
                                                        {
                                                            images.map(({id, url}, index) => {
                                                                return (
                                                                    <div key={data.adId + url + data.published}
                                                                         className={data.isBusiness ? css.details__sliderMainItemSmall : css.details__sliderMainItem}
                                                                         onClick={() => handleSliderClick(index)}
                                                                    >
                                                                        <img src={url}/>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </Slider>
                                                </div>
                                                <div
                                                    className={data.isBusiness ? css.details__otherImgSmall : css.details__otherImg}>
                                                    {
                                                        images.slice(0, 10).map(({id, url}, index) => {
                                                            const isLast = index === 9 && images.length !== 10
                                                            return (
                                                                <div key={generateGuid()}
                                                                     onClick={() => {
                                                                         !isLast ? handleOtherImgClick(index) : handleSliderClick(0)
                                                                     }}
                                                                     className={`${data.isBusiness ? css.details__otherImgItemSmall : css.details__otherImgItem}`}>
                                                                    {
                                                                        isLast &&
                                                                        <div className={css.details__otherImgDrop}>
                                                                    <span
                                                                        className={'white-txt txt--sm'}>Daha {images.length - 10} şəkil</span>
                                                                        </div>
                                                                    }
                                                                    {/*<img*/}
                                                                    {/*    src={'https://imageio.forbes.com/specials-images/imageserve/61f5fda0c9a90e01e164d940/The-TOM-S-GR86-Turbo-develops-300-hp-/960x0.jpg?format=jpg&width=960'}/>*/}
                                                                    <img src={url}/>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <div className={css.details__mobileSlider}>
                                                {
                                                    images.map(({id, url}, index) => {
                                                        return (
                                                            <div key={data.adId + url + data.published + '-mobile'}
                                                                 className={css.details__sliderMobileItem}
                                                            >
                                                                <img src={url}/>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                    }
                                    {
                                        data.isBusiness &&
                                        <div className="col-lg-4 invisible visible-md mt-25 px-0">
                                            <AgencyPanel data={{...profileData, userId: data.userId}}/>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className={'pb-140 border-bottom border-bottom--soft'}>
                                <div className={'row'}>
                                    <div className="col-lg-4 mb-md-20 px-md-0">
                                        <div className={css.details__specPanel}>
                                            {
                                                listData.map(dt => {
                                                    return (
                                                        <div key={generateGuid()} onClick={() => {dt.url ? window.open(dt.url, '_blank') : null}}
                                                             className={`d-flex justify-between align-center py-10 ${screen < 992 && 'txt--sm'} ${dt.url && 'cursor-pointer'}`}>
                                                            <span className={'gray-txt flex-1 pr-15'}>{dt.name}</span>
                                                            <span
                                                                className={`${dt.highlighted && 'blue-txt medium-txt'} ${dt.highlighted && dt.url ? 'text-decoration-underline' : ''} text-right fit-content`}>{dt.value}</span>
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                    </div>
                                    <div className="col-lg-8 px-md-0">
                                        <div className={'mb-30 mb-md-0'}>
                                            {
                                                !!data.supplies.length &&
                                                <Card padding={11}
                                                      classes={'green-border pt-24 px-24 border-bottom-md-0 border-radius-md-none'}>
                                                    <div className="row align-center">
                                                        {
                                                            data.supplies.map(item => {
                                                                return (
                                                                    <div key={generateGuid()}
                                                                         className="col-lg-4 mb-15">
                                                                        <div className="d-flex align-center">
                                                                            <div
                                                                                className={'no-shrink d-flex justify-center align-center'}>
                                                                                <Image src={check}/>

                                                                            </div>
                                                                            <span className={'ml-12'}>{item.name}</span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </Card>
                                            }

                                        </div>
                                        <div className={'mb-30 mb-md-0'}>
                                            <Card classes={'green-border border-bottom-md-0 border-radius-md-none'}>
                                                <p className={`${screen < 992 ? 'txt--lg' : 'txt--xxl'} medium-txt mb-14`}>
                                                    Əlavə məlumat
                                                </p>
                                                <div dangerouslySetInnerHTML={{__html: desc}} style={{whiteSpace: 'pre-wrap'}} className={`${css.details__notes} ${screen < 992 ? 'txt--xs' : ''}`}>

                                                </div>
                                            </Card>

                                        </div>
                                        <div>
                                            <Card classes={'green-border border-bottom-md-0 border-radius-md-none'}>
                                                <p className={`${screen < 992 ? 'txt--lg' : 'txt--xxl'} medium-txt `}>Detallar</p>
                                                <div
                                                    className={`d-flex py-20 border-bottom border-bottom--soft ${screen < 992 ? 'justify-between' : ''}`}>
                                                    <div className="d-flex align-center mr-30 mr-md-0">
                                                        <span className="colorTag"
                                                              style={{backgroundColor: '#19C92B'}}></span>
                                                        <span
                                                            className={'txt--sm gray-txt ml-8 ml-md-5'}>Original</span>
                                                    </div>
                                                    <div className="d-flex align-center mr-30 mr-md-0">
                                                        <span className="colorTag"
                                                              style={{backgroundColor: '#FDB724'}}></span>
                                                        <span
                                                            className={'txt--sm gray-txt ml-8 ml-md-5'}>Rənglənən</span>
                                                    </div>
                                                    <div className="d-flex align-center">
                                                        <span className="colorTag"
                                                              style={{backgroundColor: '#F23A00'}}></span>
                                                        <span className={'txt--sm gray-txt ml-8 ml-md-5'}>Dəyişən</span>
                                                    </div>
                                                </div>
                                                <div className="py-30 d-flex justify-center">
                                                    <div className={css.details__scheme}>
                                                        <CarModel data={data.parts}/>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-top border-top--soft mt-70 py-70 py-md-0 mt-md-0">
                                    {
                                        similarResultsFiltered.length ?
                                            <div className="py-30">
                                                <div className="d-flex align-center justify-between">
                                                    <p className={'section-title bold-txt'}>
                                                        Oxşar elanlar
                                                    </p>
                                                </div>
                                                <div className="row pt-30">
                                                    {
                                                        !!similarResultsFiltered.length ?
                                                            similarResultsFiltered.map(data => {
                                                                return <div key={generateGuid()}
                                                                            className={`col-lg-4 col-md-4 col-sm-6 col-6 mb-30`}>
                                                                    <SaleCard hasShadow={false} data={data}
                                                                              hasFav={true}/>
                                                                </div>
                                                            })
                                                            :
                                                            <p></p>
                                                    }
                                                </div>
                                                {
                                                    similarPaginate &&
                                                    <div className='w-100 mt-5'>
                                                        <Button click={() => {
                                                            onShowMore()
                                                        }} inverted={true} color={'primary'}
                                                                classes={'w-100'}>
                                                            Daha çox göstərmək
                                                        </Button>
                                                    </div>
                                                }


                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-3 invisible-md">
                            <FloatingPanel>
                                <Card padding={'0'}>
                                    <div className={'p-24 border-bottom border-bottom--soft'}>
                                        <p className={css.details__price + ' bold-txt'}>
                                            {beautifyLargeNumbers(data.price)} {data.currency}
                                        </p>
                                        {
                                            data.canBarter && <p className={'txt gray-txt mt-15'}>
                                                Barter mümkündür
                                            </p>
                                        }
                                        {
                                            data.canCredit && <p className={'txt gray-txt mt-15'}>
                                                Kredit mümkündür
                                            </p>
                                        }
                                    </div>
                                    {
                                        !data.isBusiness &&
                                        <div className={'d-flex p-24 border-bottom border-bottom--soft'}>
                                            <div className={css.details__avatar}>
                                                <img src={data.contactImage}/>
                                            </div>
                                            <div className={'flex-1 d-flex flex-column justify-between py-3'}>
                                                <p className={'txt--lg medium-txt mb-3 break-word'}>{data.contactName}</p>
                                                <p className={'gray-txt txt--sm'}>
                                                    {phoneMaskConfig.apply(data.contactNumber)}
                                                </p>

                                            </div>

                                        </div>
                                    }
                                    <div className="p-24 px-24">
                                        <span className={'text-center txt--lg gray-txt pb-24 d-block'}>
                                            Elanı:
                                        </span>
                                        <div className="d-flex flex-column">
                                            {
                                                additionalPlansOrdered?.map(({name, id, children}) => {
                                                    return (
                                                        <Button click={()=>onSelect(id, children)} key={name + id} classes={'txt--lg mb-24'} color={planColors[id]}>
                                                            <Image src={icons[id]}/>
                                                            {name}
                                                        </Button>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </Card>
                            </FloatingPanel>
                        </div>
                    </div>
                </div>
                <MobileSellerPanel plans={additionalPlansOrdered} onSelect={onSelect} planColors={planColors} icons={icons} data={data}/>
            </div>
            <Modal panelClass='p-30' size={'md'} setShow={(val) => {
                changeModalVisibility(val)
            }} show={planModal} title={currentModalContent?.title}>
                <div className='txt txt--sm medium-txt'>
                    {currentModalContent?.text}
                </div>
                <div className='txt txt--xl my-30 text-center bold-txt'>
                    Xidmətin müddəti:
                </div>
                <div className='d-flex flex-column' onChange={(e) => {
                    setModalValue(e.target.value)
                }}>
                    {
                        modalInputs.map(({id, name, description, price}, index) => {
                            return <div key={id + name + description} className={`d-flex w-100 px-50 px-md-0 ${index + 1 !== modalInputs.length && 'mb-30'}`}>
                                <RadioButton
                                    id={`${id}-plan`}
                                    color={'green'}
                                    name={'plan-day'}
                                    label={name}
                                    value={id}
                                    size={'lg'}
                                    checked={+modalValue === +id}
                                />
                                <span className='mx-10 gray-txt medium-txt'>
                                    -
                                </span>
                                <span  className='txt gray-txt medium-txt'>{price} AZN</span>
                            </div>

                        })
                    }
                </div>
                <div className='row justify-center'>
                    <div className='col-lg-6 col-md-6 col-12'>
                        <div className={'mt-40'}>
                            <Button click={onPlaceOrder} classes={'w-100'}>
                                Təsdiqlə
                            </Button>
                        </div>

                    </div>
                    <div className="col-12">
                    <div>
                        <p className={'txt txt--sm gray-txt mt-30 text-center medium-txt gray-txt'}>
                            &quot;Təsdiqlə&quot; düyməsinə klik etməklə, mən www.treo.az - ın
                            <Link href=""><a className='green-txt medium-txt txt txt--sm'> istifadəçi razılaşması və Qaydaları</a></Link> ilə razı olduğumu bildirirəm.
                        </p>
                    </div>
                </div>
                </div>

            </Modal>
        </AutoLayout>
    );
}

export default ListingDetails;
