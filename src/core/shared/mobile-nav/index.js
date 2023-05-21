import React, {useState} from 'react';
import css from './mobile-nav.module.scss'
import home from '../../../assets/images/home.svg'
import homeActive from '../../../assets/images/home-active.svg'
import search from '../../../assets/images/search.svg'
import searchActive from '../../../assets/images/search-active.svg'
import add from '../../../assets/images/add-sale.svg'
import addActive from '../../../assets/images/add-sale-active.svg'
import fav from '../../../assets/images/fav.svg'
import favActive from '../../../assets/images/fav-active.svg'
import profile from '../../../assets/images/profile.svg'
import profileActive from '../../../assets/images/profile-active.svg'
import {generateGuid} from "../../helpers/common-functions";
import Image from "next/image";
import Link from "next/link";
import NavLink from "../nav-link";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {toggleSearchbar} from "../../../store/actions/public-actions";

function Index(props) {
    const dispatch = useDispatch()
    const router = useRouter()
    const [onSearch, setOnSearch] = useState(false)
    const [items, setItems] = useState([
        {
            name: 'Home',
            isLink: true,
            path: '/',
            icon: home,
            activeIcon: homeActive,
            isActive: true,
            exact: true,
        },
        {
            name: 'Search',
            isLink: false,
            icon: search,
            activeIcon: searchActive,
            isActive: false,
        },
        {
            name: 'Add Sale',
            isLink: true,
            path: '/publish',
            icon: add,
            activeIcon: addActive,
            isActive: false,
            exact: false,
        },
        {
            name: 'Fav',
            isLink: true,
            path: 'https://user.treo.az/profile/favorites',
            icon: fav,
            activeIcon: favActive,
            isActive: false,
        },
        {
            name: 'Profile',
            isLink: true,
            path: 'https://user.treo.az/profile',
            icon: profile,
            activeIcon: profileActive,
            isActive: false,
        },
    ])

    const handleItemClick = ({isLink, path, name}) => {
        setItems(prev => {
            let newItems = prev.map(item => {
                if (item.name === name) {
                    return {
                        ...item,
                        isActive: true
                    }
                }
                return {...item, isActive: false}
            })
            return [...newItems]
        })
        if (isLink) {
            setOnSearch(false)
            dispatch(toggleSearchbar(false))

        }
        else {
            setOnSearch(true)
            dispatch(toggleSearchbar(true))
            window.scrollTo(0,0)
        }
    }
    return (
        <div className={`${css.wrapper}`}>
            <div className={`${css.menu}`}>
                {
                    items.map(item => {
                        if (item.isLink) {
                            return <NavLink exact={item.exact} key={generateGuid()} href={item.path} activeClass={!onSearch ? css.menu__itemActive : ''}>
                                <div
                                    className={`${css.menu__item}`}
                                    onClick={() => {
                                        handleItemClick(item)
                                    }
                                    }
                                >
                                    <Image src={router.pathname === item.path && !onSearch ? item.activeIcon : item.icon}/>
                                </div>
                            </NavLink>
                        }
                        return <div key={generateGuid()}
                                    className={`${css.menu__item} ${item.isActive ? css.menu__itemActive : ''}`}
                                    onClick={() => {
                                        handleItemClick(item)
                                    }
                                    }
                        >
                            <Image src={item.isActive ? item.activeIcon : item.icon}/>
                        </div>
                    })
                }
            </div>
        </div>
    );
}

export default Index;
