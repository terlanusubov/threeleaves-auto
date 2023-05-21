import React, {useState, useEffect} from 'react';
import css from './line-select.module.scss'
import {generateGuid} from "../../../helpers/common-functions";
import Image from "next/image";
import expandArrowUp from "../../../../assets/images/expand-arrow-up-green.svg";
import expandArrowDown from "../../../../assets/images/export-arrow-down-green.svg";

function LineSelect({change, items, value}) {

    const [screen, setScreen] = useState(1200);
    const [expandCount, setExpandCount] = useState(1);

    const expand = ()=>{
        setExpandCount(prev=>prev+1)
    }

    const handleChange = (value) => {
        change(value)
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
            count: 7,
        },
        768: {
            count: 5,
        },
        992: {
            count: 5,
        },
        576: {
            count: 3,
        }
    }

    const mapOptions = () => {
        const c = breakPoints[screen].count
        const elems = []
        const elemCount = c * expandCount + ((expandCount - 1) * 2)
        const itemCount = items.length
        const count = elemCount > itemCount ? itemCount : elemCount
        for (let i = 0; i < count; i++) {
            const opt = items[i]
            elems.push(
                <div onClick={() => {
                    handleChange(opt.id)
                }}
                     key={generateGuid()}
                     className={`p-15 p-md-10 py-md-15 cursor-pointer ${value && value.id === opt.id ? css.lineSelect__activeItem : ''}`}
                     // style={{width: `${100 / (c + 2)}%`}}
                >
                    <p className={`${css.lineSelect__item}`}>
                        {opt.name}
                    </p>
                </div>
            )
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
        <div className={`${css.lineSelect} p-5`}>
            <div className="container-fluid">
                <div className="row">
                    {
                        mapOptions()
                    }
                    {
                        items.length > breakPoints[screen].count && expandCount * breakPoints[screen].count < items.length ?
                            <div className={'d-flex align-center justify-center px-15 px-md-10'}>
                                <div  className={`${css.lineSelect__more} d-flex align-center cursor-pointer user-select-none`}
                                     onClick={expand}
                                >
                                    <Image width={screen <= 768 ? 12 : 18 } src={expandArrowDown}/>
                                    <span className={'green-txt medium-txt ml-12 ml-md-6'}>
                                Daha əvvəl
                            </span>
                                </div>
                            </div>
                            :
                            null
                    }
                </div>
            </div>
        </div>
    );
}

export default LineSelect;
