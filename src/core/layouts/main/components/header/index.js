import React, {useEffect, useMemo, useState} from 'react';
import css from './header.module.scss'
import location from '../../../../../assets/images/location.svg'
import az from '../../../../../assets/images/az.svg'
import en from '../../../../../assets/images/en.svg'
import ru from '../../../../../assets/images/ru.svg'
import logo from '../../../../../assets/images/Logo.svg'
import plusCircle from '../../../../../assets/images/plus-circle.svg'
import advancedSearch from '../../../../../assets/images/etrafli-search.svg'
import Image from "next/image";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Searchbar from "./components/searchbar";
import Button from "../../../../shared/button";
import {useSelector} from "react-redux";
import Modal from "../../../../shared/modal";
import {useRouter} from "next/router";
import * as services from '../../../../../services'
import {changeInputValue} from "../../../../helpers/common-functions";
import InputMask from "react-input-mask";
import adCategoryConfig from "../../../../configs/ad-category.config";
import {domainsConfig} from "../../../../configs/domains.config";

function Header(props) {
    const notCount = useSelector(({publicState}) => publicState.notCount)

    const router = useRouter()
    const languages = {
        az: {
            alias: 'az', file: az
        }, en: {
            alias: 'en', file: en
        }, ru: {
            alias: 'ru', file: ru
        }
    }
    const searchOpen = useSelector(({publicState}) => publicState.searchOpen)
    const profile = useSelector(({profile}) => profile.profile)

    const canPublish = useMemo(() => {
        return !profile?.isBusiness ? true : (profile?.adCategoryId === 10)
    }, [profile])
    const userSite = useMemo(() => {
        return adCategoryConfig[profile?.adCategoryId]
    }, [profile])
    const adCategoryId = useMemo(() => {
        return profile?.adCategoryId
    }, [profile])
    const otherSites = useMemo(() => {
        const arr = Object.entries(adCategoryConfig).filter(([key])=> +key!== adCategoryId).map(([key, value]) => value)
        return adCategoryId ? arr : []
    }, [adCategoryId])

    useEffect(() => {
        console.log(otherSites)
    }, [otherSites])
    const user = useSelector(({auth}) => auth.user)
    const [langState, setLangState] = useState('az')
    const [phone, setPhone] = useState('')
    const [publishModal, setPublishModal] = useState(false)
    const [publishErrorModal, setPublishErrorModal] = useState(false)
    const [inputs, setInputs] = useState({
        inputs: {
            phone: {
                type: 'text',
                label: 'Nömrə',
                placeholder: 'Nömrə',
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
        }
    })
    const changeLang = (e) => {
        setLangState(e.target.value)
    }
    const changePublishModalVisibility = () => {
        console.log(canPublish)
        if (canPublish){
            if (user) {
                router.push('/publish')
            } else setPublishModal(prev => !prev)
        }
        else {
            changePublishErrorModal()
        }

    }
    const changePublishErrorModal = () => {
        setPublishErrorModal(prev=>!prev)
    }

    const onSearch = (val) => {

    }

    const onContinue = () => {
        if (inputs.inputs.phone.isValid) {
            router.push({
                pathname: 'https://user.treo.az',
                query: {page: 'signup', phone: inputs.inputs.phone.value, site: 'auto'}
            })
            setPublishModal(false)
        }
    }
    const onErrorContinue = () => {
        if (userSite){
            router.push(userSite?.url)
        }
    }


    return (<div className={`${css.header}`}>
        <div className="custom-container">
            <div className="container-fluid">
                <div className={`row ${css.header__top} align-center`}>
                    <div className={'col-lg-3 py-20'}>
                        <div className={css.header__city}>
                        <span className={`${css.header__city__title} mr-7`}>
                            Şəhər:
                        </span>
                            <span className={css.header__city__current}>
                            <span className={`${css.header__city__icon} mr-6`}>
                                <Image src={location} alt={'location'}/>
                            </span>
                            <span className={css.header__city__name}>
                                Baki
                            </span>
                        </span>
                        </div>
                    </div>
                    <div className="col-lg-6 d-flex justify-between align-center py-20">
                        <Link href={'/dealerships'}>
                            <a>
                                <div className={css.header__top__currentService}>
                                    <span className={'mr-18'}>Avtosalonlar</span>
                                </div>
                            </a>
                        </Link>

                        <div className={css.header__top__lang}>
                            {/*<div className="lang-select d-flex align-center">*/}
                            {/*    <div className="lang-select__flag mr-18">*/}
                            {/*        <Image src={languages[langState].file} alt={langState}/>*/}
                            {/*    </div>*/}
                            {/*    <select onChange={changeLang} name="lang" id="lang">*/}
                            {/*        <option value="az">AZ</option>*/}
                            {/*        <option value="en">EN</option>*/}
                            {/*        <option value="ru">RU</option>*/}
                            {/*    </select>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className={`${css.header__top__userActions} d-flex justify-end align-center`}>
                            <Link href={'https://user.treo.az/profile/favorites'}>
                                <a className='py-20'>
                                    <span className={'d-flex align-center'}>
                                        <FontAwesomeIcon icon={["far", "heart"]} className={'mr-10'}/>
                                        Bəyəndiklərim
                                    </span>
                                </a>
                            </Link>
                            {user ?
                                <Link href={'https://user.treo.az/profile/my-listings'}>
                                    <a className={'ellipsis-txt py-20'}>
                                        <div className={'d-flex align-center ml-15'}>
                                            <div className="position-relative">
                                                {
                                                  notCount > 0 &&
                                                  <div className={css.header__notCount}>
                                                      {notCount}
                                                  </div>
                                                }
                                                    <div className={css.header__avatar}>
                                                        <img src={user.image}
                                                             alt="user"/>
                                                    </div>
                                            </div>
                                            <span className={'ellipsis-txt'}>
                                                {user.name}
                                            </span>

                                        </div>
                                    </a>
                                </Link>
                                :
                                <Link href={{
                                    pathname: 'https://user.treo.az',
                                    query: {site: 'auto'}
                                }}>
                                    <a>
                                        <span className={'d-flex align-center ml-20'}>
                                    <FontAwesomeIcon icon={["far", "user-circle"]} className={'mr-10'}/>
                                    Daxil olmaq
                                        </span>
                                    </a>
                                </Link>

                            }

                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className={`row align-center ${css.header__mobileMain}`}>
                    <div className={css.header__cityMobile}>
                        <span className={css.header__city__current}>
                            <span className={`${css.header__city__icon} mr-6`}>
                                <Image src={location} alt={'location'}/>
                            </span>
                            <span className={css.header__city__name}>
                                Baki
                            </span>
                        </span>
                    </div>
                    <div className={`col-lg-3 flex-1 ${css.header__logoWrapper}`}>
                        <Link href={'/'} shallow>
                            <a className={`${css.header__logo}`}>
                                <Image src={logo}/>
                            </a>
                        </Link>
                    </div>
                    <div className={css.header__top__langMobile}>
                        <div className="lang-select d-flex align-center hidden">
                            <div className="lang-select__flag mr-10">
                                <Image src={languages[langState].file} alt={langState}/>
                            </div>
                            <select onChange={changeLang} name="lang" id="lang">
                                <option value="az">AZ</option>
                                <option value="en">EN</option>
                                <option value="ru">RU</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className={css.header__searchbarWrapper}>
                            <Searchbar onSearch={onSearch}/>
                        </div>
                    </div>
                    <div className="col-lg-3 invisible-md">
                        <div className="w-100">
                            <Button classes={'w-100'} click={changePublishModalVisibility}>
                                <Image src={plusCircle}/>
                                Elan yerləşdirmək
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row py-15 pt-md-0">
                <div className="col-lg-3 pr-0">
                    <div className={`d-flex ${css.header__serviceList}`}>
                        <Link shallow href={'/'}>
                            <a className={`${css.header__serviceList__item} pl-15`}>
                                <span className={`txt--sm ${css.header__serviceListActive} green-txt bold-txt`}>
                                    Avtomobil
                                </span>
                            </a>
                        </Link>
                        <Link href={domainsConfig["20"]}>
                            <a className={`${css.header__serviceList__item}`}>
                                <span className={`gray-txt txt--sm`}>
                                    Daşınmaz əmlak
                                </span>
                            </a>
                        </Link>
                        <Link href={domainsConfig["30"]}>
                            <a className={`${css.header__serviceList__item}`}>
                                <span className={`gray-txt txt--sm no-after`}>
                                    Əşya
                                </span>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="col-lg-6 d-flex justify-end invisible-md">
                    <div onClick={() => {
                        router.push('/auto')
                    }} className="d-flex align-center cursor-pointer">
                        <Image src={advancedSearch} alt={'advanced search'}/>
                        <span className={'gray-txt txt--sm ml-7'}>
                            Ətraflı axtarış
                        </span>
                    </div>
                </div>
            </div>
            <div className={`${css.header__mobileNav} border-top border-bottom`}>
                <div className="d-flex py-10 justify-around">
                    <Link href={'/dealerships'}>
                        <a className={`${css.header__mobileNav__item} gray-txt txt--sm pl-0`}>
                            Avtosalonlar
                        </a>
                    </Link>
                    <Link href={'/about'}>
                        <a className={`${css.header__mobileNav__item} gray-txt txt--sm`}>
                            Haqqımızda
                        </a>
                    </Link>
                    <Link href={'/publish'}>
                        <a className={`${css.header__mobileNav__item} gray-txt txt--sm pr-0 border-none`}>
                            Reklamın yerləşdirilməsi
                        </a>
                    </Link>
                </div>
            </div>
            {searchOpen ? <div className={`${css.header__mobileSearchbarWrapper} py-30`}>
                <Searchbar onSearch={() => {
                }} mobile/>
            </div> : null}

        </div>
        <Modal setShow={(val) => {
            changePublishModalVisibility(val)
        }} show={publishModal} title={'Əlaqə nömrəniz'}>
            <InputMask
                maskChar={''}

                onChange={(e) => {
                    changeInputValue(e, 'phone', inputs.inputs, setInputs)
                }}
                mask={'(099) 999-99-99'}
                value={inputs.inputs.phone.value}
            >
                {
                    (inputProps) => (
                        <input {...inputProps}
                               type="text"
                               className={'custom-input'}
                               placeholder={inputs.inputs.phone.placeholder}
                        />
                    )
                }
            </InputMask>

            <span className={'err-txt'}>
                                {!inputs.inputs.phone.isValid && inputs.inputs.phone.touched ? inputs.inputs.phone.currentErrTxt : null}
                            </span>
            <div className={'pt-25 pb-34 border-bottom border-bottom--soft'}>
                <Button click={onContinue} classes={'w-100'}>Davam etmək</Button>
            </div>
            <div className={'pt-34'}>
                <Link href={{
                    pathname: 'https://user.treo.az',
                    query: {site: 'auto', page: 'login'}
                }}>
                    <a className={'gray-txt text-decoration-underline d-block text-center mb-24 txt--lg'}
                       onClick={changePublishModalVisibility}>
                        Daxil ol
                    </a>
                </Link>
                
                <Link href={{
                    pathname: 'https://user.treo.az',
                    query: {site: 'auto', page: 'signup'}
                }}>
                    <a className={'gray-txt text-decoration-underline d-block text-center txt--lg'}
                       onClick={changePublishModalVisibility}>
                        Qeydiyyat
                    </a>
                </Link>
            </div>
        </Modal>
        <Modal setShow={(val) => {
            changePublishErrorModal(val)
        }} show={publishErrorModal} size={'md'} title={'Hüququnuz yoxdur'}>
            <p className='text-center txt txt--sm'>
                Sizin bu bölmədə elan yerləşdirməyiniz mümkün deyil. Biznes hesabınız yalnız <strong className='txt medium-txt'>{` \"${adCategoryConfig[adCategoryId]?.agency}\" `}</strong> kimi elan yerləşdirmək üçün nəzərdə tutulub. <strong className='txt medium-txt'>{` \"${otherSites[0]?.name}\" `}</strong> və <strong className='txt medium-txt'>{` \"${otherSites[1]?.name}\" `}</strong> kateqoriyası üzrə elan yerləşdirmək üçün təyinatı üzrə yenidən qeydiyyatdan keçin.
            </p>

            <div className={'pt-25'}>
                <Button click={onErrorContinue} classes={'w-100'}>Keçid etmək</Button>
            </div>
        </Modal>

    </div>);
}

export default Header;
