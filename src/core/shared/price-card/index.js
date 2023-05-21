import React from 'react';
import css from './price-card.module.scss'
import Link from "next/link";
import Button from "../button";

function PriceCard({count = 0, price = 0, color = 'red', url, desc, onClick}) {

    const colors = {red: css.cardRed, blue: css.cardBlue, green: css.cardGreen}
    const countColors = {red: css.card__countRed, blue: css.card__countBlue, green: css.card__countGreen}

    return (
        <div className={`${css.card} ${colors[color]} p-30`}>
            <p className={`${css.card__count} ${countColors[color]} bold-txt mb-15`}>
                {count} elan
            </p>
            <Link href={'/'}>
                <a className={'gray-txt txt--lg mb-35 d-block'}>
                    {desc}
                </a>
            </Link>

            <div className={'w-100'}>
                <Button click={onClick} classes={'w-100'}>{price} AZN-a tarif almaq</Button>
            </div>

        </div>
    );
}

export default PriceCard;
