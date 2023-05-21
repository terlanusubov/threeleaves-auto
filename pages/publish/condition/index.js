import React, {useEffect, useRef, useState} from 'react';
import PublishLayout from "../../../src/core/layouts/publish";
import Image from "next/image";
import x from "../../../src/assets/images/x.svg";
import {generateGuid, handleCheckboxChange} from "../../../src/core/helpers/common-functions";
import Button from "../../../src/core/shared/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import RadioButton from "../../../src/core/shared/form-elements/radiobutton";
import css from './condition.module.scss'
import structure from '../../../src/assets/images/publish/car-structure.svg'
import ResetPublish from "../../../src/core/shared/reset-publish";
import toyota from "../../../src/assets/images/brands/toyota.png";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {carBodyConfig} from "../../../src/core/configs/car-body.config";
import * as services from "../../../src/services";
import {partsSelect} from "../../../src/store/actions/publish-actions";
import PublishGoBack from "../../../src/core/shared/publish-go-back";
import Checkbox from "../../../src/core/shared/form-elements/checkbox";
import publishCss from '../publish.module.scss'
import Head from "next/head";
import CarStructure from "../../../src/core/shared/car-structure";
import {errorToast} from "../../../src/core/shared/toast";

export async function getServerSideProps(context) {
    const filters = await services.getFilters().then(res => res.filters)
    const parts = await services.getParts().then(res => res.parts) || []
    const bodyStyles = filters.autoDesigns || []

    return {
        props: {
            bodyStyles,
            parts
        }
    }
}

