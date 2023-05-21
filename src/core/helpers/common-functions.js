export const generateGuid = () => {
    let dt = new Date().getTime();
    let guid = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return guid;
}
export const renderDateFormat = (date, inputFormat = false) => {
    const dateFormat = new Date(date)
    let dayFormat = ""
    let mothFormat = ""
    let yearFormat = ""
    if (dateFormat.getMonth() >= 9) {
        mothFormat = dateFormat.getMonth() + 1
    } else {
        mothFormat = "0" + (dateFormat.getMonth() + 1)
    }
    if (dateFormat.getDate() >= 10) {
        dayFormat = dateFormat.getDate()
    } else dayFormat = '0' + dateFormat.getDate()
    yearFormat = dateFormat.getFullYear()

    return inputFormat ? yearFormat + "-" + mothFormat + "-" + dayFormat : dayFormat + "." + mothFormat + "." + yearFormat
}

export const recursiveLister = (rows , childColumn, superParentValue) => {
    const parents = [];
    const noParent = [];
    const arr = JSON.parse(JSON.stringify(rows));
    arr.forEach((item, index) => {
        if (item[childColumn] !== superParentValue) {
            if (arr.find((it) => it.id === item[childColumn])) {
                arr.forEach((datum) => {
                    if (datum.id === item[childColumn]) {
                        if (datum.children && Array.isArray(datum.children)) {
                            datum.children.push(item);
                        } else {
                            datum.children = [item];
                        }
                    }
                });
            } else {
                noParent.push(item);
            }
        }
    });
    arr.forEach((item) => {
        if (item[childColumn] === superParentValue) {
            parents.push(item);
        }
    });
    noParent.forEach(item => {
        parents.push(item);
    });
    return parents;
};

export const extractTime = (date) => {
    let hours = ""
    let minutes = ""

    const dateFormat = new Date(date)
    if (dateFormat.getHours() <= 9) {
        hours = `0${dateFormat.getHours()}`
    } else {
        hours = dateFormat.getHours()
    }

    if (dateFormat.getMinutes() <= 9) {
        minutes = `0${dateFormat.getMinutes()}`
    } else {
        minutes = dateFormat.getMinutes()
    }
    return `${hours}:${minutes}`
}


export function changePassVisibility(input, callback) {
    callback((prev) => {
        const prevInput = {...prev.inputs[input]};
        prevInput.visible = !prevInput.visible;
        return {
            ...prev,
            inputs: {
                ...prev.inputs,
                [input]: prevInput
            }
        }
    })

}

export function mapFormItems(inputs, callback, wrapperComp) {
    return Object.keys(inputs).map((input, index) => {
        const currentInput = inputs[input]
        return <div key={currentInput.label + index}
                    className={`login-section__panel__content__form__field pt-10 pb-15`}>
            {currentInput.type === 'password' ?
                <input autoComplete={'off'} onChange={(e) => {
                    changeInputValue(e, input, inputs, callback)
                }} type={currentInput.visible ? 'text' : 'password'}
                       className={`custom-input ${!currentInput.isValid && currentInput.touched ? 'invalid-field' : ''}`}
                    // onBlur={(e)=>{inputBlur(e,input, inputs, callback)}}
                       placeholder={currentInput.placeholder}/>
                :
                <input autoComplete={'off'} onChange={(e) => {
                    changeInputValue(e, input, inputs, callback)
                }}
                       type={currentInput.type}
                       className={`custom-input`}
                    // onBlur={(e)=>{inputBlur(e,input, inputs, callback)}}
                       placeholder={currentInput.placeholder}/>
            }
            <span className={'err-txt'}>
                                {!currentInput.isValid && currentInput.touched ? currentInput.currentErrTxt : null}
                            </span>
        </div>
    })
}

