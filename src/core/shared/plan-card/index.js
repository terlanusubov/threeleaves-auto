import React from 'react';
import css from './plan-card.module.scss'
import Link from "next/link";
import Button from "../button";
import Image from "next/image";
import fire from '../../../assets/images/fire.svg'
import clock from '../../../assets/images/clock.svg'
import diamond from '../../../assets/images/diamond.svg'
import {useSelector} from "react-redux";
function PlanCard({count = 0, name, price = 0, color = 'red', url, desc, onClick, free=false}) {

    const colors = {red: css.cardRed, blue: css.cardBlue, green: css.cardGreen, white: css.cardWhite}
    const icons = {red: fire, white: clock, green: diamond}
    const countColors = {red: css.card__countRed, blue: css.card__countBlue, white: css.card__countWhite}
    const screen = useSelector(({publicState}) => publicState.screen)

    return (
        <div className={`${css.card} ${colors[color]} p-30 p-md-20`}>
            <div className='mb-14 mb-md-10'>
                <Image width={screen < 992 ? 26 : 47} height={screen < 992 ? 26 : 47} src={icons[color] || icons.red}/>
                <p className={`txt red-txt txt--xxl bold-txt mt-15 mt-md-12 ${css.card__name}`}>{name}</p>
            </div>
            <Link href={'/'}>
                <a className={`${css.card__desc} gray-txt txt--lg mb-35 mb-md-20 d-block`}>
                    {desc}
                </a>
            </Link>

            <div className={'w-100'}>
                {
                    free ?
                        <Button click={onClick} classes={'w-100 medium-txt'}>Pulsuz yerləşdirmək</Button>
                        :
                        <Button click={onClick} classes={'w-100 medium-txt'}>{price} AZN-a yerləşdirmək</Button>

                }
            </div>

        </div>
    );
}

export default PlanCard;