function Condition(props) {
    const ref = useRef([])
    const [colors, setColors] = useState({
        1: 'green',
        2: 'orange',
        3: 'red'
    })
    const [activePart, setActivePart] = useState(null)
    const screen = useSelector(({publicState}) => publicState.screen)
    const defaultParts = {
        frontBumper: {
            name: 'Ön bufer',
            value: '',
            valid: false,
            pos: {
                1200: {
                    top: '1.55%',
                },
                768: {
                    top: '3.5%',
                },
                576: {
                    top: '11.5%',
                }
            },
            popupPos: 'right'
        },
        hood: {
            name: 'Kapot',
            value: '',
            valid: false,
            pos: {
                1200: {
                    top: '15%',
                },
                768: {
                    top: '16%',
                },
                576: {
                    top: '21%',
                }
            },
            popupPos: 'right'
        },
        roof: {
            name: 'Tavan',
            value: '',
            valid: false,
            pos: {

                1200: {
                    bottom: '45%',
                },
                768: {
                    bottom: '45%',
                },
                576: {
                    bottom: '47%',
                }
            },
            popupPos: 'right'
        },
        trunk: {
            name: 'Baqaj',
            value: '',
            valid: false,
            pos: {
                1200: {
                    bottom: '20%',
                },
                768: {
                    bottom: '22%',
                },
                576: {
                    bottom: '27%',
                }
            },
            popupPos: 'right'
        },
        rearBumper: {
            name: 'Arxa bufer',
            value: '',
            valid: false,
            pos: {
                1200: {
                    bottom: '7%',
                },
                768: {
                    bottom: '10%',
                },
                576: {
                    bottom: '17%',
                }
            },
            popupPos: 'right'
        },
        frFender: {
            name: 'Ön sağ krelo',
            value: '',
            valid: false,
            pos: {
                1200: {
                    top: '19%',
                    right: '15%'
                },
                768: {
                    top: '19%',
                    right: '15%'
                },
                576: {
                    top: '25%',
                    right: '15%'
                },

            },
            popupPos: 'right'
        },
        frDoor: {
            name: 'Ön sağ qapı',
            value: '',
            valid: false,
            pos: {
                1200: {
                    top: '35%',
                    right: '8%',
                },
                768: {
                    top: '35%',
                    right: '8%',
                },
                576: {
                    top: '38%',
                    right: '8%',
                },
            },
            popupPos: 'right'
        },
        rrDoor: {
            name: 'Arxa sağ qapı',
            value: '',
            valid: false,
            pos: {
                1200: {
                    top: '50%',
                    right: '8%',
                },
                768: {
                    top: '50%',
                    right: '8%',
                },
                576: {
                    top: '50%',
                    right: '8%',
                },
            },
            popupPos: 'right'
        },
        rrFender: {
            name: 'Arxa sağ krelo',
            value: '',
            valid: false,
            pos: {
                1200: {
                    bottom: '26%',
                    right: '17%',
                },
                768: {
                    bottom: '26%',
                    right: '17%',
                },
                576: {
                    bottom: '30%',
                    right: '15%',
                },
            },
            popupPos: 'right'
        },
        flFender: {
            name: 'Ön sol krelo',
            value: '',
            valid: false,

            pos: {
                1200: {
                    top: '19%',
                    left: '15%',
                },
                768: {
                    top: '19%',
                    left: '15%',
                },
                576: {
                    top: '25%',
                    left: '15%',
                },
            },
            popupPos: 'right'
        },
        flDoor: {
            name: 'Ön sol qapı',
            value: '',
            valid: false,
            pos: {
                1200: {
                    top: '35%',
                    left: '8%',
                },
                768: {
                    top: '35%',
                    left: '8%',
                },
                576: {
                    top: '38%',
                    left: '8%',
                },
            },
            popupPos: 'right'
        },
        rlDoor: {
            name: 'Arxa sol qapı',
            value: '',
            valid: false,
            pos: {
                1200: {
                    top: '50%',
                    left: '8%',
                },
                768: {
                    top: '50%',
                    left: '8%',
                },
                576: {
                    top: '50%',
                    left: '8%',
                },
            },
            popupPos: 'right'
        },
        rlFender: {
            name: 'Arxa sol krelo',
            value: '',
            valid: false,
            pos: {
                1200: {
                    bottom: '26%',
                    left: '17%',
                },
                768: {
                    bottom: '26%',
                    left: '17%',
                },
                576: {
                    bottom: '30%',
                    left: '15%',
                },
            },
            popupPos: 'right'
        },
    }

    const parseParts = () => {
        const parts = props.parts
        const newParts = {...defaultParts}
        parts.forEach(({code, id, name}) => {
            newParts[code] = {...newParts[code], id, name}
        })
        return newParts
    }

    const [parts, setParts] = useState(parseParts())
    const [allSelected, setAllSelected] = useState(false);
    const setPartCondition = (key, value) => {
        setParts(prev => {
            return {
                ...prev,
                [key]: {
                    ...prev[key],
                    value: value,
                    valid: true
                }
            }
        })
        let all = true
        for (let partKey in parts) {
            if (partKey !== key) all = +parts[partKey].value === 1 && all && +value === 1
        }
        setAllSelected(all)
    }

    const steps = useSelector(({publish}) => publish.steps)
    const stepId = 5
    const router = useRouter()
    const dispatch = useDispatch()
    const body = carBodyConfig(props.bodyStyles.find(item => parseInt(item.id) === parseInt(steps[2]?.value?.autoDesignId))?.code)

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)
        const prevStep = steps[stepId - 1]
        // if (!prevStep.done) {
        //     router.push(prevStep.route)
        // }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [parts])

    useEffect(() => {
        const thisStep = steps[stepId]
        if (thisStep.done) {
            setParts(prev => {
                const newParts = {...prev}
                thisStep.value.forEach(prt => {
                    newParts[prt.key] = {...newParts[prt.key], value: prt.partTypeId.toString()}
                })
                return newParts
            })


        }
    }, [])

    const handleClickOutside = (event) => {
        let isOutside = true
        ref.current.forEach((item) => {
            if (event.target.contains(item)) {
                isOutside = false
            }
        })
        if (!isOutside) {
            setActivePart(null)
        }
    }

    const handleNext = () => {
        let valid = true
        let payload = Object.keys(parts)
            .map(key => {
                valid = parts[key].valid && valid
                const part = parts[key]
                return {
                    partId: parseInt(part.id),
                    partTypeId: parseInt(part.value),
                    key
                }
            })
        if (valid){
            dispatch(partsSelect(payload))
        }
        else errorToast('Bütün hissələri seçin')
    }

    const handleSelectAllOriginal = (val) => {
        setAllSelected(val)
        setParts(prev => {
            const data = {...prev}
            for (let key in data) {
                data[key].value = val ? '1' : ''
                data[key].valid = !!val
            }
            return data
        })
    }

    return (
        <PublishLayout onNext={handleNext}>
            <Head>
                <title>
                    Treo - Model
                </title>
            </Head>
            <div className={'mt-60'}>
                <div className={'d-flex justify-between align-center pb-25 border-bottom border-bottom--soft'}>
                    <div className={'d-flex align-center'}>
                        <div key={steps[0]?.name + steps[0]?.id} className='d-flex align-center'>
                            <div className={'publish-brand'}>

                            <img src={steps[0]?.value?.icon} alt=""/>
                            </div>
                            <span
                                className={`${publishCss.publish__crumb} blue-txt bold-txt ml-10 ml-md-8`}>{steps[0]?.value?.name}</span>
                        </div>
                        <span className={'ml-10 ml-md-8 gray-txt gray-txt--light txt--xl'}>
                                /
                            </span>
                        <div className='d-flex align-center'>
                            <span className={'blue-txt bold-txt ml-10 ml-md-8'}>
                                <span
                                    className={`${publishCss.publish__crumb} blue-txt bold-txt`}>{steps[1]?.value?.name}</span>
                            </span>
                        </div>
                        <span className={'ml-10 ml-md-8 gray-txt gray-txt--light txt--xl'}>
                                /
                            </span>
                        <div className='d-flex align-center'>
                            <span className={`${publishCss.publish__crumb} blue-txt bold-txt ml-10 ml-md-8`}>
                                {steps[2]?.value?.releaseYear}
                            </span>
                        </div>
                        <span className={'ml-10 ml-md-8 gray-txt gray-txt--light txt--xl'}>
                                /
                            </span>
                        <div className='d-flex align-center'>
                            <span className={`${publishCss.publish__crumb} blue-txt bold-txt ml-10 ml-md-8`}>
                                {body?.nameAZ}
                            </span>
                        </div>
                    </div>

                    <div>
                        <ResetPublish/>
                    </div>
                </div>
            </div>
            <div className={'pt-35'}>
                <div className="">
                    <div>
                        <p className={'publish-section-title txt--xxl medium-txt mb-md-0'}>
                            Detallar
                        </p>
                        <div className={'row  overflow-hidden pb-80'}>
                            <div className="col-lg-6 col-md-12 d-flex justify-center">
                                <div className={'py-70 py-md-0 pt-md-35'}>
                                    <div
                                        className={'pb-35 d-flex position-relative flex-column align-center fit-content'}>
                                        <CarStructure/>
                                        {
                                            Object.keys(parts).map((partKey, index) => {
                                                const current = parts[partKey]
                                                return (
                                                    <div key={generateGuid()}
                                                         className={'position-absolute fit-content'}
                                                         style={{...current.pos[screen]}}>
                                                        <div ref={el => ref.current[index] = el}
                                                             className={'position-relative d-flex justify-center'}>
                                                            <div
                                                                className={`tooltip ${activePart === partKey ? 'tooltip--visible' : ''}`}>
                                                                <p>
                                                                    {current.name}
                                                                </p>
                                                            </div>
                                                            <span
                                                                onClick={() => {
                                                                    setActivePart(partKey)
                                                                }}
                                                                className={`pin pin--${colors[current.value]}`}
                                                            >{index + 1}
                                                    </span>
                                                            <div
                                                                className={`tooltip-panel ${activePart === partKey ? 'tooltip-panel--visible' : ''}`}>
                                                                <p className={'tooltip-panel__title medium-txt'}>
                                                                    {current.name}
                                                                </p>
                                                                <div onChange={(e) => {
                                                                    setPartCondition(partKey, e.target.value)
                                                                }}>
                                                                    <div className={'my-18'}>
                                                                        <RadioButton
                                                                            id={`${partKey}-original-tooltip`}
                                                                            square
                                                                            color={'green'}
                                                                            name={partKey + '-tooltip'}
                                                                            size={'sm'}
                                                                            label={'Original'}
                                                                            value={'1'}
                                                                            checked={current.value === '1'}
                                                                        />
                                                                    </div>
                                                                    <div className={'my-18'}>
                                                                        <RadioButton
                                                                            id={`${partKey}-painted-tooltip`}
                                                                            square
                                                                            color={'orange'}
                                                                            name={partKey + '-tooltip'}
                                                                            size={'sm'}
                                                                            label={'Rənglənib'}
                                                                            value={'2'}
                                                                            checked={current.value === '2'}

                                                                        />
                                                                    </div>
                                                                    <div className={'my-18'}>
                                                                        <RadioButton
                                                                            id={`${partKey}-changed-tooltip`}
                                                                            square
                                                                            size={'sm'}
                                                                            color={'red'}
                                                                            name={partKey + '-tooltip'}
                                                                            label={'Dəyişib'}
                                                                            value={'3'}
                                                                            checked={current.value === '3'}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })


                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 p-0">
                                <div className='px-md-5'>
                                    <table className={css.table}>
                                        <thead>
                                        <tr>
                                            <th style={{width: screen < 768 ? '37%' : '34%'}}></th>
                                            <th>
                                                <Checkbox
                                                    id={`select-all-original`}
                                                    color={'green'}
                                                    label={'Original'}
                                                    checked={allSelected}
                                                    change={handleSelectAllOriginal}
                                                    size={'sm'}
                                                    classes={screen < 768 ? 'txt--xxs' : 'txt--sm'}
                                                /></th>
                                            <th className={'txt--sm'}>Rənglənib</th>
                                            <th className={'txt--sm'}>Dəyişib</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            Object.keys(parts).map((partKey, index) => {
                                                const current = parts[partKey]
                                                return (
                                                    <tr key={partKey + index + current.name + generateGuid()}
                                                        onChange={(e) => {
                                                            setPartCondition(partKey, e.target.value)
                                                        }}
                                                    >
                                                        <td>
                                                            <span
                                                                className={'gray-txt mr-2'}>{index + 1}.</span> {current.name}
                                                        </td>
                                                        <td>
                                                            <div className={'d-inline-block'}>
                                                                {/*<RadioButton*/}
                                                                {/*    id={`${partKey}-original`}*/}
                                                                {/*    square*/}
                                                                {/*    color={'green'}*/}
                                                                {/*    name={partKey}*/}
                                                                {/*    showLabel={false}*/}
                                                                {/*    label={'x'}*/}
                                                                {/*    value={'1'}*/}
                                                                {/*    checked={current.value === '1'}*/}

                                                                {/*/>*/}

                                                                <RadioButton
                                                                    id={`${partKey}-original`}
                                                                    square
                                                                    color={'green'}
                                                                    name={partKey}
                                                                    showLabel={false}
                                                                    label={'x'}
                                                                    value={'1'}
                                                                    size={'sm'}
                                                                    checked={current.value === '1'}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className={'d-inline-block'}>
                                                                <RadioButton
                                                                    id={`${partKey}-painted`}
                                                                    square
                                                                    color={'orange'}
                                                                    name={partKey}
                                                                    showLabel={false}
                                                                    label={'x'}
                                                                    value={'2'}
                                                                    size={'sm'}
                                                                    checked={current.value === '2'}

                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className={'d-inline-block'}>
                                                                <RadioButton
                                                                    id={`${partKey}-changed`}
                                                                    square
                                                                    color={'red'}
                                                                    name={partKey}
                                                                    showLabel={false}
                                                                    label={'x'}
                                                                    value={'3'}
                                                                    size={'sm'}
                                                                    checked={current.value === '3'}

                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={'pb-100 invisible-md'}>
                <div className="row">
                    <div className="col-6">
                        <PublishGoBack/>
                    </div>
                    <div className="col-6">
                        <Button click={handleNext} color='primary' classes={'w-100'}>
                            <FontAwesomeIcon icon={'chevron-right'}/>
                            İrəli
                        </Button>
                    </div>
                </div>
            </div>

        </PublishLayout>
    );
}

export default Condition;
