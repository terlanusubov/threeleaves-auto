import React, {useEffect, useState} from 'react';
import css from './search-panel.module.scss'
import SlidingRadioButton from "../sliding-radiobutton";
import Checkbox from "../form-elements/checkbox";
import expandArrowUp from '../../../assets/images/expand-arrow-up.svg'
import expandArrowDown from '../../../assets/images/export-arrow-down.svg'
import Image from "next/image";
import Button from "../button";
import {generateGuid} from "../../helpers/common-functions";
import Select from "../form-elements/select-elements/select";
import MultiSelect from "../form-elements/select-elements/multi-select";
import ExtendedSelect from "../form-elements/select-elements/extended-select";
import {addTag, getFilterCount, removeTag, resetTags} from "../../../store/actions/home-actions";
import {connect, useDispatch, useSelector} from "react-redux";
import {deleteTag} from "../../configs/filter-tags.config";
import main from "../../layouts/main";

function SearchPanel({
                         inputs,
                         checkboxes,
                         mainCheckboxes,
                         changeMultiSelectChecked,
                         checkboxChange,
                         slidingRadioChange,
                         inputChange,
                         handleSelectChange,
                         selectAllOptions,
                         filterCount,
                         formSubmit
                     }) {

    const dispatch = useDispatch()
    const screen = useSelector(({publicState}) => publicState.screen)
    const tags = useSelector(({home}) => home.tags)

    // STATE
    const [expanded, setExpanded] = useState(false);

    // HANDLERS
    const expandSearchPanel = () => {
        setExpanded(prev => {
            return !prev
        })
    }
    const mapOptions = (input) => {
        if (inputs[input].options.length > 0) {
            return inputs[input].options.map((opt, index) => {
                if (index === 0 && opt.value === '0') {
                    return <option key={opt.title + opt.value + index + generateGuid()} disabled
                                   value={opt.value}>{opt.title}</option>
                } else return <option key={opt.title + opt.value + index + generateGuid()}
                                      value={opt.value}>{opt.title}</option>
            })
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        formSubmit()
    }

    useEffect(() => {
        dispatch(resetTags())
        Object.keys(inputs).map(inp => {
            const current = inputs[inp]
            const currentValue = inputs[inp].value

            if (currentValue !== '0' || (Array.isArray(currentValue) && currentValue.length !== 0)) {
                if (current.type === 'select') {
                    const title = current.options.find(opt => opt.value === currentValue)?.title
                    dispatch(addTag({id: generateGuid(), title, input: inp, value: currentValue, type: 'select'}))
                } else if (current.type === 'multi-select') {
                    let titles = currentValue.map(item => {
                        return {
                            title: current.options.find(opt => +opt.value === +item)?.title,
                            value: current.options.find(opt => +opt.value === +item)?.value
                        }
                    }) || []

                    titles.forEach(({title, value}) => {
                        dispatch(addTag({id: generateGuid(), title, input: inp, value, type: 'select'}))
                    })
                } else if (current.type === 'range') {
                    if (current.value.min.trim() !== '' || current.value.max.trim() !== '') {
                        dispatch(addTag({
                            id: generateGuid(),
                            title: `${current.tagPre} ${current.value.min.trim() === '' ? 'X' : current.value.min} - ${current.value.max.trim() === '' ? 'X' : current.value.max}`,
                            input: inp,
                            value: currentValue,
                            type: 'range'
                        }))
                    }
                } else if (current.type === 'select-range') {
                    if (!current.isMax) {
                        dispatch(addTag({
                            id: generateGuid(),
                            title: `${current.tagPre} ${current.value === '0' ? 'X' : current.value} - ${inputs[current.maxKey]?.value === '0' ? 'X' : inputs[current.maxKey]?.value}`,
                            input: inp,
                            value: currentValue,
                            type: 'select-range'
                        }))
                    }

                }
            }
        })
        checkboxes.map(cb => {
            if (cb.checked) {
                dispatch(addTag({id: generateGuid(), title: cb.label, input: cb.id, value: 'other', type: 'checkbox'}))
            }
        })
        mainCheckboxes.map(cb => {
            if (cb.checked) {
                dispatch(addTag({id: generateGuid(), title: cb.label, input: cb.id, value: 'main', type: 'checkbox'}))
            }
        })
        // if (props.deleted && props.deleted!==null){
        //     const {input, value } = props.deleted
        //     setInputs(prev=>{
        //         return {
        //             ...prev,
        //             [input] : {
        //                 ...prev[input],
        //                 value : value
        //             }
        //         }
        //     })
        // }

    }, [inputs, checkboxes, mainCheckboxes])
    return (
        <form onSubmit={handleSubmit} autoComplete={'off'} className={`${css.searchPanel} mb-40`}>
            <input type="hidden" autoComplete={'off'}/>
            <div className={'p-30'}>
                <div className="row">
                    <div className={`col-xl-4 col-lg-6 col-md-6 col-12 mb-30 ${css.searchPanel__inputWrapper}`}>
                        <SlidingRadioButton change={slidingRadioChange} items={inputs.condition.options}/>
                    </div>
                    <div className={`col-xl-4 col-lg-6 col-md-6 col-12 mb-30 ${css.searchPanel__inputWrapper}`}>
                        <Select change={(value) => {
                            handleSelectChange(value, 'city')
                        }} data={inputs.city}/>
                    </div>
                </div>
                <div className="row">
                    <div
                        className={`col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6  mb-30 ${css.searchPanel__inputWrapper}`}>
                        <Select change={(value) => {
                            handleSelectChange(value, 'brand')
                        }} data={inputs.brand}/>
                    </div>
                    <div className={`col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mb-30 ${css.searchPanel__inputWrapper}`}>
                        <ExtendedSelect disabled={inputs.brand.value === '0'} popularTitle={'Məşhur modellər'}
                                        selectAll={selectAllOptions}
                                        change={changeMultiSelectChecked} data={inputs.model}/>
                    </div>
                    <div className={`col-xl-4 col-lg-6 col-md-6 col-12 mb-30 ${css.searchPanel__inputWrapper}`}>
                        <div className="custom-input double-input">
                            {/*<Select hasIcon={false}*/}
                            {/*        optionListClasses={'border-right-radius-none'}*/}
                            {/*        isDouble={true}*/}
                            {/*        classes={'border-right-radius-none border-right'}*/}
                            {/*        data={inputs.yearMin}*/}
                            {/*        noBorder={true}*/}
                            {/*        change={(value) => {*/}
                            {/*            handleSelectChange(value, 'yearMin')*/}
                            {/*        }}*/}
                            {/*/>*/}
                            {/*<Select hasIcon={false}*/}
                            {/*        optionListClasses={'border-left-radius-none border-left'}*/}
                            {/*        isDouble={true}*/}
                            {/*        classes={'border-left-radius-none'}*/}
                            {/*        data={inputs.yearMax} noBorder={true}*/}
                            {/*        change={(value) => {*/}
                            {/*            handleSelectChange(value, 'yearMax')*/}
                            {/*        }}*/}
                            {/*/>*/}
                            <input autoComplete={'off'}
                                   value={inputs.year.value.min}
                                   onChange={(e) => {
                                       inputChange(e, 'year', true, 'min')
                                   }}
                                   placeholder={'İl min.'}
                                   type="text"/>
                            <input placeholder={'maks.'}
                                   value={inputs.year.value.max}
                                   onChange={(e) => {
                                       inputChange(e, 'year', true, 'max')
                                   }}
                                   type="text"/>
                        </div>
                    </div>
                    <div className={`col-xl-4 col-lg-6 col-md-6 col-12 mb-30 ${css.searchPanel__inputWrapper}`}>
                        {/*<div className="custom-input double-input">*/}
                        {/*    <div className="d-flex w-100">*/}
                        {/*        <div className="col-6 p-0">*/}
                        {/*            <Select hasIcon={false}*/}
                        {/*                    optionListClasses={'border-left-radius-none border-left'}*/}
                        {/*                    isDouble={true}*/}
                        {/*                    classes={'border-left-radius-none'}*/}
                        {/*                    data={inputs.yearMin} noBorder={true}*/}
                        {/*                    change={(value) => {*/}
                        {/*                        handleSelectChange(value, 'yearTest')*/}
                        {/*                    }}*/}
                        {/*            />*/}
                        {/*        </div>*/}
                        {/*        <div className="col-6 p-0">*/}
                        {/*            <div className={'w-100 d-flex border-radius position-relative'}>*/}
                        {/*                <Select hasIcon={false}*/}
                        {/*                        optionListClasses={'border-left-radius-none border-left'}*/}
                        {/*                        isDouble={true}*/}
                        {/*                        classes={'border-left-radius-none'}*/}
                        {/*                        data={inputs.yearMax} noBorder={true}*/}
                        {/*                        change={(value) => {*/}
                        {/*                            handleSelectChange(value, 'yearTest')*/}
                        {/*                        }}*/}
                        {/*                />*/}
                        {/*                <Select optionListClasses={'text-center'}*/}
                        {/*                        change={(value) => {*/}
                        {/*                            handleSelectChange(value, 'currency')*/}
                        {/*                        }}*/}
                        {/*                        noBorder={true}*/}
                        {/*                        isDouble={true}*/}
                        {/*                        valueClasses={'gray-txt'}*/}
                        {/*                        classes={'pl-10 gray-txt bold-txt col-5 position-absolute right-0'}*/}
                        {/*                        data={inputs.currency}/>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}


                        {/*</div>*/}
                        <div className="custom-input double-input">
                            <input
                                value={inputs.price.value.min}
                                style={{width: '50%'}}
                                onChange={(e) => {
                                    inputChange(e, 'price', true, 'min')
                                }}
                                placeholder={'Qiymət min.'}
                                type="text"/>
                            <div style={{width: '50%'}} className={'d-flex border-radius'}>
                                <div className="col-7 p-0">
                                    <input type="text"
                                           value={inputs.price.value.max}
                                           onChange={(e) => {
                                               inputChange(e, 'price', true, 'max')
                                           }}
                                           placeholder={'maks.'} className={'border-none pr-0 pl-15'}/>
                                </div>
                                <div className="col-5 p-0">
                                    <Select optionListClasses={'text-center'}
                                            change={(value) => {
                                                handleSelectChange(value, 'currency')
                                            }}
                                            noBorder={true}
                                            isDouble={true}
                                            valueClasses={'gray-txt'}
                                            classes={'pl-5 gray-txt bold-txt w-100'}
                                            data={inputs.currency}/>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className={`col-xl-4 col-lg-6 col-md-6 col-12 mb-30 ${css.searchPanel__inputWrapper}`}>
                        <div className="custom-input double-input">
                            <input autoComplete={'off'}
                                   value={inputs.mileage.value.min}
                                   onChange={(e) => {
                                       inputChange(e, 'mileage', true, 'min')
                                   }}
                                   placeholder={'Yürüş min.'}
                                   type="text"/>
                            <input placeholder={'maks.'}
                                   value={inputs.mileage.value.max}
                                   onChange={(e) => {
                                       inputChange(e, 'mileage', true, 'max')
                                   }}
                                   type="text"/>
                        </div>

                    </div>
                    <div className={`col-xl-4 col-lg-6 col-md-6 col-12 mb-30 ${css.searchPanel__mainCheckboxes}`}>
                        <div className="d-flex align-center h-100">
                            {
                                mainCheckboxes.map(({id, label, checked}) => {
                                    return (
                                        <div key={id} className="col-6 p-0">
                                            <Checkbox size={screen <= 768 ? 'xs' : 'md'} id={id} label={label} checked={checked} change={(e) => {
                                                checkboxChange(e, id, true)
                                            }}/>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                </div>
                <div
                    className={`${css.searchPanel__invisibleInputs} ${expanded ? css.searchPanel__invisibleInputsActive : ''}`}>
                    <div className="row">
                        <div className={`col-xl-4 col-lg-6 col-md-6 col-12 mb-30  ${css.searchPanel__inputWrapper}`}>
                            <div className="custom-input double-input">
                                {/*<input*/}
                                {/*    value={inputs.engine.value.min}*/}
                                {/*    onChange={(e) => {*/}
                                {/*        inputChange(e, 'engine', true, 'min')*/}
                                {/*    }}*/}
                                {/*    type="text" autoComplete="off" placeholder="Mühərrik min."/>*/}
                                {/*<input*/}
                                {/*    value={inputs.engine.value.max}*/}
                                {/*    onChange={(e) => {*/}
                                {/*        inputChange(e, 'engine', true, 'max')*/}
                                {/*    }}*/}
                                {/*    type="text" placeholder="maks."/>*/}
                                <Select hasIcon={false}
                                        optionListClasses={'border-right-radius-none'}
                                        isDouble={true}
                                        classes={'border-right-radius-none border-right'}
                                        data={inputs.engineMin}
                                        noBorder={true}
                                        change={(value) => {
                                            handleSelectChange(value, 'engineMin')
                                        }}
                                />
                                <Select hasIcon={false}
                                        optionListClasses={'border-left-radius-none border-left'}
                                        isDouble={true}
                                        classes={'border-left-radius-none'}
                                        data={inputs.engineMax} noBorder={true}
                                        change={(value) => {
                                            handleSelectChange(value, 'engineMax')
                                        }}
                                />
                            </div>
                        </div>
                        <div
                            className={`col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6  mb-30 ${css.searchPanel__inputWrapper}`}>
                            <Select change={(value) => {
                                handleSelectChange(value, 'fuel')
                            }} data={inputs.fuel}/>
                        </div>
                        <div
                            className={`col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6  mb-30 ${css.searchPanel__inputWrapper}`}>
                            <Select change={(value) => {
                                handleSelectChange(value, 'bodyStyle')
                            }} data={inputs.bodyStyle}/>
                        </div>
                        <div className={`col-xl-4 col-lg-6 col-md-6 col-12 mb-30 ${css.searchPanel__inputWrapper}`}>
                            <MultiSelect isColor={true} data={inputs.color} change={changeMultiSelectChecked}/>
                        </div>
                        <div className={`col-xl-4 col-lg-6 col-md-6 col-12   mb-30 ${css.searchPanel__inputWrapper}`}>
                            <Select change={(value) => {
                                handleSelectChange(value, 'transmission')
                            }} data={inputs.transmission}/>
                        </div>
                        <div className={`col-xl-4 col-lg-6 col-md-6 col-12 mb-30 ${css.searchPanel__inputWrapper}`}>
                            <Select change={(value) => {
                                handleSelectChange(value, 'country')
                            }} data={inputs.country}/>
                        </div>
                    </div>
                    <div className={`pt-30 border-top border-top--soft ${expanded ? 'mt-30' : ''}`}>
                        <p className={'txt--lg bold-txt pb-10'}>
                            Təchizatlar
                        </p>
                        <div>
                            <div className="row">
                                {
                                    checkboxes.length > 0 ?
                                        checkboxes.map(({id, label, checked}) => {
                                            return (
                                                <div key={id} className={`col-xl-4 col-lg-6 col-md-6 col-6 py-17`}>
                                                    <Checkbox id={id} label={label} checked={checked} change={(e) => {
                                                        checkboxChange(e, id, false)
                                                    }}/>
                                                </div>
                                            )
                                        }) : null
                                }
                            </div>

                        </div>
                    </div>
                </div>
                <div className={'pt-25 border-top border-top--soft'}>
                    <div className="d-flex justify-between align-center flex-wrap">
                        <div className={`d-flex align-center cursor-pointer ${css.searchPanel__expandBtn}`}
                             onClick={expandSearchPanel}>
                            {expanded ? <Image src={expandArrowUp}/> : <Image src={expandArrowDown}/>}
                            <span className={'gray-txt medium-txt ml-12'}>
                                {!expanded ? 'Bütün filterlər' : 'Filterləri azaltmaq'}
                            </span>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-4 col-12">
                            <Button type={'submit'} classes={'w-100'}
                                    color={'primary'}>{filterCount && filterCount !== 0 ? `${filterCount} elan göstər` : 'Göstər'}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

// const mapStateToProps = ({home})=>(
//     {
//         tags : home.tags
//     }
// )
//
// const mapDispatchProps = dispatch =>({
//     addToTags : (tag)=>dispatch(addTag(tag)),
//     removeFromTags : (id)=>dispatch(removeTag(id))
// })

export default SearchPanel;
