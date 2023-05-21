import React, {useEffect, useState} from 'react';
import {changeInputValue, mapFormItems, simplifyPhoneNumber} from "../../../helpers/common-functions";
import Checkbox from "../../../shared/form-elements/checkbox";
import Link from "next/link";
import Button from "../../../shared/button";
import RadioButton from "../../../shared/form-elements/radiobutton";
import css from '../../../layouts/auth/auth-layout.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {stepTypes} from "../../../../store/actions/types/auth-types";
import {setSignupStep, signupNumber} from "../../../../store/actions/auth-actions";
import {signup, signupOtp, typeSuccess} from "../../../../store/actions/auth-actions";
import {useRouter} from "next/router";
import InputMask from "react-input-mask";

function Signup() {

    const dispatch = useDispatch()
    const router = useRouter()

    const [individualForm, setIndividualForm] = useState({
        inputs: {
            name: {
                type: 'text',
                label: 'Ad, Soyad',
                placeholder: 'Ad, Soyad',
                value: '',
                rules: {
                    required: {
                        value: true,
                        errorText: 'Ad daxil edin'
                    },
                },
                currentErrTxt: 'Ad daxil edin',
                touched: false,
                isValid: false
            },
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
            },
            otp: {
                type: 'text',
                label: 'Təsdiq kodu',
                placeholder: 'Təsdiq kodu',
                value: '',
                isNum: true,
                rules: {
                    required: {
                        value: true,
                        errorText: 'Təsdiq kodunu daxil edin'
                    },
                    regexp: {
                        value: /^\d+$/,
                        errorText: 'Təsdiq kodunu düzgün daxil edin'
                    }
                },
                currentErrTxt: 'Təsdiq kodunu daxil edin',
                touched: false,
                isValid: false
            },
            agree: {
                currentErrTxt: '',
                touched: false,
                isValid: true
            },
        },
        formValid: false,
    })
    const [agree, setAgree] = useState(false)
    const [accountTypes, setAccountTypes] = useState([
        {
            label: 'Fərdi hesab',
            value: "10",
            id: 'individual',
            checked: true
        },
        {
            label: 'Biznes hesab',
            value: "20",
            id: 'business',
            checked: false
        }
    ])
    const [selectedType, setSelectedType] = useState({name: 'individual', id: "10"})
    // const [nameLabel, setNameLabel] = useState('Ad, Soyad')

    const steps = useSelector(({auth}) => auth.signupSteps)
    const currentStep = useSelector(({auth}) => auth.currentStep)
    const checkboxLabel = (
        <p className={!agree && individualForm.inputs.agree.touched ? 'red-txt' : ''}>
            <Link href={'/rules'}>
                <a className={`${!agree && individualForm.inputs.agree.touched ? 'red-txt' : 'green-txt'} txt--sm`}>Qaydalarla </a>
            </Link>
            <span>
                tanış oldum
            </span>
        </p>
    )

    const handleAgreeChange = (val)=>{
        setAgree(val)
    }

    const touchInputs = (keys) => {
        setIndividualForm(prev => {
            let inputs = {...prev.inputs}
            if (Array.isArray(keys)) {
                keys.forEach(key => {
                    inputs[key].touched = true
                })
            }
            else inputs[keys].touched = true
            return {
                ...prev,
                inputs
            }
        })
    }

    const formSubmit = (e) => {
        e.preventDefault()
        switch (currentStep) {
            case stepTypes.phone :
                if (individualForm.inputs.phone.isValid)
                    dispatch(signupNumber(simplifyPhoneNumber(individualForm.inputs.phone.value)))
                else touchInputs('phone')
                break;
            case stepTypes.otp :
                if (individualForm.inputs.otp.isValid)
                    dispatch(signupOtp(individualForm.inputs.otp.value))
                else touchInputs('otp')

                break;
            case stepTypes.type :
                dispatch(typeSuccess())
                break;
            case stepTypes.final :
                if (individualForm.formValid && agree) {
                    const payload = {
                        phoneNumber: simplifyPhoneNumber(individualForm.inputs.phone.value),
                        name: individualForm.inputs.name.value,
                        surname: individualForm.inputs.name.value,
                        password: individualForm.inputs.password.value,
                        userRoleId: parseInt(selectedType.id),
                    }

                    dispatch(signup(payload))
                }
                else touchInputs(['name', 'password', 'agree'])
                break;
        }
    }

    useEffect(()=>{
        if (router.query.phone){
            changeInputValue({target : {value : router.query.phone}}, 'phone', individualForm.inputs, setIndividualForm)
        }
        dispatch(setSignupStep(stepTypes.phone))
    },[])

    return (
        <form onSubmit={formSubmit}>
            {
                currentStep === 'phone' ?
                    <div className={`login-section__panel__content__form__field pt-10 pb-15`}>
                        <InputMask
                            maskChar={''}

                            onChange={(e) => {
                                changeInputValue(e, 'phone', individualForm.inputs, setIndividualForm)
                            }}
                            mask={'(099) 999-99-99'}
                            value={individualForm.inputs.phone.value}
                        >
                            {
                                (inputProps) => (
                                    <input {...inputProps} autoComplete={'off'}
                                           type={individualForm.inputs.phone.type}
                                           className={`custom-input`}
                                        // onBlur={(e)=>{inputBlur(e,input, inputs, callback)}}
                                           placeholder={individualForm.inputs.phone.placeholder}/>
                                )
                            }
                        </InputMask>
                        <span className={'err-txt'}>
                                {!individualForm.inputs.phone.isValid && individualForm.inputs.phone.touched ? individualForm.inputs.phone.currentErrTxt : null}
                            </span>
                    </div>
                    :
                    null
            }
            {
                currentStep === 'otp' ?
                    <div className={`login-section__panel__content__form__field pt-10 pb-15`}>
                        <input autoComplete={'off'} onChange={(e) => {
                            changeInputValue(e, 'otp', individualForm.inputs, setIndividualForm)
                        }}
                               type={'number'}
                               className={`custom-input`}
                            // onBlur={(e)=>{inputBlur(e,input, inputs, callback)}}
                               placeholder={individualForm.inputs.otp.placeholder}/>
                        <span className={'err-txt'}>
                                {!individualForm.inputs.otp.isValid && individualForm.inputs.otp.touched ? individualForm.inputs.otp.currentErrTxt : null}
                            </span>
                    </div>
                    :
                    null
            }
            {
                currentStep === 'type' ?
                    <div className={'d-flex justify-between mb-30'}
                         onChange={(e) => {
                             setSelectedType({name: e.target.id, id: e.target.value})
                         }}
                    >
                        {
                            accountTypes.map(({label, id, value, checked}) => {
                                return <RadioButton
                                    key={label + id + value}
                                    id={id}
                                    name={'account-type'}
                                    value={value}
                                    label={label}
                                    checked={checked}
                                    classes={css.signupRadio}
                                />
                            })
                        }
                    </div>
                    :
                    null
            }
            {
                currentStep === 'final' ?
                    <>
                        <div className={`login-section__panel__content__form__field pt-10 pb-15`}>
                            <input autoComplete={'off'} onChange={(e) => {
                                changeInputValue(e, 'name', individualForm.inputs, setIndividualForm)
                            }}
                                   type={'text'}
                                   className={`custom-input`}
                                // onBlur={(e)=>{inputBlur(e,input, inputs, callback)}}
                                   placeholder={selectedType.id === '10' ? 'Ad, Soyad' : 'Avtosalon adı'}/>
                            <span className={'err-txt'}>
                                {!individualForm.inputs.name.isValid && individualForm.inputs.name.touched ? individualForm.inputs.name.currentErrTxt : null}
                            </span>
                        </div>
                        <div className={`login-section__panel__content__form__field pt-10 pb-15`}>
                            <input autoComplete={'off'} onChange={(e) => {
                                changeInputValue(e, 'password', individualForm.inputs, setIndividualForm)
                            }}
                                   type={'password'}
                                   className={`custom-input`}
                                // onBlur={(e)=>{inputBlur(e,input, inputs, callback)}}
                                   placeholder={individualForm.inputs.password.placeholder}/>
                            <span className={'err-txt'}>
                                {!individualForm.inputs.password.isValid && individualForm.inputs.password.touched ? individualForm.inputs.password.currentErrTxt : null}
                            </span>
                        </div>
                        <div className={'d-flex justify-between pt-15 pb-30'}>
                            <Checkbox id={'remember-check'}
                                      label={checkboxLabel}
                                      checked={agree}
                                      change={(e) => handleAgreeChange(e)}
                                      size={'xs'}
                            />
                        </div>
                    </>
                    :
                    null
            }


            <div>
                <Button type={'submit'} classes={'w-100'}>
                    {currentStep === 'final' ? 'Qeydiyyat' : 'İrəli'}
                </Button>
            </div>
        </form>
    );
}

export default Signup;
