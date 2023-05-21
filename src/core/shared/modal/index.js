import React from 'react';
import css from './modal.module.scss'
import x from '../../../assets/images/clear-x.svg'
import Image from "next/image";
function Modal(props) {
    const {
        modalClass = '',
        backdropClass = '',
        panelClass = '',
        children,
        size = 'md',
        title = '',
        show = false,
        setShow,
        closeBtn = false
    } = props
    const modalSize = {
        md: css.modal__panelMedium,
        lg: css.modal__panelLarge,
        sm: css.modal__panelSmall,
    }
    return (
        <>
            {
                show ?
                    <div className={`${css.modal} ${modalClass}`}
                         onClick={() => {
                             setShow(false)
                         }}
                    >
                        {/*<div className={`${css.modal__backdrop} ${backdropClass}`}>*/}
                        <div
                            className={`${css.modal__panel} ${modalSize[size]} ${panelClass} animate__animated animate__backInDown`}
                            onClick={e => e.stopPropagation()}>
                            <div className={css.modal__title}>
                                <p className={'bold-txt'}>
                                    {title}
                                </p>
                                {
                                    closeBtn && <div onClick={setShow} className={css.modal__close}>
                                    <Image src={x}/>
                                    </div>
                                }
                            </div>
                            <div className={css.modal__body}>
                                {children}
                            </div>
                        </div>
                        {/*</div>*/}
                    </div>
                    :
                    null
            }
        </>
    );
}

export default Modal;
