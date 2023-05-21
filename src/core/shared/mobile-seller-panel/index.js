import React, {useCallback, useEffect, useRef, useState} from 'react';
import css from './style.module.scss';
import phoneMaskConfig from "../../configs/phone.config";
import Button from "../button";
import Image from "next/image";
import bolt from "../../../assets/images/listing/bolt.svg";
import fire from "../../../assets/images/listing/fire.svg";
import diamond from "../../../assets/images/listing/diamond.svg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function MobileSellerPanel({data, plans, onSelect, planColors, icons}) {
    const [open, setOpen] = useState(false)
    const [height, setHeight] = useState(0)
    const ref = useRef()
    const changeOpenState = useCallback(() => {
        setOpen(prev=>!prev)
    }, [])

    useEffect(() => {
        setHeight(ref.current.offsetHeight)
    }, [plans])
    const bottomValues = {
        closed:`${75-height + (!data.isBusiness ? 70 : 70)}px`,
        open: '75px'
    }
    return (
            <div ref={ref} style={{bottom: bottomValues[open ? 'open' : 'closed']}} className={`${css.panel} visible-md pb-25`}>
                <div className='d-flex justify-center'>
                    <div className={css.panel__expand} onClick={changeOpenState}>
                        <div className={css.panel__expandIcon}>
                            <FontAwesomeIcon color={'white'} icon={open ? 'chevron-down' : 'chevron-up'} />
                        </div>
                    </div>
                </div>
                <div className={'d-flex align-center justify-between p-15 py-24 border-bottom border-bottom--soft'}>
                    <p className={css.panel__price + ' bold-txt'}>
                        {data.price} {data.currency}
                    </p>
                    <div className='d-flex flex-column' style={{gap: '10px'}}>
                        {
                            data.canBarter && <p className={'txt gray-txt txt--xs'}>
                                Barter mümkündür
                            </p>
                        }
                        {
                            data.canCredit && <p className={'txt gray-txt txt--xs'}>
                                Kredit mümkündür
                            </p>
                        }
                    </div>

                </div>
                {
                    !data.isBusiness &&
                    <div className={'d-flex p-15 py-24 border-bottom border-bottom--soft'}>
                        <div className={css.panel__avatar}>
                            <img src={data.contactImage}/>
                        </div>
                        <div className={'flex-1 d-flex flex-column justify-between py-3'}>
                            <p className={'medium-txt mb-3 break-word'}>{data.contactName}</p>
                            <p className={'gray-txt txt--xs'}>
                                {phoneMaskConfig.apply(data.contactNumber)}
                            </p>

                        </div>

                    </div>
                }
                <div className="px-15">
                    <div className="d-flex" style={{gap: '9px'}}>
                        {
                            plans?.map(({name, id, children}) => {
                                return (
                                  <Button click={()=>onSelect(id, children)} key={name + id} classes={'txt--xxs flex-1 py-md-12 px-md-10 gap-7'} color={planColors[id]}>
                                      <Image width={10} src={icons[id]}/>
                                      {name}
                                  </Button>
                                )
                            })
                        }
                        {/*<Button classes={'txt--xs flex-1 py-md-12 px-md-10 gap-7'} color={'secondary'}>*/}
                        {/*    <Image width={10} src={bolt}/>*/}
                        {/*    İrəli çək*/}
                        {/*</Button>*/}
                        {/*<Button classes={'txt--xs flex-1 py-md-12 px-md-10 gap-7'} color={'danger'}>*/}
                        {/*    <Image width={10} src={fire}/>*/}
                        {/*    Təcili et*/}
                        {/*</Button>*/}
                        {/*<Button classes={'txt--xs flex-1 py-md-12 px-md-10 gap-7'}>*/}
                        {/*    <Image width={10} src={diamond}/>*/}
                        {/*    Platinum et*/}
                        {/*</Button>*/}
                    </div>
                </div>
            </div>
    );
}

export default MobileSellerPanel;
