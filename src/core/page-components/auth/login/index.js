import React, {useEffect, useState} from 'react';
import {changeInputValue, mapFormItems, simplifyPhoneNumber} from "../../../helpers/common-functions";
import Checkbox from "../../../shared/form-elements/checkbox";
import Link from "next/link";
import Button from "../../../shared/button";
import {useDispatch} from "react-redux";
import {login} from "../../../../store/actions/auth-actions";
import InputMask from 'react-input-mask'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Login() {
    const [form, setForm] = useState({
        inputs: {
            phone: {
                type: 'text',
                label: 'Nömrə',
                placeholder: 'Nömrə',
                value: '',
                isNum: true,
                rules: {
                    required: {
                        value: true,
                        errorText: 'Nömrə daxil edin'
                    },
                    regexp: {
                        value: /^(?=.*[0-9])[- +()0-9]+$/,
                        errorText: 'Nömrəni düzgün daxil edin'
                    },
                    minLength: {
                        value: 15,
                        errorText: 'Nömrəni düzgün daxil edin'
                    },
                    maxLength: {
                        value: 15,
                        errorText: 'Nömrəni düzgün daxil edin'
                    }
                },
                currentErrTxt: 'Nömrə daxil edin',
                touched: false,
                isValid: false
            },
            password: {
                type: 'password',
                label: 'Şifrə',
                placeholder: 'Şifrə',
                value: '',
                rules: {
                    required: {
                        value: true,
                        errorText: 'Şifrə daxil edin'
                    },
                    minLength: {
                        value: 6,
                        errorText: 'Şifrə minimum 6 simvoldan ibarət ola bilər'
                    }
                },
                currentErrTxt: 'Şifrə daxil edin',
                touched: false,
                isValid: false
            }
        },
        formValid: false,
    })
    const [remember, setRemember] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const dispatch = useDispatch()

    const formSubmit = (e) => {
        e.preventDefault()
        if (form.formValid) {
            dispatch(login({
                phoneNumber: simplifyPhoneNumber(form.inputs.phone.value),
                password: form.inputs.password.value,
                save: remember
            }))
        } else touchAll()

    }

    const touchAll = () => {
        setForm(prev => {
            let inputs = {...prev.inputs};
            for (let key in form.inputs) {
                inputs[key].touched = true
            }
            return {
                ...prev,
                inputs
            }
        })
    }

    const toggleShowPass = () => {
        setShowPass(prev => !prev)
    }

    return (
        <form onSubmit={formSubmit}>

            <div className={`login-section__panel__content__form__field pt-10 pb-15`}>
                <div className={'position-relative d-flex align-center'}>
                    <InputMask
                        maskChar={''}

                        onChange={(e) => {
                            changeInputValue(e, 'phone', form.inputs, setForm)
                        }}
                        mask={'(099) 999-99-99'}
                        value={form.inputs.phone.value}
                    >
                        {
                            (inputProps) => (
                                <input {...inputProps} autoComplete={'off'}
                                       type={form.inputs.phone.type}
                                       className={`custom-input`}
                                    // onBlur={(e)=>{inputBlur(e,input, inputs, callback)}}
                                       placeholder={form.inputs.phone.placeholder}/>
                            )
                        }
                    </InputMask>


                </div>

                <span className={'err-txt'}>
                                {!form.inputs.phone.isValid && form.inputs.phone.touched ? form.inputs.phone.currentErrTxt : null}
                            </span>
            </div>
            <div className={`login-section__panel__content__form__field pt-10 pb-15`}>
                <div className="position-relative align-center d-flex">
                    <input value={form.inputs.password.value}
                           onChange={(e) => {
                               changeInputValue(e, 'password', form.inputs, setForm)
                           }} autoComplete={'off'}
                           type={showPass ? 'text' : 'password'}
                           className={`custom-input`}
                           placeholder={form.inputs.password.placeholder}/>
                    <div className="pass-toggle d-flex align-center justify-center">
                        <FontAwesomeIcon onClick={toggleShowPass} className={'cursor-pointer'} icon={!showPass ? 'eye' : 'eye-slash'}/>
                    </div>
                </div>

                <span className={'err-txt'}>
                                {!form.inputs.password.isValid && form.inputs.password.touched ? form.inputs.password.currentErrTxt : null}
                            </span>
            </div>
            <div className={'d-flex justify-between pt-15 pb-30'}>
                <Checkbox id={'remember-check'}
                          label={'Yadda saxla'}
                          checked={remember}
                          change={(e) => setRemember(e)}
                          size={'xs'}
                />
                <Link href={'/forgot-pass'}>
                    <a className={'gray-txt txt--sm'}>
                        Şifrəni unutmusunuz?
                    </a>
                </Link>
            </div>
            <div>
                <Button type={'submit'} classes={'w-100'}>
                    Daxil olmaq
                </Button>
            </div>
        </form>
    );
}

export default Login;
