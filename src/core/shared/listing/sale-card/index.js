import React, {useEffect, useState} from 'react';
import css from './sale-card.module.scss'
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {beautifyLargeNumbers, extractTime, renderDateFormat} from "../../../helpers/common-functions";
import * as services from '../../../../services/profile.services'
import {getUserData} from "../../../configs/auth.config";
import {useRouter} from "next/router";
function SaleCard(props) {
    const {data, hasFav = true, hasShadow, vertical = false} = props;
    const {adId, mainImage, brand, model, releaseYear, price, published, ride, currency = 'AZN', city, isWishlist} = data;
    const [isFav, setIsFav] = useState(isWishlist)
    const router = useRouter()
    const addToFav = (e) => {
        e.stopPropagation()
        e.preventDefault()
        if (getUserData()){
            setIsFav(prevState => !prevState)
            services.addToFav(+adId)
        }
        else router.push({
            pathname: 'https://user.treo.az',
            query: {site: 'auto'}
        })
    }

    return (
        !vertical ?
            <Link href={'/auto/'+adId}>
                <a>
                    <div className={`${css.card} ${hasShadow ? 'box-shadow' : ''}`}>
                    <span className={`${css.card__mileage} p-8 txt--sm`}>
                        {beautifyLargeNumbers(ride)} km
                    </span>
                        <div className={`${css.card__image}`}>
                            <img src={mainImage} alt={"elan"}/>
                        </div>
                        <div className={`${css.card__details} p-16`}>
                            <p className={`${css.card__price} txt--lg text-black medium-txt mb-10`}>
                                {beautifyLargeNumbers(price)} {currency}
                            </p>
                            <p className={`${css.card__name} medium-txt text-black mb-10`}>
                                {brand} {model}, {releaseYear}
                            </p>
                            <p className={`${css.card__date} gray-txt txt--sm`}>
                                {city}, {renderDateFormat(published)} {extractTime(published)}
                            </p>
                            {
                                hasFav ? (
                                        <span className={`${css.card__fav} ${isFav && css.card__favGreen}`} onClick={(e) => {
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
            <Link href={'/auto/'+adId}>
                <a className={css.cardLink}>
                    <div className={`${css.card} ${vertical ? css.cardVertical : ''} ${hasShadow ? 'box-shadow' : ''}`}>
                    <span className={`${css.card__mileage} ${css.cardVertical__mileage} p-8 txt--sm`}>
                        {ride} km
                    </span>
                        <div className={`${css.card__image} ${css.cardVertical__image}`}>
                            <img src={mainImage} alt={"elan"}/>
                        </div>
                        <div className={`${css.card__details} ${css.cardVertical__details} p-16`}>
                            <p className={`${css.card__price} txt--lg text-black medium-txt mb-10`}>
                                {price}
                            </p>
                            <p className={`${css.card__name} ${css.cardVertical__name} medium-txt text-black mb-10`}>
                                {brand} {model}, {releaseYear}
                            </p>
                            <p className={`${css.card__date} ${css.cardVertical__date} gray-txt txt--sm`}>
                                {city}, {renderDateFormat(published)} {extractTime(published)}
                            </p>
                            {/*{*/}
                            {/*    hasFav ? (*/}
                            {/*            <span className={`${css.card__fav} ${css.cardVertical__fav}`} onClick={(e) => {*/}
                            {/*                addToFav(e)*/}
                            {/*            }}>*/}
                            {/*            <FontAwesomeIcon icon={[isFav ? 'fa' : 'far', "heart"]}/>*/}
                            {/*        </span>*/}
                            {/*        )*/}
                            {/*        :*/}
                            {/*        null*/}
                            {/*}*/}

                        </div>
                    </div>
                </a>
            </Link>

    );
}

export default SaleCard;
