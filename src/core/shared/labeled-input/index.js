import css from './labeled-input.module.scss'
function LabeledInput({value = '', onChange = ()=>{}, type = 'text', label = '', disabled}) {
    return (
        <div className={css.input}>
            <span className={'txt--xxs gray-txt'}>{label}</span>
            <input disabled={disabled} onChange={onChange} value={value} type={type}/>
        </div>
    );
}

export default LabeledInput;
