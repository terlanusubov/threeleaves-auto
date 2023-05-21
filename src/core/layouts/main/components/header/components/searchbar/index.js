import React, {useCallback, useEffect, useState} from 'react';
import css from './searchbar.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSearchResults} from "../../../../../../../services/swr-services";
import {generateGuid} from "../../../../../../helpers/common-functions";
import Link from "next/link";
import {useRouter} from "next/router";
import clear from '../../../../../../../assets/images/clear-x.svg'
import Image from "next/image";
import {useDispatch} from "react-redux";
import {toggleSearchbarBackdrop} from "../../../../../../../store/actions/public-actions";
import * as services from '../../../../../../../services'
import debounce from 'lodash.debounce'

function Searchbar(props) {
    const [focused, setFocused] = useState(false)
    const [shouldSearch, setShouldSearch] = useState(false);
    const [inputVal, setInputVal] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const dispatch = useDispatch()
    const router = useRouter()
    const handleFocus = debounce((focused) => {
        setFocused(focused)
        if (!focused) {
            setShouldSearch(false)
            if (props.mobile && !props.noResult) {
                dispatch(toggleSearchbarBackdrop(false))
            }
        } else {
            setShouldSearch(true)
            if (props.mobile && !props.noResult) {
                dispatch(toggleSearchbarBackdrop(true))
            }
        }

    }, 100)

    const debouncedSearch = useCallback(
        debounce((val) => {
            services.generalSearch(val)
                .then((res) => {
                    setSearchResult(res.brands)
                })
            // this.props.getFoldersList({name: val, parentFolderId : 0 })
        }, 300)
        , [])

    const handleSearch = (e) => {
        setInputVal(e.target.value)
        if (!props.noResult) debouncedSearch(e.target.value)
        if (e.target.value.trim() !== '') {
            setShouldSearch(true)
            // props.onSearch(e.target.value)
        } else {
            setShouldSearch(false)
            // setSearchResult([])
        }
    }

    const searchResultClick = (brandId) => {
router.push({
    pathname : '/auto',
    query : {brandId}
})
    }
    const resetInputVal = (e) => {
        setInputVal('')
        debouncedSearch('')
    }

    useEffect(() => {
        props.onSearch(inputVal)
        // if (!props.noResult){
        //     services.generalSearch(inputVal)
        //         .then((res)=>{
        //             setSearchResult(res.brands)
        //         })
        // }

    }, [inputVal])

    return (
        <div className={`${css.searchbar}`}>
            <form onSubmit={event => event.preventDefault()}
                  className={`${css.searchbar__form} ${focused ? css.focused : ''}`}>
                <input value={inputVal} onChange={handleSearch} onFocus={() => {
                    handleFocus(true)
                }} onBlur={() => {
                    handleFocus(false)
                }} placeholder={props.placeholder || 'Brendlər üzrə axtarış'} type="text"
                       className={css.searchbar__input}/>
                <div className={css.searchbar__buttonWrapper}>
                    <button type={"submit"} className={css.searchbar__button}>
                        <FontAwesomeIcon icon={'magnifying-glass'}/>
                    </button>
                </div>
                {
                    shouldSearch && inputVal.trim() !== '' ?
                        <div onMouseDown={resetInputVal} className={css.searchbar__clear}>
                            <Image src={clear}/>
                        </div> : null
                }
            </form>
            {
                !props.noResult ? searchResult && searchResult.length > 0 && focused ?
                        <div className={`${css.results} ${props.mobile ? css.resultsMobile : ''}`}>
                            {
                                searchResult.map(res =>
                                    // <Link key={generateGuid()} href={{pathname: '/auto', query: {brandId: res.id}}}>
                                    //     <a>
                                            <div key={generateGuid()} onClick={()=>{searchResultClick(res.id)}} className={css.results__item + ' cursor-pointer'}>
                                                <div className={css.results__img}>
                                                    <img src={res.icon} alt=""/>
                                                </div>
                                                <div className={css.results__item__title}>
                                                    <p className={'medium-txt'}>
                                                        {res.name}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className={'gray-txt txt--sm'}>
                                                        {/*{res.type}*/}
                                                        Brend
                                                    </p>
                                                </div>
                                            </div>
                                        // </a>
                                    // </Link>
                                )
                            }

                        </div> : null
                    :
                    null
            }

        </div>
    );
}

export default Searchbar;
