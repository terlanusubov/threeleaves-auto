import React, {useEffect, useState} from 'react';
import AutoLayout from "../../../src/core/layouts/auto";
import Link from "next/link";
import css from "../../index.module.scss";
import AgencyPanel from "../../../src/core/shared/agency-panel";
import * as profileServices from "../../../src/services/profile.services";
import SaleCard from "../../../src/core/shared/listing/sale-card";
import {generateGuid} from "../../../src/core/helpers/common-functions";
import {useDispatch, useSelector} from "react-redux";
import {getAgencyListings, resetDealers} from "../../../src/store/actions/dealership-actions";
import Button from "../../../src/core/shared/button";
import FloatingPanel from "../../../src/core/shared/floating-panel";
import {resetLists} from "../../../src/store/actions/home-actions";
import Head from "next/head";

export async function getServerSideProps(context) {
    const id = context.query.dealershipId
    const [data] = await Promise.all([
        profileServices.getAgencyById(id).then(res => res),
        // services.getAgencyListings(id, 1).then(res => res.ads) || [],
    ]);
    if (!data) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            data,
            agencyId: id
        }
    }
}

function DealershipDetails({data, agencyId}) {
    const dispatch = useDispatch()
    const dealerListings = useSelector(({dealership}) => dealership.dealershipListings)
    const dealerListPaginate = useSelector(({dealership}) => dealership.dealershipListingsPaginate)
    const [page, setPage] = useState(1)
    useEffect(() => {
        dispatch(resetDealers())
        if (page === 1) {
            dispatch(getAgencyListings(agencyId, 1))
            setPage(2)
        }
    }, [agencyId, dispatch, page])
    const onShowMore = () => {
        dispatch(getAgencyListings(agencyId, page))
        setPage(prev => prev + 1)
    }
    return (
        <AutoLayout>
            <Head>
                <title>
                    Treo - {data.name}
                </title>
            </Head>
            <div className="custom-container pb-100">
                <div className={`row align-end`}>
                    <div className={`col-lg-12`}>
                        <div className="d-flex gray-txt txt--sm align-center">
                            <Link href={'/'}>
                                <a className={'gray-txt txt--sm'}>
                                    Əsas səhifə
                                </a>
                            </Link>
                            <span className={'gray-txt txt mx-5'}>—</span>
                            <Link href={'/dealerships'} shallow>
                                <a className={'gray-txt txt--sm'}>
                                    {/*{data.brand}*/}
                                    Avtosalonlar
                                </a>
                            </Link>
                            <span className={'gray-txt txt mx-5'}>—</span>
                            <Link href={'/dealerships/' + agencyId} shallow>
                                <a className={'gray-txt txt--sm'}>
                                    {data.name}
                                </a>
                            </Link>
                        </div>
                        <div className="d-flex align-center justify-between">
                            <p className="card-title bold-txt mt-15">
                                {data.name}
                            </p>
                            <div className={css.home__businessBadge}>Avtosalon</div>
                        </div>

                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-3">
                        <FloatingPanel left>
                            <div className={'invisible-md'}>
                                <AgencyPanel hideMore data={data}/>
                            </div>
                        </FloatingPanel>
                    </div>
                    <div className="col-lg-9 px-md-0">
                        {
                            data.coverImage &&
                            <div className={`${css.home__agencyCover} border-radius overflow-hidden d-flex justify-center mb-70 mb-md-30 px-md-15`}>
                                <img className={'w-100 border-radius'} src={data.coverImage}/>
                            </div>
                        }
                            <div className="invisible visible-md px-0">
                                <AgencyPanel  hideMore data={data}/>
                            </div>

                        <div className={`py-30 px-md-10`}>
                            <div className="container-fluid">
                                <div className="row">
                                    {
                                        dealerListings.map(data => {
                                            return <div key={generateGuid()}
                                                        className={`col-lg-4 col-md-4 col-sm-6 col-6 mb-30 ${css.home__saleWrapper}`}>
                                                <SaleCard hasShadow={false} data={data} hasFav={true}/>
                                            </div>
                                        })
                                    }
                                </div>

                            </div>
                        </div>
                        {
                            dealerListPaginate &&
                            <div className='w-100 mt-5'>
                                <Button click={onShowMore} inverted={true}
                                        color={'primary'} classes={'w-100'}>
                                    Daha çox göstərmək
                                </Button>
                            </div>
                        }

                    </div>
                </div>

            </div>

        </AutoLayout>
    );
}

export default DealershipDetails;
