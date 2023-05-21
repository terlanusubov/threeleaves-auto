import React, { useEffect, useMemo } from 'react';
import css from './mobile-steps.module.scss'
import { generateGuid } from "../../helpers/common-functions";
import Image from "next/image";
import checkFillIcon from "../../../assets/images/check-fill.svg";
import PublishGoBack from "../publish-go-back";
import Button from "../button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useRouter} from "next/router";

function MobileSteps({steps, onNext = ()=>{}, isEdit = false}) {
  const router = useRouter()
  const selectedStep = useMemo(() => {
    let selected = 0
    if (!isEdit){
      steps.forEach((item, i) => {
        if (steps[i].done) {
            selected = steps[i + 1]
        }
      })
      if (selected === 0) return steps[0]
      return selected
    }
    else {
      return steps.find(item=>router.pathname === item.route)
    }

  }, [isEdit, router, steps])

  return (
    <div className={ `${ css.wrapper }` }>
      <div className="d-flex justify-between align-center mb-25 " style={{gap: '25px'}}>
        <PublishGoBack className={ css.wrapper__goBack } />
        <span className="text-center txt txt--xs green-txt bold-txt">{ selectedStep?.name }</span>
        <Button click={ !selectedStep?.noNext ? onNext : ()=>null } color='primary' classes={ `w-100 ${ css.wrapper__goBack } ${selectedStep?.noNext && 'hidden '}` }>
          İrəli
          <FontAwesomeIcon icon={ 'chevron-right' } />
        </Button>
      </div>

      <div className="d-flex justify-between align-center">
        {
          steps.map(step => {
            return (
              <div key={ generateGuid() }
                   className={ `${ css.wrapper__item } ${ step.done ? css.wrapper__itemActive : '' }` }>
                { step.done && <Image src={ checkFillIcon } /> }
              </div>
            )
          })

        }
      </div>
    </div>
  );
}

export default MobileSteps;
