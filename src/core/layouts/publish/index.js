import React, {useEffect, useMemo, useState} from 'react';
import css from './publish.module.scss'
import Blur from "../../shared/blur";
import GrayBackdrop from "../../shared/gray-backdrop";
import {useSelector} from "react-redux";
import Card from "../../shared/card";
import {generateGuid} from "../../helpers/common-functions";
import checkIcon from '../../../assets/images/check.svg'
import checkFillIcon from '../../../assets/images/check-fill.svg'
import Image from "next/image";
import {getUserData} from "../../configs/auth.config";
import {useRouter} from "next/router";
import FloatingPanel from "../../shared/floating-panel";
import phoneMaskConfig from "../../configs/phone.config";
import MobileSteps from "../../shared/mobile-steps";
function PublishLayout({children, onNext = ()=>{}}) {
    const router = useRouter()
    //REDUX
    const searchFocused = useSelector(({publicState}) => publicState.searchFocused)
    const steps = useSelector(({publish}) => publish.steps)
    const profile = useSelector(({profile}) => profile.profile)
    const canPublish = useMemo(() => {
        if (!profile){
            return true
        }
        return !profile?.isBusiness ? true : (profile?.adCategoryId === 10)
    }, [profile])

    useEffect(()=>{
        if (!canPublish){
            router.back()
        }
    }, [canPublish, router])
    //STATE
    const [rules, setRules] = useState([
        'Yerləşdirdiyiniz elan 30 gün ərzində qüvvədə olacaq.',
        'Elanı 45 gün ərzində deaktiv edə bilərsiniz.',
    ])

    useEffect(() => {
        if (!getUserData()) {
            router.push({
                pathname: 'https://user.treo.az',
                query: {site: 'auto'}
            })
        }
    }, [])

    return (
        <div className={`position-relative page-content pt-40`}>
            {
                searchFocused ? <Blur/> : null
            }
            <GrayBackdrop/>
            <div className="custom-container">
                <div className="row">
                    <div className="col-lg-9 pb-100">
                        <div className='pb-md-100'>
                            <Card classes={css.publish__infoPanel}>
                                <div className={'p-6'}>
                                    <p className={'card-title bold-txt'}>Elan Yerləşdirilməsi</p>
                                    <div className={'mb-24'}>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-12">
                                                <div className={'custom-input px-20 py-10'}>
                                                    <span className={'gray-txt txt--xxs'}>Əlaqə nömrəsi</span>
                                                    <p className={'green-txt bold-txt mt-5'}>{phoneMaskConfig.apply(profile?.phones ? profile?.phones[0] : profile?.phone)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <ul className={css.publish__ruleList}>
                                            {
                                                rules.map((rule, index) => {
                                                    return (
                                                      <li key={generateGuid()}
                                                          className={`txt--lg ${index + 1 === rules.length ? '' : 'mb-20'}`}>
                                                          {rule}
                                                      </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                            <div className={'mt-28'}>
                                {children}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 invisible-md">
                        <FloatingPanel>
                            <Card>
                                <p className={'txt--xxl medium-txt mb-18'}>Addımlar</p>
                                <div>
                                    {
                                        steps.map(step => {
                                            return (
                                                <div key={generateGuid()} className={css.publish__step}>
                                                    {
                                                        step.done ?
                                                            <Image src={checkFillIcon}/>
                                                            :
                                                            <Image src={checkIcon}/>
                                                    }
                                                    <p className={`ml-12 ${!step.done ? 'gray-txt' : ''}`}>
                                                        {step.name}
                                                    </p>

                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </Card>
                        </FloatingPanel>
                    </div>
                </div>
            </div>
            <MobileSteps onNext={onNext} steps={steps}/>
        </div>
    );
}

export default PublishLayout;