export function changeInputValue(event, input, state, callback) {

    // prevInput.isValid = checkInputValidation(prevInput.value, prevInput.validation, prevInput, state)
    //
    // let formValid = true;
    //
    // Object.keys(state).map(item => {
    //     formValid = state[item].isValid && formValid
    // })
    callback((prev) => {
        const prevInput = {...prev.inputs[input]}
        prevInput.value = event.target.value
        prevInput.touched = true;
        prevInput.isValid = checkInputValidation(prevInput.value, prevInput.rules, prevInput, state)
        let formValid = true
        Object.keys(state).map(item => {
            if (item !== input) {
                formValid = state[item].isValid && formValid
            } else formValid = prevInput.isValid && formValid
        })
        return {
            ...prev,
            inputs: {
                ...prev.inputs,
                [input]: prevInput
            },
            formValid
        }
    })
}

export const handleSelectChange = (value, input, callback) => {
    callback(prevState => {
        let newInput = {...prevState[input], value}
        return {
            ...prevState,
            [input]: {...newInput}
        }
    })
}

export function checkInputValidation(value, rules, input, inputState) {
    let isValid = true;
    if (rules) {
        if (rules.minLength) {
            const thisValid = value.trim().length >= Number(rules.minLength.value) || value.trim() === ''
            isValid = thisValid && isValid
            if (!thisValid) {
                input.currentErrTxt = rules.minLength.errorText
            }

        }
        if (rules.maxLength) {
            const thisValid = value.trim().length <= Number(rules.maxLength.value)
            isValid = thisValid && isValid
            if (!thisValid) {
                input.currentErrTxt = rules.maxLength.errorText
            }
            // if(thisValid){
            //     input.currentErrTxt = ""
            // }
        }
        if (rules.regexp) {
            if (value.trim().length > 0) {
                const reg = new RegExp(rules.regexp.value)
                const thisValid = reg.test(value.trim())
                isValid = thisValid && isValid
                if (!thisValid) {
                    input.currentErrTxt = rules.regexp.errorText
                }
                // if(thisValid){
                //     input.currentErrTxt = ""
                // }
            }
            // if(value.trim() === ""){
            //     input.currentErrTxt = ""
            // }
        }
        if (rules.isEqualToPass) {
            isValid = value === inputState.password.value && isValid
            if (!isValid) {
                input.currentErrTxt = rules.isEqualToPass.errorText
            }
        }
        if (rules.required) {
            const thisValid = value.trim() !== ''
            isValid = thisValid && isValid;
            if (!thisValid) {
                input.currentErrTxt = rules.required.errorText
            }
        }
    }

    return isValid;
}

export const createOptionsRange = (min, max, offset) => {
    let current = min
    const options = []
    while (current <= max) {
        options.push({title: current, value: current.toString()})
        current += offset
    }
    return options
}

export const handleCheckboxChange = (items, val, id, callback) => {
    let newElements = items.map(item => {
        if (item.id === id) {
            return {...item, checked: val}
        } else return item
    })
    callback(newElements)
}

export const generateHoursOfDay = (start = 0) => {
    const hourArr = []
    const template = ':00'
    for (let i = start; i < 24; i++) {
        i >= 10 ? hourArr.push({title: i + template, value: i + template}) : hourArr.push({
            title: '0' + i + template,
            value: i === 0 ? '00' + template : '0' + i + template
        })
    }
    return hourArr
}

export const imgToBlob = (file) => {
    return URL.createObjectURL(file)
}

export const checkIfObject = (data) => {
    return typeof data === 'object' &&
        !Array.isArray(data) &&
        data !== null
}

export const toFormData = (data) => {
    const formData = new FormData
    for (let key in data) {
        if (Array.isArray(data[key])) {
            data[key].forEach((item, index) => {
                if (checkIfObject(item) && !key.includes('file')) {
                    for (const partObjKey in item) {
                        formData.append(key + `[${index}].${partObjKey}`, item[partObjKey])
                    }
                } else formData.append(key + `[${index}]`, item)

            })
        } else formData.append(key, data[key])
    }
    return formData
}

export const simplifyPhoneNumber = (phone) => {
    return phone.replace(/[^0-9]/g, '')
}

export const beautifyLargeNumbers = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
