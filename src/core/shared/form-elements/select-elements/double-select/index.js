import css from '../select.module.scss'
import arrowDown from '../../../../../assets/images/export-arrow-down.svg'
import arrowUp from '../../../../../assets/images/expand-arrow-up.svg'
import {useState} from "react";
import Image from "next/image";
import {generateGuid} from "../../../../helpers/common-functions";
import {useEffect, useRef} from "react";
function DoubleSelect({data, noBorder = false, classes, valueClasses, change = ()=>{}, hasIcon = true, isDouble = false, optionListClasses, color = 'white'}) {
    const ref = useRef(null)
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState({title: '', value: '0'})

    useEffect(()=>{
        let defaultValue = data.options.find(opt => data.value === opt.value);
        setValue({...defaultValue})
        document.addEventListener('click', handleClickOutside)
    }, [data])



    const handleToggle = (e) => {
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
                className={`${css.select__container} d-flex ${value.value !== '0' && data.placeholder ? 'justify-between' : 'justify-center'}`}>
                {
                    data.placeholder ?
                        <>
                            <p className={`${css.select__placeholder} ${value.value !== '0' ? css.select__placeholderActive : ''}`}>
                                {data.placeholder}
                            </p>
                            {
                                value.value !== '0' ?
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
                    }} className={`${css.select__optionsList} ${isOpen ? css.select__optionsActive : ''} ${optionListClasses} ${css[color]}`}>
                        {
                            data.options.map(opt => (
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

export default DoubleSelect;
