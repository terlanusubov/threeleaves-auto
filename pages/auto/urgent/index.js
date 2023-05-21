import homeCss from "../../index.module.scss";
import Blur from "../../../src/core/shared/blur";
import GrayBackdrop from "../../../src/core/shared/gray-backdrop";
import Image from "next/image";
import fire from "../../../src/assets/images/fire.svg";
import Link from "next/link";
import UrgentItems from "../../../src/core/shared/urgent-items";
import {SocialLinksConfig} from "../../../src/core/configs/social-links.config";
import SocialLink from "../../../src/core/shared/social-link";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import css from "../../index.module.scss";
import AgencyCard from "../../../src/core/shared/listing/agency-card";
import {generateGuid} from "../../../src/core/helpers/common-functions";
import Button from "../../../src/core/shared/button";
import FloatingPanel from "../../../src/core/shared/floating-panel";
import Head from "next/head";
import { getUrgentList, getUrgentListingsFilter, resetLists } from "../../../src/store/actions/home-actions";
import SaleCard from "../../../src/core/shared/listing/sale-card";

function Urgent(props) {
    const dispatch = useDispatch()
    const searchbarOpen = useSelector(({publicState}) => publicState.searchOpen)
    const searchFocused = useSelector(({publicState}) => publicState.searchFocused)
    const shouldPaginate = useSelector(({home}) => home.shouldPaginateUrgent)
    const [footerLinks, setFooterLinks] = useState([
        {title: 'Avtosalonlar', url: '/dealerships'},
        {title: 'Qaydalar', url: 'https://user.treo.az/rules'},

        // {title: 'Reklamın yerləşdirilməsi', url: '/ad'}
    ])

    const [page, setPage] = useState(1)

    const listings = useSelector(({home}) => home.urgentListingsFilter)

    useEffect(() => {
        if (page === 1) {
            dispatch(resetLists())
            dispatch(getUrgentListingsFilter({page}))
            setPage(2)
        }
    }, [])

    const onShowMore = () => {
        dispatch(getUrgentList(page))
        setPage(prev => prev + 1)
    }
    return (
        <div className={`${homeCss.home} page-content ${searchbarOpen ? homeCss.homeActive : ''} pt-40 pb-70`}>
            <Head>
                <title>
                    Treo - Avtosalonlar
                </title>
            </Head>
            {
                searchFocused ? <Blur/> : null
            }
            <GrayBackdrop/>
            <div className="custom-container">
                <div className="row">
                    <div className="col-lg-9 pb-100">
                        <div className="d-flex gray-txt txt--sm align-center">
                            <Link href={'/'}>
                                <a className={'gray-txt txt--sm'}>
                                    Əsas səhifə
                                </a>
                            </Link>
                            <span className={'gray-txt txt mx-5'}>—</span>
                            <Link href={'/dealerships'} shallow>
                                <a className={'gray-txt txt--sm'}>
                                    Təcili elanlar
                                </a>
                            </Link>
                        </div>
                        <p className="card-title bold-txt mt-15">
                            Təcili elanlar
                        </p>
                        <div className={`pb-30`}>
                            <div className="row">
                                {
                                    listings.map(d => {
                                        return (
                                            <div
                                                key={generateGuid()}
                                                className={`col-lg-4 col-md-4 col-sm-6 col-6 mb-30 ${css.home__saleWrapper}`}>
                                                <SaleCard hasShadow={false} data={d}/>
                                            </div>
                                        )

                                    })
                                }

                            </div>
                        </div>
                        {
                            shouldPaginate &&
                            <div className='w-100 mt-5'>
                                <Button click={() => onShowMore()} inverted={true}
                                        color={'primary'} classes={'w-100'}>
                                    Daha çox göstərmək
                                </Button>
                            </div>
                        }
                    </div>
                    <div className="col-lg-3 invisible-md">
                        <FloatingPanel>
                                    <div className={`d-flex justify-between align-end pb-16 pt-41`}>
                                        <div className="d-flex align-end bold-txt">
                                            <Image src={fire} alt={'Urgent'}/>
                                            <span className={'red-txt ml-10 medium-txt'}>
                                        Təcili satılır
                                    </span>
                                        </div>
                                        <Link href={'/'}>
                                            <a>
                                                <span className={'gray-txt'}>Hamısı</span>
                                            </a>
                                        </Link>
                                    </div>
                            <div className={'invisible-md'}>
                                <UrgentItems />
                            </div>
                            <div className="mt-40 invisible-md">
                                <p className={'txt--sm gray-txt text-center mb-20'}>
                                    Sosial şəbəkələrimiz
                                </p>
                                <div className={`d-flex justify-between px-25 mb-50`}>
                                    {
                                        SocialLinksConfig.map(data => {
                                            return <SocialLink key={data.url + data.icon + data.bg} data={data}/>
                                        })
                                    }
                                </div>
                                <div>
                                    {
                                        footerLinks.map(link => (
                                            <Link key={link.url + link.title} href={link.url}>
                                                <a className={'gray-txt medium-txt mb-20 d-block text-center'}>
                                                    {link.title}
                                                </a>
                                            </Link>
                                        ))
                                    }
                                </div>
                                <div className={'pt-20'}>
                                    <p className={'gray-txt gray-txt--light text-center'}>
                                        © «Treo», 2023
                                    </p>
                                </div>
                            </div>
                        </FloatingPanel>
                    </div>
                </div>

            </div>
        </div>

    );
}

export default Urgent;
