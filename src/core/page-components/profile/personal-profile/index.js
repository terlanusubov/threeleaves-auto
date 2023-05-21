import Card from "../../../shared/card";
import css from './personal-profile.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LabeledInput from "../../../shared/labeled-input";
import React, {useState} from "react";
import Select from "../../../shared/form-elements/select-elements/select";
import {
    generateGuid,
    generateHoursOfDay,
    handleSelectChange,
    imgToBlob,
    toFormData
} from "../../../helpers/common-functions";
import * as services from "../../../../services";
import Button from "../../../shared/button";
import {useDispatch, useSelector} from "react-redux";
import {updateProfile} from "../../../../services/profile.services";
import {errorToast, successToast} from "../../../shared/toast";
import {setUserDataLocal} from "../../../configs/auth.config";
import {setUserData} from "../../../../store/actions/auth-actions";
import {getProfile, getProfileSuccess} from "../../../../store/actions/profile-actions";

function PersonalProfile() {
    const dispatch = useDispatch()

    const profile = useSelector(({profile}) => profile.profile)

    const [name, setName] = useState(profile.name)

    const [phone, setPhone] = useState(profile.phones[0])

    const [avatar, setAvatar] = useState({file: null, isOld: true, blob: profile.avatar})

    const onUpload = (event, type = 'avatar') => {
        const file = event.target.files[0];
                setAvatar({
                    file,
                    blob: imgToBlob(file),
                    isOld: false
                });
        }



    const submit = (e)=>{
        e.preventDefault()

        const data = {
            name,
            image : avatar.file,
        }
        const formData = toFormData(data)
        updateProfile(formData)
            .then(res=>{
                const userData = res
                setUserDataLocal(userData)
                dispatch(setUserData(userData))
                dispatch(getProfileSuccess({...profile, name}))
                dispatch(getProfile())
                successToast('Uğurlu əməliyyat!')
            })
            .catch(err=>{
                errorToast('Xəta baş verdi!')
            })
    }

    return (
        <form onSubmit={submit}>
            <Card>
                <div className={'p-6'}>
                    <p className="card-title bold-txt">
                        Şəxsi məlumatlar
                    </p>
                    <div className="pt-6">
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
                    <div className={'pt-50'}>
                        <div className="row">
                            <div className="col-lg-6">
                                <LabeledInput value={name} onChange={(e) => {
                                    setName(e.target.value)
                                }} label={'Ad və soyad'}/>
                            </div>
                        </div>

                    </div>
                    <div className={'pt-50'}>
                        <div className="row">
                            <div className="col-lg-4">
                                <Button type={'submit'} color={'primary'} classes={'w-100'}>
                                    Yadda saxlamaq
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={'pt-60'}>

                        <div>
                            <div className="row mb-24">
                                <div className="col-lg-6">
                                    <LabeledInput disabled value={phone} label={'Əlaqə nömrəsi'}/>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </form>
    );
}

export default PersonalProfile;