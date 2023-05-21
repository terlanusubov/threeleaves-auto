import css from '../select.module.scss'
import arrowDown from '../../../../../assets/images/export-arrow-down.svg'
import arrowUp from '../../../../../assets/images/expand-arrow-up.svg'
import x from '../../../../../assets/images/x.svg'
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {generateGuid} from "../../../../helpers/common-functions";
import Checkbox from "../../checkbox";

function ExtendedSelect({
                            data,
                            // popularData = [],
                            popularTitle = '',
                            isColor = false,
                            noBorder = false,
                            classes = '',
                            valueClasses = '',
                            change = () => {
                            },
                            selectAll,
                            disabled
                        }) {
    const ref = useRef(null)
    const popular = data.popular.map(item => {
        return data.options.find(opt => opt.value === item.id)
    })

    // const allOptions = data.optionsParsed.map(item=>{
    //     item.models.forEach()
    //     return data.options.find(opt=>opt.value === item.id)
    // })

    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState([])
    const [maxColors, setMaxColors] = useState(7)
    const [allSelected, setAllSelected] = useState(false)
    useEffect(() => {
        let defaultValues = data.value.map(item => {
            return data.options.find(opt => item === opt.value)
        })
        setValue([...defaultValues])
        document.addEventListener('click', handleClickOutside)
    }, [])
    const handleClickOutside = (event) => {
        if (ref && ref.current && ref.current !== null) {
            if (!ref.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
    }
    const handleToggle = (e) => {
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

    const handleSelectAll = (input, value) => {
        selectAll(value, input)
        setAllSelected(value)
    }
    return (
        <div ref={ref}
             onClick={handleToggle}
             className={`${css.select}
              ${isOpen ? css.selectActive : ''}
               custom-input 
               ${classes}
               ${disabled ? css.selectDisabled : ''}
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
                                <div
                                    className={`${css.select__value} d-flex align-center ${valueClasses ? valueClasses : ''}`}>

                                    {
                                        // data.options.find(item=> item.value === data.value[0]).title
                                        data.value.map(clr => {
                                            return (
                                                <div key={generateGuid()} className={`${css.select__colorTag} mr-10`}
                                                     style={{backgroundColor: data.options.find(item => item.value === clr).hex}}></div>
                                            )
                                        })
                                    }

                                </div>
                                :
                                data.value.length !== 0 ?
                                    <p className={`${css.select__value} ${valueClasses ? valueClasses : ''}`}>
                                        {`${data.value.length} seçim olunub`}
                                    </p> : null

                            :
                            data.value.length === 1 ?
                                <p className={`${css.select__value} ${valueClasses ? valueClasses : ''}`}>
                                    {
                                        data.options.find(item => item.value === data.value[0])?.title
                                    }
                                </p>
                                :
                                data.value.length !== 0 ?
                                    <p className={`${css.select__value} ${valueClasses ? valueClasses : ''}`}>
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
                    }}
                         className={`${css.select__optionsList} ${isOpen ? css.select__optionsExtendedActive : ''} ${css.select__optionsListExtended}`}>
                        <div
                            className={`${css.select__extended__optionsHead} d-flex pb-24 border-bottom border-bottom--soft`}>
                            <Checkbox size={'sm'}
                                      id={'all-models'}
                                      checked={allSelected}
                                      label={'Hamısını seç'}
                                      change={(val) => {
                                          handleSelectAll(data.name, val)
                                      }}
                            />
                            <div className={`${css.select__reset} d-flex justify-center`} onClick={() => {
                                handleSelectAll(data.name, false)
                            }}>
                                <Image src={x}/>
                                <span className={'ml-11'}>
                                    Sıfırlamaq
                                </span>
                            </div>
                        </div>
                        {
                            !!popular.length &&
                            <div className={'pt-24 pb-15'}>
                                <p className={'gray-txt bold-txt txt--lg'}>
                                    {popularTitle}
                                </p>
                                <div className="container-fluid">
                                    <div className={'pt-18 row'}>
                                        {
                                            popular.map(opt => {
                                                return (
                                                    <div
                                                        key={generateGuid()}
                                                        className={`${css.select__option} ${opt.value === value.value ? css.select__optionActive : ''} col-lg-4 col-md-6 col-sm-12 col-12`}
                                                    >
                                                        <Checkbox hasColor={isColor} color={opt.hex} size={'sm'}
                                                                  id={opt.value}
                                                                  checked={opt.checked} label={opt.title}
                                                                  change={(e) => {
                                                                      optionClick(e, opt, data.name)
                                                                  }}/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        }

                        <div>
                            <div className="container-fluid">
                                <div className="row">
                                    {
                                        data.optionsParsed.map((cls, index) => {
                                            if (cls.models && (Array.isArray(cls.models) && cls.models.length)) {
                                                return (
                                                    <div key={generateGuid()}
                                                         className={`col-lg-4 col-md-6 px-0 pt-15 ${css.select__modelGroup}`}>
                                                        <p className={'gray-txt bold-txt txt--lg'}>
                                                            {cls.name}
                                                        </p>
                                                        <div className={'pt-7'}>
                                                            {
                                                                cls.models.map(model => {
                                                                    const currentOpt = data.options.find(opt => opt.value === model.id)
                                                                    return (
                                                                        <div
                                                                            key={generateGuid()}
                                                                            className={`${css.select__option} ${currentOpt.value === value.value ? css.select__optionActive : ''}`}
                                                                        >
                                                                            <Checkbox hasColor={isColor}
                                                                                      color={currentOpt.hex} size={'sm'}
                                                                                      id={currentOpt.value}
                                                                                      checked={currentOpt.checked}
                                                                                      label={currentOpt.title}
                                                                                      change={(e) => {
                                                                                          optionClick(e, currentOpt, data.name)
                                                                                      }}/>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            const current = data.options.find(opt => opt.value === cls.id)
                                            return (
                                                <div key={generateGuid()}
                                                     className={`col-lg-4 col-md-6 px-0 ${css.select__modelGroup}`}>
                                                    <div
                                                        key={generateGuid()}
                                                        className={`${css.select__option} ${current.value === value.value ? css.select__optionActive : ''}`}
                                                    >
                                                        <Checkbox hasColor={isColor}
                                                                  color={current.hex} size={'sm'}
                                                                  id={current.value}
                                                                  checked={current.checked}
                                                                  label={current.title}
                                                                  change={(e) => {
                                                                      optionClick(e, current, data.name)
                                                                  }}/>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                        </div>
                    </div>
                    :
                    null
            }


        </div>
    );
}

export default ExtendedSelect;
