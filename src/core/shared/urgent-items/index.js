import css from './urgent-items.module.scss'
import Slider from 'react-slick'
import arrowRed from '../../../assets/images/arrow-red.svg'
import Image from "next/image";
import SaleCard from "../listing/sale-card";
import {useDispatch, useSelector} from "react-redux";
import {getUrgentList} from "../../../store/actions/home-actions";
import {useEffect} from "react";

function UrgentItems({mobile = false, listings = null}) {
    const dispatch = useDispatch()
    const Arrow = ({className, onClick, ...p}) => {
        return (
            <button
                className={`${css.urgent__arrow} ${p.prev ? css.urgent__arrowPrev : ''}`}
                onClick={onClick}
            >
                <Image src={arrowRed}/>
            </button>
        )
    }

    const items = useSelector(({home}) => home.urgentListings)

    useEffect(()=>{
        dispatch(getUrgentList())
    }, [dispatch])

    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <Arrow next/>,
        prevArrow: <Arrow prev/>,
        autoplay : true,
        speed : 500,
        autoplaySpeed : 4000,
    }

    const itemsToShow = listings ? listings : items

    return (
        !mobile ?
            <div className={css.urgent}>
                {
                    itemsToShow ? (
                        <Slider {...settings}>
                            {
                                itemsToShow.map(car => {
                                    return <SaleCard vertical={mobile} key={car.adId + car.brand + car.releaseYear} data={car}/>
                                })
                            }
                        </Slider>
                    ) : null
                }
            </div>
            :
            <div className={`${css.urgent} ${css.urgentVertical} d-flex`}>
                {
                    itemsToShow ? (
                            itemsToShow.map(car => {
                                return <SaleCard vertical={mobile}
                                                 key={car.adId + car.brand + car.releaseYear}
                                                 data={car}/>
                            })
                        )
                        :
                        null
                }
            </div>
    );
}

export default UrgentItems;
