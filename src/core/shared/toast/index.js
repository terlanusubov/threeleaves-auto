import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import css from './toast.module.scss'

export const successToast = (mes, onClose = ()=>{}) => {
    return toast.success(<div className={`${css.toast__msg}`}>  <p>{mes}</p></div>, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        onClose,
    });
}
export const warningToast = (mes) => {
    return toast.warning(<div className='warning toast-mes'> <p>{mes}</p></div>, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false
    });
}
export const errorToast = (mes) => {
    return toast.error(<div className='error toast-mes'> <p>{mes}</p></div>, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false
    });
}
export const infoToast = (mes) => {
   return toast.info(<div className='info toast-mes'> <p>{mes}</p></div>, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false
    });
}