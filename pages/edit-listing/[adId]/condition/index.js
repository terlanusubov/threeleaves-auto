import React, {useEffect, useRef, useState} from 'react';
import Image from "next/image";
import x from "../../../../src/assets/images/x.svg";
import Checkbox from "../../../../src/core/shared/form-elements/checkbox";
import {generateGuid} from "../../../../src/core/helpers/common-functions";
import Button from "../../../../src/core/shared/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import RadioButton from "../../../../src/core/shared/form-elements/radiobutton";
import css from './condition.module.scss'
import structure from '../../../../src/assets/images/publish/car-structure.svg'
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import * as services from "../../../../src/services";
import PublishGoBack from "../../../../src/core/shared/publish-go-back";
import {partsSelectEdit} from "../../../../src/store/actions/edit-listing-actions";
import Head from "next/head";
import EditListingLayout from "../../../../src/core/layouts/edit-listing";
import CarStructure from "../../../../src/core/shared/car-structure";

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
    const screen = useSelector(({publicState}) => publicState.screen)
    const ref = useRef([])
    const [colors, setColors] = useState({
        1: 'green',
        2: 'orange',
        3: 'red'
    })
    const [activePart, setActivePart] = useState(null)
    const defaultParts = {
        frontBumper: {
            name: 'Ön bufer',
            value: '1',
            pos: {
                1200: {
                    top: '1.55%',
                },
                768: {
                    top: '3.5%',
                },
                992: {
                    top: '3.5%',
                },
                576: {
                    top: '11.5%',
                }
            }
        },
        hood: {
            name: 'Kapot',
            value: '1',
            pos: {
                1200: {
                    top: '15%',
                },
                768: {
                    top: '16%',
                },
                992: {
                    top: '16%',
                },
                576: {
                    top: '21%',
                }
            }
        },
        roof: {
            name: 'Tavan',
            value: '1',
            pos: {

                1200: {
                    bottom: '45%',
                },
                768: {
                    bottom: '45%',
                },
                992: {
                    bottom: '45%',
                },
                576: {
                    bottom: '47%',
                }
            }
        },
        trunk: {
            name: 'Baqaj',
            value: '1',
            pos: {
                1200: {
                    bottom: '20%',
                },
                768: {
                    bottom: '22%',
                },
                992: {
                    bottom: '22%',
                },
                576: {
                    bottom: '27%',
                }
            }
        },
        rearBumper: {
            name: 'Arxa bufer',
            value: '1',
            pos: {
                1200: {
                    bottom: '7%',
                },
                768: {
                    bottom: '10%',
                },
                992: {
                    bottom: '10%',
                },
                576: {
                    bottom: '17%',
                }
            }
        },
        frFender: {
            name: 'Ön sağ krelo',
            value: '1',
            pos: {
                1200: {
                    top: '19%',
                    right: '15%'
                },
                768: {
                    top: '19%',
                    right: '15%'
                },
                992: {
                    top: '19%',
                    right: '15%'
                },
                576: {
                    top: '25%',
                    right: '15%'
                },

            }
        },
        frDoor: {
            name: 'Ön sağ qapı',
            value: '1',
            pos: {
                1200: {
                    top: '35%',
                    right: '8%',
                },
                768: {
                    top: '35%',
                    right: '8%',
                },
                992: {
                    top: '35%',
                    right: '8%',
                },
                576: {
                    top: '38%',
                    right: '8%',
                },
            }
        },
        rrDoor: {
            name: 'Arxa sağ qapı',
            value: '1',
            pos: {
                1200: {
                    top: '50%',
                    right: '8%',
                },
                768: {
                    top: '50%',
                    right: '8%',
                },
                992: {
                    top: '50%',
                    right: '8%',
                },
                576: {
                    top: '50%',
                    right: '8%',
                },
            }
        },
        rrFender: {
            name: 'Arxa sağ krelo',
            value: '1',
            pos: {
                1200: {
                    bottom: '26%',
                    right: '17%',
                },
                768: {
                    bottom: '26%',
                    right: '17%',
                },
                992: {
                    bottom: '26%',
                    right: '17%',
                },
                576: {
                    bottom: '30%',
                    right: '15%',
                },
            }
        },
        flFender: {
            name: 'Ön sol krelo',
            value: '1',

            pos: {
                1200: {
                    top: '19%',
                    left: '15%',
                },
                768: {
                    top: '19%',
                    left: '15%',
                },
                992: {
                    top: '19%',
                    left: '15%',
                },
                576: {
                    top: '25%',
                    left: '15%',
                },
            }
        },
        flDoor: {
            name: 'Ön sol qapı',
            value: '1',
            pos: {
                1200: {
                    top: '35%',
                    left: '8%',
                },
                768: {
                    top: '35%',
                    left: '8%',
                },
                992: {
                    top: '35%',
                    left: '8%',
                },
                576: {
                    top: '38%',
                    left: '8%',
                },
            }
        },
        rlDoor: {
            name: 'Arxa sol qapı',
            value: '1',
            pos: {
                1200: {
                    top: '50%',
                    left: '8%',
                },
                768: {
                    top: '50%',
                    left: '8%',
                },
                992: {
                    top: '50%',
                    left: '8%',
                },
                576: {
                    top: '50%',
                    left: '8%',
                },
            }
        },
        rlFender: {
            name: 'Arxa sol krelo',
            value: '1',
            pos: {
                1200: {
                    bottom: '26%',
                    left: '17%',
                },
                768: {
                    bottom: '26%',
                    left: '17%',
                },
                992: {
                    bottom: '26%',
                    left: '17%',
                },
                576: {
                    bottom: '30%',
                    left: '15%',
                },
            }
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
    const [allSelected, setAllSelected] = useState(true);

    const setPartCondition = (key, value) => {
        setParts(prev => {
            return {
                ...prev,
                [key]: {
                    ...prev[key],
                    value: value
                }
            }
        })
        let all = true
        for (let partKey in parts){
            if (partKey !== key) all = +parts[partKey].value === 1 && all && +value === 1
        }
        setAllSelected(all)
    }

    const handleSelectAllOriginal = (val)=>{
        setAllSelected(val)
        setParts(prev=>{
            const data = {...prev}
            for (let key in data){
                data[key].value = '1'
            }
            return data
        })
    }


    const steps = useSelector(({editListing}) => editListing.steps)
    const stepId = 1
    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        document.addEventListener('click', handleClickOutside)
        const prevStep = steps[stepId - 1]

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
    }, [steps])

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
        let payload = Object.keys(parts)
            .map(key => {
                const part = parts[key]
                return {
                    partId: parseInt(part.id),
                    partTypeId: parseInt(part.value),
                    key
                }
            })
        dispatch(partsSelectEdit(payload, router.query.adId))
    }

    return (
        <EditListingLayout onNext={handleNext}>
            <Head>
                <title>
                    Treo - Detallar
                </title>
            </Head>
            {/*<div className={'mt-60'}>*/}
            {/*    <div className={'d-flex justify-between align-center pb-25 border-bottom border-bottom--soft'}>*/}
            {/*        <span></span>*/}
            {/*        <div>*/}
            {/*            /!*<ResetPublish/>*!/*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className={'py-35'}>
                <div className="pb-34">
                    <div>
                        <p className={'txt--xxl medium-txt mb-25'}>
                            Detallar
                        </p>
                        <div className={'row'}>
                            <div className="col-lg-6">
                                <div className={'py-35 py-md-0 col-md-12 d-flex justify-center'}>
                                    <div
                                        className={'pb-35 d-flex position-relative flex-column align-center fit-content overflow-hidden'}>
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
                                                                className={`tooltip ${activePart === partKey && 'tooltip--visible'}`}>
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
                            <div className="col-lg-6 p-0">
                                <div>
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

        </EditListingLayout>
    );
}

export default Condition;
