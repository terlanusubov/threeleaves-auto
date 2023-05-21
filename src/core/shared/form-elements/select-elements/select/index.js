import css from '../select.module.scss'
import arrowDown from '../../../../../assets/images/export-arrow-down.svg'
import arrowUp from '../../../../../assets/images/expand-arrow-up.svg'
import {useState} from "react";
import Image from "next/image";
import {generateGuid} from "../../../../helpers/common-functions";
import {useEffect, useRef} from "react";
import {useSelector} from "react-redux";
function Select({data, noBorder = false, classes, valueClasses, change = ()=>{}, hasIcon = true, isDouble = false, optionListClasses, color = 'white', noPlaceholder}) {
    const ref = useRef(null);
    const dropdownItemRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState({title: '', value: '0'})
    const contentScroll = useSelector(({publicState}) => publicState.contentScroll)
    const [dropUp, setDropUp] = useState(false)

    useEffect(()=>{
        let defaultValue = data.options.find(opt => data.value === opt.value);
        setValue({...defaultValue})
        document.addEventListener('click', handleClickOutside)

    }, [data])

    const handleToggle = () => {
        const elemPos = ref.current.getBoundingClientRect().bottom
        const windowHeight = window.innerHeight
        let dropdownHeight = 0
        if (data.options) {
            dropdownHeight = (dropdownItemRef.current.clientHeight * data.options.length) + 20
            if (dropdownHeight > 430){
                dropdownHeight = 430
            }
        }

        const bottomRemaining = windowHeight - elemPos
        const topRemaining = elemPos
        const exceedsTop = topRemaining + contentScroll < dropdownHeight + 70
        if (topRemaining > bottomRemaining && !exceedsTop){
            setDropUp(true)
        }
        else setDropUp(false)
        setIsOpen(prev => !prev)

    }
    const optionClick = (e, opt) => {
        setValue({...opt})
        setIsOpen(false)
        change(opt.value)
    }

    const handleClickOutside = (event) =>{
        if (ref && ref.current && ref.current!== null){
            if (!ref.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
    }

    return (
        <div ref={ref} onClick={handleToggle}
             className={`${css.select} ${isOpen && !isDouble ? css.selectActive : ''} custom-input ${noBorder ? 'border-none' : ''} ${classes} ${css[color]}`}>
            <div
                className={`${css.select__container} d-flex ${value.value !== '0' && value.value !=='' && data.placeholder ? 'justify-between' : 'justify-center'}`}>
                {
                    data.placeholder ?
                        <>
                            <p className={`${css.select__placeholder} ${value.value !== '0' && value.value !=='' ? css.select__placeholderActive : ''}`}>
                                {data.placeholder}
                            </p>
                            {
                                value.value !== '0' && value.value !=='' ?
                                    <p className={`${css.select__value} ${valueClasses ? valueClasses : ''}`}>
                                        {value.title}
                                    </p>
                                    :
                                    null
                            }
                        </>
                        :

                        <p className={`${css.select__value} ${valueClasses ? valueClasses : ''}`}>
                            {value.title}
                        </p>

                }

                {
                    hasIcon ?
                        <div className={css.select__arrow}>
                            {
                                isOpen ? <Image src={arrowUp}/> : <Image src={arrowDown}/>
                            }
                        </div>
                        :
                        null
                }
            </div>
            {
                data.options.length > 0 ?
                    <div onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                    }} className={`${css.select__optionsList} ${isOpen ? css.select__optionsActive : ''} ${dropUp && css.select__optionsListUp} ${optionListClasses} ${css[color]}`}>
                        {
                            data.options.map((opt, index) => (
                                index === 0 ?
                                    <div ref={dropdownItemRef} onClick={(e) => {
                                        optionClick(e, opt)
                                    }}
                                         id={opt.value}
                                         key={generateGuid()}
                                         className={`${css.select__option} ${opt.value === value.value ? css.select__optionActive : ''}`}
                                    >
                                        <span>{opt.title}</span>
                                    </div>
                                    :
                                    <div onClick={(e) => {
                                        optionClick(e, opt)
                                    }}
                                         id={opt.value}
                                         key={generateGuid()}
                                         className={`${css.select__option} ${opt.value === value.value ? css.select__optionActive : ''}`}
                                    >
                                        <span>{opt.title}</span>
                                    </div>
                            ))
                        }
                    </div>
                    :
                    null
            }


        </div>
    );
}

export default Select;
