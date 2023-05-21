import React, {useState, useEffect} from 'react';
import css from './year-select.module.scss'
import {generateGuid} from "../../../helpers/common-functions";
import Image from "next/image";
import expandArrowUp from "../../../../assets/images/expand-arrow-up-green.svg";
import expandArrowDown from "../../../../assets/images/export-arrow-down-green.svg";

function YearSelect(props) {

    const [screen, setScreen] = useState(1200)
    const [expandCount, setExpandCount] = useState(1)

    const expand = ()=>{
        setExpandCount(prev=>prev+1)
    }

    const handleChange = (year) => {
        props.change(year)
    }

    const checkScreen = (size) => {
        let current = 1200
        if (size < 1200) {
            current = 768
        }
        if (size < 768) {
            current = 576
        }
        setScreen(current)
        return current

    }


    const breakPoints = {
        1200: {
            count: 11,
        },
        768: {
            count: 9,
        },
        992: {
            count: 9,
        },
        576: {
            count: 4,
        }
    }

    const currentYear = new Date().getFullYear()

    const mapYears = () => {
        const c = breakPoints[screen].count
        const elems = []
        const elemCount = c * expandCount + ((expandCount - 1) * 2)
        for (let i = 0; i < elemCount; i++) {
            const year = currentYear - i
            if (year >= 1900){
                elems.push(
                    <div onClick={() => {
                        handleChange(year)
                    }}
                         key={generateGuid()}
                         className={`p-0 py-15 ${props.value === year ? css.yearSelect__activeItem : ''}`}
                         style={{width: `${100 / (c + 2)}%`}}
                    >
                        <p className={`${css.yearSelect__item}`}>
                            {year}
                        </p>
                    </div>
                )
            }
        }
        return elems
    }

    useEffect(() => {
        document.body.offsetWidth
        checkScreen(document.body.offsetWidth)
        window.addEventListener('resize', (e) => {
            checkScreen(e.target.innerWidth)
        })
    }, [])

    return (
        <div className={`${css.yearSelect} p-5`}>
            <div className="container-fluid">
                <div className="row">
                    {
                        mapYears()
                    }
                    {
                        mapYears().length < 122 &&
                        <div className={'d-flex align-center justify-center'} style={{width: `${200 / (breakPoints[screen].count + 2)}%`}}>
                            <div className={`${css.yearSelect__more} d-flex align-center cursor-pointer user-select-none`}
                                 onClick={expand}
                            >
                                <Image width={screen <= 768 ? 12 : 18 } src={expandArrowDown}/>
                                <span className={'green-txt medium-txt ml-12'}>
                                Daha əvvəl
                            </span>
                            </div>
                        </div>
                    }

                </div>
            </div>
        </div>
    );
}

export default YearSelect;
