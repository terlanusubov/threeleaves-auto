import React, {useEffect, useState} from 'react';
import css from './profile-listing.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {generateGuid, renderDateFormat} from "../../helpers/common-functions";
import {useRouter} from "next/router";

function ProfileListing({data, isBusiness}) {
    const router = useRouter()
    const onClick = () => {
        router.push('/auto/' + data.adId)
    }
    const [imgList, setImgList] = useState([])
    const [overflow, setOverflow] = useState(0)
    const [tooltipVisible, setTooltipVisible] = useState(false)
    useEffect(() => {
        const tempImages = []
        if (data.images && Array.isArray(data.images)) {
            if (data.images.length > 4) {
                for (let i = 0; i < 4; i++) {
                    tempImages.push(data.images[i])
                }
                setOverflow(data.images.length - 4)
            } else {
                data.images.forEach(elem => {
                    tempImages.push(elem)
                })
            }

            setImgList(tempImages)
        }
    }, [])
    const onEditClick = (e) => {
        e.stopPropagation()
        router.push('/edit-listing/' + data.adId)
    }
    return (
        <div onClick={onClick} className={css.listing + ' cursor-pointer'}>
            <div className="d-flex align-center justify-between">
                <div className={css.listing__content}>
                    <div className={'pr-20 fit-content'}>
                        <p className={'gray-txt mb-10'}>
                            {renderDateFormat(data.created)}
                        </p>
                        <p className={'green-txt bold-txt'}>
                            {data.adNumber}
                        </p>
                    </div>
                    <div className={'pr-20'}>
                        <div className={'mb-10'}>
                            <div className="d-flex align-center">
                                {
                                    isBusiness && <span className={`${css.listing__categoryBadge} mr-10`}>{data.adCategory}</span>
                                }
                                {
                                    (+data.adStatusId === 50 || +data.adStatusId === 30) &&
                                    <span onMouseEnter={()=>setTooltipVisible(true)} onMouseLeave={()=>setTooltipVisible(false)} className="colorTag position-relative d-flex justify-center" style={{backgroundColor : '#FABE00'}}>
                                    <div className={`tooltip ${tooltipVisible && 'tooltip--visible'}`}>
                                        <p>
                                            Yoxlamada
                                        </p>
                                    </div>
                                </span>
                                }

                            </div>

                        </div>
                        <div className={css.listing__edit} onClick={onEditClick}>
                            <FontAwesomeIcon icon={'pen-to-square'}/>
                            <span className={'ml-10'}>Düzəliş et</span>
                        </div>
                    </div>
                    <div className="pr-20 w-50">
                        <p className={'gray-txt mb-10 txt--sm'}>
                            {data.adName}
                        </p>
                        <p className={'txt-xl bold-txt'}>
                            {data.price} {data.currencyIcon}
                        </p>
                    </div>
                </div>

                <div className={css.listing__imgCol}>
                    <div className={css.listing__imgList}>
                        {
                            imgList.map(img => {
                                return (
                                    <div key={generateGuid()} className={css.listing__img}>
                                        <img
                                            src={img}
                                            alt=""/>
                                    </div>
                                )
                            })
                        }


                    </div>
                    {
                        !!overflow &&
                        <span className={css.listing__imgCount}>+{overflow}</span>
                    }

                </div>
            </div>
        </div>
    );
}

export default ProfileListing;