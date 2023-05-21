import React, {useState} from 'react';
import homeCss from "../index.module.scss";
import css from "./about.module.scss";
import Blur from "../../src/core/shared/blur";
import GrayBackdrop from "../../src/core/shared/gray-backdrop";
import Image from "next/image";
import fire from "../../src/assets/images/fire.svg";
import Link from "next/link";
import aboutCover from '../../src/assets/images/about/about.png'
import UrgentItems from "../../src/core/shared/urgent-items";
import {SocialLinksConfig} from "../../src/core/configs/social-links.config";
import SocialLink from "../../src/core/shared/social-link";
import {useSelector} from "react-redux";
import * as services from "../../src/services";
import FloatingPanel from "../../src/core/shared/floating-panel";
import Head from "next/head";

export async function getServerSideProps(context) {
    const [urgentListings] = await Promise.all([
        services.getCarList({AdTypeId: 20, page: 1}).then(res => res.ads) || [],
    ]);
    return {
        props: {
            urgentListings,
        }
    }
}

function About(props) {
    const searchbarOpen = useSelector(({publicState}) => publicState.searchOpen)
    const searchFocused = useSelector(({publicState}) => publicState.searchFocused)
    const [footerLinks, setFooterLinks] = useState([
        {title: 'Avtosalonlar', url: '/dealerships'},
        {title: 'Qaydalar', url: 'https://user.treo.az/rules'},

        // {title: 'Reklamın yerləşdirilməsi', url: '/ad'}
    ])
    return (
        <div className={`${homeCss.home} page-content ${searchbarOpen ? homeCss.homeActive : ''} pt-40`}>
            <Head>
                <title>
                    Treo - Haqqımızda
                </title>
            </Head>
            {
                searchFocused ? <Blur/> : null
            }
            <GrayBackdrop/>
            <div className="custom-container pb-100">
                <div className={'mb-14'}>
                    <div className="d-flex gray-txt txt--sm align-center">
                        <Link href={'/'}>
                            <a className={'gray-txt txt--sm'}>
                                Əsas səhifə
                            </a>
                        </Link>
                        <span className={'gray-txt txt mx-5'}>—</span>
                        <Link href={'/about'} shallow>
                            <a className={'gray-txt txt--sm'}>
                                Haqqımızda
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-9">
                        <p className={'card-title bold-txt'}>
                            Haqqımızda
                        </p>
                        <div className={css.about__cover}>
                            <Image src={aboutCover}/>
                        </div>
                        <div className={'pb-70'}>

                            <article>
                                <h1 className={'txt txt--xxl medium-txt mb-20'}>
                                    Biz kimik?
                                </h1>
                                <p className={css.about__article}>
                                    Hər bir böyük biznes hekayəsi kimi bizim hekayəmiz də müştəridən, yəni səndən
                                    başlayır. Sənin istək və ehtiyacların bizim üçün çox vacibdir. Əsas məqsədimiz ən
                                    yaxşı xidmət göstərməklə səni sevindirmək və büdcənə, istəyinə uyğun, düzgün məhsul
                                    seçimi etməkdə sənə yardımçı olmaqdır.
                                    Rəqəmsal və məişət texnikası, mebel və tekstil satışı üzrə ölkənin ən böyük
                                    mağazalar şəbəkəsindən biri kimi səni sevindirmək üçün nələr edirik?
                                    <br/>
                                    <br/>
                                    Sevilən brendləri sənə daha yaxın gətiririk:Biz Samsung, LG, Bosch, Huawei, Realme,
                                    Sony, Panasonic, BQ, Sonorous, Elari, Thomas, Beurer, Black & Olufsen, Karcher, H
                                    Gala, Cassore, Simge mobilya kimi 30-dan çox beynəlxalq brendin rəsmi distributoru,
                                    Dyson, Toshiba, Electrolux, WHAL, Black&Decker, Hoffmann kimi beynəlxalq brendlərin
                                    Azərbaycanda eksklüziv distributoru.
                                    Brend portfoliomuz durmadan böyüyür, odur ki, sevdiyin dünya brendlərinin
                                    məhsullarını rahatlıqla Kontakt Home mağazalarından əldə edə bilərsən.
                                    Axtardığın hər şeyi bir məkana toplamışıq:, iş, dərs, ev, əyləncə və istirahət üçün
                                    arzuladığın məhsulların çox geniş çeşidini eyni məkanda. Konsept mağazalarımızda isə
                                    rəqəmsal texnikanın geniş çeşidi təqdim olunub. Rahatlığın üçün mağazalarımızın
                                    yerini sənə ən rahat ünvanlarda seçmişik.
                                    <br/>
                                    Sənin məmnunluğun üçün əlavə xidmətlər təklif edirik: Məhsullarımıza 3 ilədək rəsmi
                                    zəmanət təqdim edirik. Bütün zəmanət müddətində məhsulla bağlı hər hansı çətinliyin
                                    yaranarsa, partnyor servis mərkəzləri ilə çətinliyini qısa müddətdə aradan
                                    qaldırırıq. Bundan başqa, rahatlığını düşünərək məhsulun təmirdə olduğu müddətdə
                                    sənə əvəzləyici məhsul təklif edirik. İşdir, məhsulunun təmiri partnyor servis
                                    mərkəzlərində 14 gün ərzində yekunlaşmazsa, biz o məhsulu sənin üçün tamamilə yenisi
                                    ilə əvəz edəcəyik. Bəli, bu qədər iddialıyıq.
                                    <br/>
                                    Sosial öhdəliyimizi yerinə yetiririk: Həyata keçirdiyimiz və dəstək olduğumuz sosial
                                    məsuliyyət layihələri ilə cəmiyyətdə yeni müsbət dəyərlər yaratmağa çalışırıq.
                                    Həmişə əlçatanıq: Sənə bir zəng qədər yaxınıq. Çağrı Mərkəzinə zəng edərək məhsul və
                                    xidmətlərimizlə bağlı bütün suallarını ünvanlaya bilərsən. Bizi həmçinin sosial
                                    şəbəkələrdə də asanlıqla tapa bilərsən.
                                </p>
                            </article>
                        </div>

                    </div>
                    <div className="col-lg-3 invisible-md">
                        <FloatingPanel>
                            <div className={`d-flex justify-between align-end pb-16 pt-11`}>
                                <div className="d-flex align-end bold-txt">
                                    <Image src={fire} alt={'Urgent'}/>
                                    <span className={'red-txt ml-10 medium-txt'}>
                                        Təcili satılır
                                    </span>
                                </div>
                                <Link href={'/auto/urgent'}>
                                    <a>
                                        <span className={'gray-txt'}>Hamısı</span>
                                    </a>
                                </Link>
                            </div>
                            <div className={'invisible-md'}>
                                <UrgentItems/>
                            </div>
                            <div className="mt-40 invisible-md">
                                <p className={'txt--sm gray-txt text-center mb-20'}>
                                    Sosial şəbəkələrimiz
                                </p>
                                <div className={`d-flex justify-between px-25 mb-50`}>
                                    {
                                        SocialLinksConfig.map(data => {
                                            return <SocialLink key={data.url + data.icon + data.bg} data={data}/>
                                        })
                                    }
                                </div>
                                <div>
                                    {
                                        footerLinks.map(link => (
                                            <Link key={link.url + link.title} href={link.url}>
                                                <a className={'gray-txt medium-txt mb-20 d-block text-center'}>
                                                    {link.title}
                                                </a>
                                            </Link>
                                        ))
                                    }
                                </div>
                                <div className={'pt-20'}>
                                    <p className={'gray-txt gray-txt--light text-center'}>
                                        © «Treo», 2023
                                    </p>
                                </div>
                            </div>
                        </FloatingPanel>
                    </div>
                </div>
                <div className='invisible visible-md'>
                    <div className={`d-flex justify-between align-end pb-16 pt-11`}>
                        <div className="d-flex align-end bold-txt">
                            <Image src={fire} alt={'Urgent'}/>
                            <span className={'red-txt ml-10 medium-txt'}>
                                        Təcili satılır
                                    </span>
                        </div>
                        <Link href={'/auto/urgent'}>
                            <a>
                                <span className={'gray-txt'}>Hamısı</span>
                            </a>
                        </Link>
                    </div>
                    <UrgentItems mobile/>
                </div>
            </div>
        </div>

    );
}

export default About;
