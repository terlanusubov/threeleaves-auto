import React from 'react';
import Card from "../card";
import css from "../../../../pages/auto/[carId]/style.module.scss";
import Image from "next/image";
import clockFill from "../../../assets/images/listing/clock-fill.svg";
import phone from "../../../assets/images/listing/phone.svg";
import gps from "../../../assets/images/listing/gps.svg";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {generateGuid} from "../../helpers/common-functions";
import phoneMaskConfig from "../../configs/phone.config";
import {useSelector} from "react-redux";

function AgencyPanel({data, hideMore}) {
    const screen = useSelector(({publicState}) => publicState.screen)
    return (
        <Card classes={`green-border border-radius-md-none ${screen < 992 ? 'px-md-15 pt-md-24 pb-md-0' : ''}`}>
            <div className="d-flex justify-center mb-20 mb-md-15">
                <div className={css.details__dealerLogo}>
                    <img src={data.avatar} alt=""/>
                </div>
            </div>
            <div className={'pb-24 pb-md-20 border-bottom border-bottom--soft'}>
                <div className="text-center mb-14">
                    <p className={`${screen < 992 ? 'txt--lg' : 'txt--xxl '} bold-txt`}>
                        {data.name}
                    </p>
                </div>
                <div className="text-center">
                    <p className={'txt--sm'}>
                        {data.description}
                    </p>
                </div>
            </div>
            <div className="py-24 border-bottom border-bottom--soft">
                <div className="d-flex align-center justify-between">
                    <div>
                        {
                            data.workdays.map(({day, started, ended}, index) => {
                                const mb = index < data.workdays.length - 1
                                return (
                                    <span key={generateGuid()}
                                          className={`gray-txt d-block ${screen < 992 ? 'txt--sm' : ''} ${mb ? 'mb-10' : ''}`}>{day}: {started}–{ended}</span>
                                )
                            })
                        }
                    </div>

                    <Image src={clockFill}/>
                </div>
            </div>
            <div className="py-24 border-bottom border-bottom--soft">
                <div className="d-flex align-center justify-between">
                    <div>
                        {
                            data.phones.map((ph, index) => {
                                const mb = index < data.phones.length - 1 || !!data.shortPhoneNumber
                                // const mb = !!data.shortPhoneNumber

                                return (
                                    <span key={generateGuid()}
                                          className={`gray-txt d-block ${screen < 992 ? 'txt--sm' : ''} ${mb ? 'mb-10' : ''}`}>{phoneMaskConfig.apply(ph)}</span>
                                )
                            })
                        }
                        <span key={generateGuid()}
                              className={`gray-txt d-block`}>{data.shortPhoneNumber}</span>
                    </div>
                    <Image src={phone}/>
                </div>
            </div>
            {
                !!data.cityName &&
                <div className="py-24 border-bottom border-bottom--soft">
                    <div className="d-flex align-center justify-between">
                        <span className={'gray-txt ellipsis-txt'}>{data.cityName}, {data.address}</span>
                        <Image src={gps}/>
                    </div>
                </div>
            }
            {
                !hideMore && data.adCount > 1 ?
                    <div className="pt-24 text-center pb-md-24">
                        <Link href={{
                            pathname: '/dealerships/' + data.userId,
                        }}>
                            <a className={'blue-txt'}>
                                <div className={'d-flex align-center justify-center'}>
                                    <span className={'medium-txt mr-12'}>Daha {data.adCount - 1} elan</span>
                                    <FontAwesomeIcon icon={'arrow-right-long'}/>
                                </div>
                            </a>
                        </Link>
                    </div>
                    :
                    null
            }


        </Card>
    );
}

export default AgencyPanel;
