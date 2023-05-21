import React, {useEffect, useState} from 'react';
import css from './sale-card.module.scss'
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {extractTime, renderDateFormat} from "../../../helpers/common-functions";
import * as services from '../../../../services/profile.services'
import {getUserData} from "../../../configs/auth.config";
import {useRouter} from "next/router";

function PropertySaleCard(props) {
    const {data, hasFav = true, hasShadow, vertical = false} = props;
    const {
        adId,
        mainImage,
        price,
        created,
        avenue,
        roomCount,
        area,
        currency = 'AZN',
        city,
        isWishlist
    } = data;
    const [isFav, setIsFav] = useState(isWishlist)
    const router = useRouter()
    const addToFav = (e) => {
        e.stopPropagation()
        e.preventDefault()
        if (getUserData()) {
            setIsFav(prevState => !prevState)
            services.addToFav(+adId)
        } else router.push({
            pathname: 'https://user.treo.az',
            query: {site: 'auto'}
        })
    }

    return (
        !vertical ?
            <Link href={'/property/' + adId}>
                <a>
                    <div className={`${css.card} ${hasShadow ? 'box-shadow' : ''}`}>
                    <span className={`${css.card__mileage} p-8 txt--sm`}>
                        {roomCount} Otaq | {area} m²
                    </span>
                        <div className={`${css.card__image}`}>
                            <img src={mainImage} alt={"elan"}/>
                        </div>
                        <div className={`${css.card__details} p-16`}>
                            <p className={`${css.card__price} txt--lg text-black medium-txt mb-10`}>
                                {price} {currency}
                            </p>
                            <p className={`${css.card__name} medium-txt text-black mb-10`}>
                                {avenue}
                            </p>
                            <p className={`${css.card__date} gray-txt txt--sm`}>
                                {city}, {renderDateFormat(created)} {extractTime(created)}
                            </p>
                            {
                                hasFav ? (
                                        <span className={`${css.card__fav} ${isFav && css.card__favGreen}`}
                                              onClick={(e) => {
                                                  addToFav(e)
                                              }}>
                                        <FontAwesomeIcon icon={[isFav ? 'fa' : 'far', "heart"]}/>
                                    </span>
                                    )
                                    :
                                    null
                            }

                        </div>
                    </div>
                </a>
            </Link>
            :
            <Link href={'/property/' + adId}>
                <a className={css.cardLink}>
                    <div className={`${css.card} ${vertical ? css.cardVertical : ''} ${hasShadow ? 'box-shadow' : ''}`}>
                    <span className={`${css.card__mileage} ${css.cardVertical__mileage} p-8 txt--sm`}>{roomCount} Otaq | {area} m²</span>
                        <div className={`${css.card__image} ${css.cardVertical__image}`}>
                            <img src={mainImage} alt={"elan"}/>
                        </div>
                        <div className={`${css.card__details} ${css.cardVertical__details} p-16`}>
                            <p className={`${css.card__price} txt--lg text-black medium-txt mb-10`}>
                                {price}
                            </p>
                            <p className={`${css.card__name} ${css.cardVertical__name} medium-txt text-black mb-10`}>
                                {avenue}

                            </p>
                            <p className={`${css.card__date} ${css.cardVertical__date} gray-txt txt--sm`}>
                                {city}, {renderDateFormat(created)} {extractTime(created)}
                            </p>
                            {
                                hasFav ? (
                                        <span className={`${css.card__fav} ${css.cardVertical__fav}`} onClick={(e) => {
                                            addToFav(e)
                                        }}>
                                        <FontAwesomeIcon icon={[isFav ? 'fa' : 'far', "heart"]}/>
                                    </span>
                                    )
                                    :
                                    null
                            }
                        </div>
                    </div>
                </a>
            </Link>

    );
}

export default PropertySaleCard;
