import css from '../select.module.scss'
import arrowDown from '../../../../../assets/images/export-arrow-down.svg'
import arrowUp from '../../../../../assets/images/expand-arrow-up.svg'
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {generateGuid} from "../../../../helpers/common-functions";
import Checkbox from "../../checkbox";
import {useSelector} from "react-redux";

function MultiSelect({data, isColor = false, noBorder = false, classes = '', valueClasses='', change = () => {}}) {
    const ref = useRef(null);
    const dropdownItemRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState([])
    const [dropUp, setDropUp] = useState(false)
    const [maxColors, setMaxColors] = useState(7)
    const contentScroll = useSelector(({publicState}) => publicState.contentScroll)

    useEffect(() => {
        let defaultValues = data.value.map(item => {
            return data.options.find(opt => item === opt.value)
        })
        setValue([...defaultValues])
        document.addEventListener('click', handleClickOutside)
        return ()=>{
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    const handleClickOutside = (event) =>{
        if (ref && ref.current && ref.current!== null){
            if (!ref.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
    }
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

    const optionClick = (e, opt, input) => {
        change(e, opt, input)
        // setValue(prev => {
        //     let exists = prev.find(item=> item.id === opt.id)
        //     if (exists){
        //         let newValue = prev.filter(item=> item.id=== exists.id)
        //         return [...newValue]
        //     }
        //     return [...prev, {...opt}]
        // })
    }
    return (
        <div onClick={handleToggle}
             ref={ref}
             className={`${css.select}
              ${isOpen ? css.selectActive : ''}
               custom-input 
               ${classes}
               ${noBorder ? 'border-none' : ''}`}>
            <div
                className={`${css.select__container}
                 d-flex
                 ${data.value.length > '0' && data.placeholder ? 'justify-between' : 'justify-center'}`}>

                <>
                    <p className={`${css.select__placeholder} ${data.value.length !== 0 ? css.select__placeholderActive : ''}`}>
                        {data.placeholder}
                    </p>
                    {
                        isColor ?

                            data.value.length < maxColors ?
                                <div className={`${css.select__value} d-flex align-center ${valueClasses ? valueClasses : ''}`}>

                                    {
                                        // data.options.find(item=> item.value === data.value[0]).title
                                        data.value.map(clr=>{
                                            const bg = data.options.find(item=>item.value === clr).hex
                                            return (<div key={generateGuid()} className={`${css.select__colorTag} mr-10 ${bg[0] === 'h' && 'border-none'}`} style={{background : bg[0] === 'h' ? `url(${bg})` : bg}}></div>)
                                        })
                                    }

                                </div>
                                :
                                data.value.length !== 0 ? <p className={`${css.select__value} ${valueClasses ? valueClasses : ''}`}>
                                    {`${data.value.length} seçim olunub`}
                                </p> : null

                            :
                                data.value.length === 1 ?
                                    <p className={`${css.select__value} ${valueClasses ? valueClasses : ''}`}>
                                        {
                                            data.options.find(item=> item.value === data.value[0]).title
                                        }
                                    </p>
                                    :
                                    data.value.length !== 0 ? <p className={`${css.select__value} ${valueClasses ? valueClasses : ''}`}>
                                        {`${data.value.length} seçim olunub`}
                                    </p> : null

                    }

                </>

                <div className={css.select__arrow}>
                    {
                        isOpen ? <Image src={arrowUp}/> : <Image src={arrowDown}/>
                    }
                </div>
            </div>
            {
                data.options.length > 0 ?
                    <div onClick={(e) => {
                        e.stopPropagation()
                    }} className={`${css.select__optionsList} ${isOpen ? css.select__optionsActive : ''} ${dropUp && css.select__optionsListUp}`}>
                        {
                            data.options.map((opt, index) => {
                                return (
                                    index === 0 ?
                                        <div ref={dropdownItemRef}
                                            key={generateGuid()}
                                            className={`${css.select__option} ${opt.value === value.value ? css.select__optionActive : ''}`}
                                        >
                                            <Checkbox hasColor={isColor} hex={opt.hex} size={'sm'} id={opt.value} checked={opt.checked} label={opt.title} change={(e)=>{
                                                optionClick(e, opt, data.name)
                                            }}/>
                                        </div>
                                        :
                                        <div
                                            key={generateGuid()}
                                            className={`${css.select__option} ${opt.value === value.value ? css.select__optionActive : ''}`}
                                        >
                                            <Checkbox hasColor={isColor} hex={opt.hex} size={'sm'} id={opt.value} checked={opt.checked} label={opt.title} change={(e)=>{
                                                optionClick(e, opt, data.name)
                                            }}/>
                                        </div>
                                )
                            })
                        }
                    </div>
                    :
                    null
            }


        </div>
    );
}

export default MultiSelect;
