import React, {useEffect, useState} from 'react';
import PriceCard from "../../src/core/shared/price-card";
import PublishLayout from "../../src/core/layouts/publish";
import {useRouter} from "next/router";
import Head from "next/head";
import {useDispatch, useSelector} from "react-redux";
import {checkTransaction, getPlans, onSubscribe} from "../../src/store/actions/publish-actions";
import axios from "axios";
import {generateGuid} from "../../src/core/helpers/common-functions";
import {setLoader} from "../../src/store/actions/public-actions";
import {errorToast} from "../../src/core/shared/toast";

function Publish(props) {
    const router = useRouter()
    const dispatch = useDispatch();
    const profile = useSelector(({profile}) => profile.profile)

    useEffect(() => {
        if (profile) {
            if (!profile?.isBusiness){
                router.push('/publish/brand')
            }
            else {
                if (profile?.adCount > 0) {
                    router.push('/publish/brand')
                }
                else dispatch(getPlans(10))
            }
        }
    }, [dispatch, profile, router])

    const plans = useSelector(({publish}) => publish.plans)

    const onSelect = async (planId) => {
        const transactionId = generateGuid()
        const paymentUrl = await dispatch(onSubscribe({planId: +planId, transactionId}))
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
                    if (!!statusResult.paymentStatus) {
                        router.push('/publish/brand')
                    } else errorToast('Ödəmə uğursuz oldu')
                }, 3000)
            }
        }, 3000)
    }

    return (
        <PublishLayout>
            <Head>
                <title>
                    Treo - Plan seç
                </title>
            </Head>
            <div className={'pb-50'}>
                <div className="row">
                    {
                        plans?.map(({
                                        id,
                                        name,
                                        adCategoryId,
                                        price,
                                        adCount,
                                        color,
                                        description,
                                        userRoleId,
                                        userSubscriptionPlanStatusId
                                    }, index) => {
                            return <div key={id + name}
                                        className={`col-lg-${(index + 1) % 3 === 0 ? '12' : '6'} col-md-${(index + 1) % 3 === 0 ? '12' : '6'} col-12 mt-30`}>
                                <PriceCard desc={description} onClick={() => onSelect(id)} count={adCount} price={price} color={'white'}/>
                            </div>
                        })
                    }
                </div>

            </div>

        </PublishLayout>
    )
        ;
}

export default Publish;
