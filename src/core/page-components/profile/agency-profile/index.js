import Card from "../../../shared/card";
import css from './agency-profile.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LabeledInput from "../../../shared/labeled-input";
import React, {useState} from "react";
import Select from "../../../shared/form-elements/select-elements/select";
import Image from "next/image";
import x from '../../../../assets/images/x.svg'
import {
    changeInputValue,
    generateGuid,
    generateHoursOfDay,
    handleSelectChange,
    imgToBlob, simplifyPhoneNumber,
    toFormData
} from "../../../helpers/common-functions";
import * as services from "../../../../services";
import Button from "../../../shared/button";
import {useDispatch, useSelector} from "react-redux";
import {updateProfile} from "../../../../services/profile.services";
import {errorToast, successToast} from "../../../shared/toast";
import {getUserData, setUserDataLocal} from "../../../configs/auth.config";
import {setUserData} from "../../../../store/actions/auth-actions";
import {getProfile, getProfileSuccess} from "../../../../store/actions/profile-actions";
import InputMask from "react-input-mask";

function AgencyProfile({cities, workdays = []}) {
    const dispatch = useDispatch()
    const endTimeDefaultOption = {title: 'Bitir', value: '0'}
    const defaultOpenTimeField = (day = workdays[0].id, stTime = '09:00', endTime = '18:00') => ({
        days: {
            options: [
                ...workdays.map(item => ({title: item.name, value: item.id}))
            ],
            type: 'select',
            value: day,
            name: 'schedule',
            placeholder: 'İş günləri',
        },
        stTime: {
            options: [...generateHoursOfDay()],
            type: 'select',
            value: stTime,
            name: 'startTime',
            placeholder: 'Başlanır',
        },
        endTime: {
            options: [...generateHoursOfDay(10)],
            type: 'select',
            value: endTime,
            name: 'endTime',
            placeholder: 'Bitir',
        }
    })
    const defaultPhoneField = ''
    const profile = useSelector(({profile}) => profile.profile)
    const [name, setName] = useState(profile.name)
    const [desc, setDesc] = useState(profile.description || '')
    const [address, setAddress] = useState(profile.address)
    const [city, setCity] = useState('')
    const [endTimeOptions, setEndTimeOptions] = useState(generateHoursOfDay())
    const [inputs, setInputs] = useState({
        city: {
            type: 'select',
            value: profile.cityId,
            name: 'city',
            placeholder: 'Şəhər',
            options: [
                {title: 'Şəhər', value: '0'},
                ...cities.map(({name, id}) => ({title: name, value: id}))
                // {title: 'Hər gün', value: '1'},
                // {title: 'Həftə içi', value: '2'},
                // {title: 'Qiymətə görə', value: '02'},
            ]
        },
    })

    const [openTimes, setOpenTimes] = useState([
        ...profile.workdays.map(item => defaultOpenTimeField(item.dayId, item.started, item.ended)).sort((a,b)=>a.days.value - b.days.value)
    ])

    const [phone, setPhone] = useState([
        ...profile.phones.map(item => item)
    ])
    const [shortPhone, setShortPhone] = useState(profile.shortPhoneNumber || '')
    const [hasShortPhone, setHasShortPhone] = useState(!!profile.shortPhoneNumber)

    const [avatar, setAvatar] = useState({file: null, isOld: true, blob: profile.avatar})
    const [cover, setCover] = useState({file: null, isOld: true, blob: profile.coverImage})
    const [canAddTime, setCanAddTime] = useState(true)
    const setEveryday = (index) => {
        setOpenTimes([{...openTimes[index], days: defaultOpenTimeField().days}])
        setCanAddTime(false)
    }
    const handleChangeByIndex = (value, input, index) => {
        if (+value === +workdays[0].id) {
            setEveryday(index)
        } else {
            setOpenTimes((prev) => {

                const newInput = {...prev[index][input], value}
                const newArr = [...prev]
                newArr[index] = {
                    ...newArr[index],
                    [input]: newInput
                }
                return newArr.sort((a,b)=>a.days.value - b.days.value)
            })
            setCanAddTime(true)
        }

    }

    const handleStartTimeChange = (value, index) => {
        setEndTimeOptions([...generateHoursOfDay(value + 1)])
        if (+value >= +inputs.endTime.value) {
            handleChangeByIndex(23, 'endTime', index)
        }
        handleChangeByIndex(value, 'stTime', index)
    }

    const addOpenTimeField = () => {
        if (canAddTime) {
            if (!openTimes.length) {
                setOpenTimes(prev => [...prev, defaultOpenTimeField()])
                setCanAddTime(false)
            } else setOpenTimes(prev => [...prev, defaultOpenTimeField(workdays[1].id)])
        }
    }

    const addPhoneField = () => {
        phone.length < 3 && setPhone(prev => [...prev, defaultPhoneField])
    }

    const changePhoneValue = (value, index) => {
        setPhone(prev => {
            const arr = [...prev]
            arr[index] = simplifyPhoneNumber(value)
            return [...arr]
        })
    }

    const onUpload = (event, type = 'avatar') => {
        const file = event.target.files[0];
        switch (type) {
            case "avatar":
                setAvatar({
                    file,
                    blob: imgToBlob(file),
                    isOld: false
                });
                break;
            case "cover" :
                setCover({
                    file,
                    blob: imgToBlob(file),
                    isOld: false
                });
        }
    }

    const submit = (e) => {
        e.preventDefault()
        let valid = true
        const phones = phone.filter((item, index) => index !== 0)
        const workingDays = openTimes.map((item => ({
            dayId: item.days.value,
            started: item.stTime.value,
            ended: item.endTime.value
        }))).sort((a, b)=>+a.dayId - +b.dayId)
        const data = {
            name,
            coverImage: cover.file,
            image: avatar.file,
            description: desc,
            phones,
            workingDays,
            cityId: +inputs.city.value,
            shortPhoneNumber: shortPhone
        }
        valid = phone.every(item => simplifyPhoneNumber(item) && simplifyPhoneNumber(item) !== '0') && valid
        if (hasShortPhone)
            valid = !!shortPhone && valid
        const formData = toFormData(data)
        // const userData = {...getUserData(), name}
        // userData.image = avatar.blob
        if (valid) {
            updateProfile(formData)
                .then((res) => {
                    const userData = res
                    setUserDataLocal(userData)
                    dispatch(setUserData(userData))
                    dispatch(getProfileSuccess({...profile, name}))
                    dispatch(getProfile())
                    successToast('Uğurlu əməliyyat!')
                })
        } else errorToast('Nömrə xanası boş burxıla bilməz')
    }

    const removeOpenTime = (index) => {
        setOpenTimes(prev => {
            return [...prev].filter((item, ind) => ind !== index)
        })
        setCanAddTime(true)
    }
    const removePhone = (index) => {
        index !== 0 && setPhone(prev => {
            return [...prev].filter((item, ind) => ind !== index)
        })
    }
    const shortPhoneChange = (e) => {
        const reg = new RegExp(/^[* 0-9]+$/i);
        const value = e.target.value
        if ((reg.test(value) || value.trim() === '') && value.length <= 5) {
            setShortPhone(value)
        }
    }
    return (
        <form onSubmit={submit}>
            <Card>
                <div className={'p-6'}>
                    <p className="card-title bold-txt">
                        Avtosalon məlumatları
                    </p>
                    <div className={'pt-6'}>
                        <div className="row">
                            <div className="col-lg-7">
                                <div className={css.profile__cover}>
                                    <img className={css.profile__coverImg} src={cover.blob}/>
                                    <div className={css.profile__coverUpload}>
                                        <label className={css.profile__coverUploadBtn} htmlFor="cover-upload">
                                            <input id='cover-upload' onChange={(e) => onUpload(e, 'cover')}
                                                   type='file'/>
                                            <FontAwesomeIcon icon={'camera'}/>
                                            <span className={'txt--sm ml-14'}>
                                                Üzlük yükləmək
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="py-50">
                        <div className={css.profile__avatarUpload}>
                            <div className={css.profile__avatar}>
                                <div className={css.profile__avatarImg}>
                                    <img src={avatar.blob}/>
                                </div>
                                <label htmlFor={'avatar-upload'} className={css.profile__avatarUploadBtn}>
                                    <FontAwesomeIcon icon={'camera'}/>
                                    <input onChange={onUpload} type="file" id='avatar-upload'/>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="row">
                            <div className="col-lg-6">
                                <LabeledInput value={name} onChange={(e) => {
                                    setName(e.target.value)
                                }} label={'Avtosalonun adı'}/>
                            </div>
                        </div>

                    </div>
                    <div className="py-70">
                        <p className="txt--lg medium-txt mb-15">
                            İş saatları
                        </p>
                        <div>
                            {
                                openTimes.map((item, index) => (
                                    <div key={'openTimesKey' + index} className="row mb-24">
                                        <div className="col-lg-5">
                                            <Select change={(value) => {
                                                handleChangeByIndex(value, 'days', index)
                                                // handleSelectChange(value, 'schedule', setInputs)
                                            }} data={item.days}/>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <Select change={(value) => {
                                                        handleChangeByIndex(value, 'stTime', index)
                                                        // handleStartTimeChange(value)
                                                    }} data={item.stTime}/>
                                                </div>
                                                <div className="col-lg-6">
                                                    <Select change={(value) => {
                                                        handleChangeByIndex(value, 'endTime', index)
                                                        // handleSelectChange(value, 'endTime', setInputs)
                                                    }} data={{...item.endTime, options: endTimeOptions}}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-1 align-self-center">
                                            <div className="d-flex justify-center align-center">
                                                <Image onClick={() => removeOpenTime(index)}
                                                       className={'cursor-pointer'} src={x}/>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                        {
                            canAddTime &&
                            <span onClick={addOpenTimeField} className={'blue-txt medium-txt cursor-pointer'}>+ Əlavə etmək</span>
                        }
                    </div>
                    <div>

                        <div>
                            {
                                phone.map((item, index) => (
                                    <div key={'phoneFieldKey' + index} className="row mb-24">
                                        <div className="col-lg-6">
                                            <InputMask
                                                alwaysShowMask={true}
                                                maskChar={''}
                                                onChange={(e) => {
                                                    changePhoneValue(e.target.value, index)
                                                }}
                                                mask={'(099) 999-99-99'}
                                                value={item}
                                                disabled={index === 0}
                                            >
                                                {
                                                    (inputProps) => (
                                                        // <LabeledInput
                                                        //     {...inputProps}
                                                        //     label={'Əlaqə nömrə'}/>
                                                        <input {...inputProps} type="text" className={`custom-input`}/>
                                                    )
                                                }
                                            </InputMask>

                                        </div>
                                        {
                                            index !== 0 &&
                                            <div className="col-lg-1 align-self-center">
                                                <div className="d-flex justify-center align-center">
                                                    <Image onClick={() => removePhone(index)}
                                                           className={'cursor-pointer'} src={x}/>
                                                </div>
                                            </div>
                                        }

                                    </div>
                                ))
                            }
                        </div>

                        {phone.length < 3 &&
                            <span onClick={addPhoneField} className={'blue-txt medium-txt cursor-pointer'}>+ Nömrə əlavə etmək</span>}
                    </div>
                    <div className="pt-50">
                        <p className="txt--lg medium-txt mb-15">
                            Qısa nömrə
                        </p>
                        {
                            hasShortPhone &&
                            <div className="row mb-24">
                                <div className="col-lg-6">
                                    <input value={shortPhone}
                                           type="text"
                                           onChange={shortPhoneChange}
                                           className={`custom-input`}
                                    />
                                </div>
                                <div className="col-lg-1 align-self-center">
                                    <div className="d-flex justify-center align-center">
                                        <Image onClick={() => setHasShortPhone(false)}
                                               className={'cursor-pointer'} src={x}/>
                                    </div>
                                </div>

                            </div>

                        }
                        {!hasShortPhone &&
                            <span onClick={() => setHasShortPhone(true)}
                                  className={'blue-txt medium-txt cursor-pointer'}>+ Qısa nömrə əlavə etmək</span>}
                    </div>
                    <div className="py-70">
                        <p className={'txt--lg medium-txt mb-15'}>
                            Əlavə məlumat
                        </p>
                        <div>
                            <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
                                      className={'custom-input p-20'} rows={4}>

                            </textarea>
                        </div>
                    </div>
                    <div>
                        <p className={'txt--lg medium-txt mb-15'}>
                            Ünvan
                        </p>
                        <div className="row">
                            <div className="col-lg-6">
                                <Select change={(value) => {
                                    setCity(value)
                                    handleSelectChange(value, 'city', setInputs)
                                }} data={inputs.city}/>
                            </div>
                            <div className="col-lg-6">
                                <LabeledInput value={address} onChange={(e) => {
                                    setAddress(e.target.value)
                                }} label={'Ünvan'}/>
                            </div>
                        </div>
                    </div>

                </div>

            </Card>
            <div className="pt-70">
                <div>
                    <Button classes={'px-100'} type={'submit'}>
                        Təsdiq et
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default AgencyProfile;
