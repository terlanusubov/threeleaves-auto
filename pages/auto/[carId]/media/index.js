import css from './media.module.scss'
import x from '../../../../src/assets/images/listing/media-x.svg'
import Slider from "react-slick";
import Image from "next/image";
import {Swiper, SwiperSlide} from "swiper/react";
import React, {useEffect, useState} from "react";
import {generateGuid} from "../../../../src/core/helpers/common-functions";
import * as services from "../../../../src/services";
import axios from "axios";
import {useRouter} from "next/router";
import chevronSmall from "../../../../src/assets/images/listing/chevron-small.svg";
import chevronLeft from "../../../../src/assets/images/listing/chevron-left.svg";
import Head from "next/head";

export async function getServerSideProps(context) {
    const carId = context.query.carId
    const slideIndex = context.query.index || 0
    let images = []
    const [data] = await Promise.all([
        services.getCarDetails(carId).then(res => res.auto),
    ]);
    if (!data) {
        return {
            notFound: true
        }
    }
    images = [data.mainImageModel, ...data.imagesModel]

    return {
        props: {
            carId,
            slideIndex,
            images
        }
    }
}

function Media(props) {
    const router = useRouter()
    const [slider, setSlider] = useState([])
    const [swiper, setSwiper] = useState(null)
    const Arrow = ({className, onClick, ...p}) => {
        return (
            <button
                onClick={onClick}
                className={`${css.media__arrow} ${p.prev ? css.media__arrowPrev : ''}`}

            >
                <Image className={css.media__chevron} src={chevronLeft}/>
            </button>
        )
    }
    const listClick = (index) => {
        setActiveIndex(index)
        swiper.slideTo(index + 1)
    }

    const handleNext = (index) => {
        if (index + 1 === slider.length)
            swiper.slideTo(1)
        else swiper.slideTo(index + 2)
    }
    const handlePrev = (index) => {
        if (index === 0) swiper.slideTo(slider.length)
        else swiper.slideTo(index)
    }
    const handleSliderChange = (e) => {
        const index = e.realIndex
        setActiveIndex(index)
        router.replace({
            query: {
                ...router.query,
                index
            }
        })
    }
    const handleClose = () => {
        router.back()
    }
    useEffect(() => {
        const imageArray = props.images.map(({id, url}, index) => {
            if (index === 0) {
                return {
                    isActive: true,
                    img: url,
                }
            }
            return {
                isActive: false,
                img: url,
            }
        })
        setSlider(imageArray)
        if (swiper) listClick(+props.slideIndex)
    }, [swiper])

    const [activeIndex, setActiveIndex] = useState(0)
    return (
        <>
            <Head>
                <title>
                    Treo - Şəkillər
                </title>
            </Head>
            {
                !!slider.length && <div className={css.media}>
                    {console.log(slider[activeIndex].img)}
                    <div className={css.media__bg} style={{backgroundImage: `url(${slider[activeIndex].img})`}}>

                    </div>
                    <div className={css.media__content}>
                        <div className={css.media__list}>
                            {
                                slider.map((sl, index) => {
                                    return (
                                        <div onClick={() => listClick(index)} key={generateGuid()}
                                             className={`${css.media__listItem} ${index === activeIndex && css.media__listItemActive}`}>
                                            <img src={sl.img} alt=""/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className={css.media__main}>
                            <Swiper onSwiper={setSwiper} onSlideChange={handleSliderChange} loop={true} keyboard={true}>
                                {
                                    slider.map((sl, index) => {
                                        return (
                                            <SwiperSlide key={sl.img + 'lulz'}>
                                                <div className={css.media__sliderItem}>
                                                    <img
                                                        src={sl.img} alt=""/>
                                                    <Arrow onClick={() => handleNext(index)} next/>
                                                    <Arrow onClick={() => handlePrev(index)} prev/>
                                                </div>

                                            </SwiperSlide>
                                        )
                                    })
                                }
                            </Swiper>

                        </div>
                        <div className={css.media__side}>
                            <Image src={x} onClick={handleClose}/>
                        </div>
                    </div>

                </div>
            }

        </>

    );
}

export default Media;
