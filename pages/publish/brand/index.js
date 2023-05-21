import React, {useState} from 'react';
import PublishLayout from "../../../src/core/layouts/publish";
import Searchbar from "../../../src/core/layouts/main/components/header/components/searchbar";
import Link from "next/link";
import css from './brand.module.scss'
import subuwu from '../../../src/assets/images/brands/subuwu.png'
import ford from '../../../src/assets/images/brands/ford.png'
import toyota from '../../../src/assets/images/brands/toyota.png'
import porsche from '../../../src/assets/images/brands/porsche.png'
import Image from "next/image";
import expandArrowUp from "../../../src/assets/images/expand-arrow-up-green.svg";
import expandArrowDown from "../../../src/assets/images/export-arrow-down-green.svg";
import * as services from "../../../src/services";
import {useDispatch, useSelector} from "react-redux";
import {brandSelect} from "../../../src/store/actions/publish-actions";
import Head from "next/head";

export async function getServerSideProps(context) {
    const filters = await services.getFilters().then(res => res.filters)
    const brands = filters.brands || []
    // const models = await axios.get(endpoints.models).then(res => res.data)
    // const popularModels = await axios.get(endpoints.popularModels).then(res=>res.data)
    return {
        props: {
            brands,
        }
    }
}

function Brand(props) {

    const dispatch = useDispatch()

    const [brands, setBrands] = useState([...props.brands])
    const [showAll, setShowAll] = useState(false)
    const onSearch = (val) => {
        const newArr = props.brands.filter(item => item.name.toLowerCase().includes(val.toLowerCase()))

        if (val.trim() !== '') {
            setBrands(newArr)
        } else setBrands([...props.brands])
    }

    const brandClick = (brand) => {
        dispatch(brandSelect(brand))
    }

    return (
        <PublishLayout>
            <Head>
                <title>
                    Treo - Brend
                </title>
            </Head>
            <div className={'my-60'}>
                <p className={'section-title bold-txt'}>
                    Markanı seçin
                </p>
                <div className={'mt-30'}>
                    <Searchbar noResult onSearch={onSearch} placeholder={'Markalar üzrə axtarış'}/>
                </div>
                <div className={'py-30'}>
                    <div className={'d-flex wrap'}>
                        {
                            brands.slice(0, !showAll ? 30 : brands.length).map(({id, name, icon}, index) => (
                                <div key={id + name}
                                     className={`${css.brand__item} d-flex align-center py-13`}
                                     onClick={() => brandClick({id, name, icon})}
                                >
                                    <div className={css.brand__item__icon}>
                                        <img src={icon}/>
                                    </div>
                                    <span className={'txt--lg ml-8 medium-txt'}>{name}</span>
                                </div>
                            ))
                        }
                    </div>

                </div>
                {
                    brands.length > 30 &&
                    <div>
                        <div onClick={() => setShowAll(prev => !prev)}
                             className={`d-flex align-center cursor-pointer user-select-none fit-content`}>
                            {showAll ? <Image src={expandArrowUp}/> : <Image src={expandArrowDown}/>}
                            <span className={'green-txt medium-txt ml-12'}>
                            {!showAll ? 'Bütün markalar' : 'Markaları azaltmaq'}
                        </span>
                        </div>
                    </div>
                }
            </div>
        </PublishLayout>

    );
}

export default Brand;
