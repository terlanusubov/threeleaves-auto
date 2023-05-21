import css from './agency-card.module.scss'
import Link from "next/link";
import Image from "next/image";
import phone from "../../../../assets/images/listing/phone.svg";
import gps from "../../../../assets/images/listing/gps.svg";
import phoneMaskConfig from "../../../configs/phone.config";
import {useSelector} from "react-redux";

function AgencyCard(props) {
    const screen = useSelector(({publicState}) => publicState.screen)
    const {data,  hasShadow} = props;
    const {id, avatar, name, phones, extraInformation, address, adCount, cityName} = data;
    return (
            <Link href={'/dealerships/' + id}>
                <a>
                    <div className={`${css.card} ${hasShadow ? 'box-shadow' : ''}`}>
                    <span className={`${css.card__mileage} p-8 txt--sm`}>
                       {adCount} elan
                    </span>
                        <div className={`${css.card__image}`}>
                            <img src={avatar}/>
                        </div>
                        <div className={`${css.card__details} pt-16`}>
                            <p className={`${css.card__price} ellipsis-txt txt--lg text-black medium-txt mb-10 px-16`}>
                                {name}
                            </p>
                            <p className={`${css.card__info} ${screen < 992 ? 'txt--xxs' : 'txt--sm'} text-black mb-10 px-16 ${!!extraInformation ? '' : 'visibility-hidden'}`}>
                                {extraInformation || 'x'}
                            </p>
                            <div>
                                <div className={css.card__listData + ' py-17 px-16 py-md-10 px-md-10'}>
                                    <div className="d-flex align-center justify-between">
                                        <div className={css.card__phones}>
                                            <span className={`gray-txt d-block ${screen < 992 ? 'txt--xxs' : 'txt--sm'} ${phones.length > 1 && 'mb-10'}`}>{phoneMaskConfig.apply(phones[0])}</span>
                                            {phones[1] && <span className={`gray-txt d-block ${screen < 992 ? 'txt--xxs' : 'txt--sm'}`}>{phoneMaskConfig.apply(phones[1])}</span>}
                                        </div>
                                        <Image width={screen < 992 ? 10 : 18} src={phone}/>
                                    </div>
                                </div>
                                {
                                    !!cityName &&
                                    <div className={css.card__listData + ' py-17 px-16 py-md-10 px-md-10'}>
                                        <div className="d-flex align-center justify-between">
                                            {
                                                cityName ?
                                                    <span className={`gray-txt ellipsis-txt ${screen < 992 ? 'txt--xxs' : 'txt--sm'}`}>{cityName}, {address}</span>
                                                    :
                                                    <span className={`gray-txt ellipsis-txt ${screen < 992 ? 'txt--xxs' : 'txt--sm'}`}></span>
                                            }
                                            <Image width={screen < 992 ? 10 : 18} src={gps}/>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </a>
            </Link>
    );
}

export default AgencyCard;
