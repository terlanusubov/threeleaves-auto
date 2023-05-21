import React, {useEffect, useState} from 'react';
import css from './sliding-radiobutton.module.scss'

function SlidingRadioButton(props) {
    const handleChange = (e) => {
        props.change(e, props.items)
    }
    useEffect(() => {
    }, [props.value])
    return (
        <div className={`${css.slidingRadio} p-5`}>
            <div className="container-fluid">
                <div className="row">
                    {
                        props.items ? (
                            props.items.map((item, index) => {
                                return <div onClick={() => {
                                    handleChange(item.value)
                                }}
                                            key={item.title + index}
                                            className={`col-${12 / props.items.length} p-0 py-15 cursor-pointer ${item.active ? css.slidingRadio__activeItem : ''}`}>
                                    <p className={`${css.slidingRadio__item} bold-txt`}>
                                        {item.title}
                                    </p>
                                </div>
                            })
                        ) : null
                    }
                </div>
            </div>
        </div>
    );
}

export default SlidingRadioButton;
