import notFound from '../../src/assets/images/404.svg'
import bg from '../../src/assets/images/404-bg.svg'
import css from './404.module.scss'
import Image from "next/image";
import Button from "../../src/core/shared/button";
import Head from "next/head";
import React from "react";
import {useSelector} from "react-redux";
function NotFound(props) {
    const screen = useSelector(({publicState}) => publicState.screen)
    return (
        <div className={css.page} >
            <Head>
                <title>
                    Treo - 404
                </title>
            </Head>
                <p className={css.page__title + ' mb-80 mb-md-30 medium-txt'}>
                    Səhifə tapılmadı
                </p>
                <Image width={screen < 992 && 280} height={screen < 992 && 120} src={notFound}/>
            <p className={css.page__desc}>
                Zəhmət olmasa url linki yoxlayın və ya aşağıdakı linkdən istifadə edin
            </p>
            <Button classes={css.page__btn} isLink href={'/'} color={'secondary'}>Ana səhifə</Button>

        </div>
    );
}

export default NotFound;
