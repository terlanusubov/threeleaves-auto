import React, {useEffect, useState} from 'react';
import PublishLayout from "../../../src/core/layouts/publish";
import Searchbar from "../../../src/core/layouts/main/components/header/components/searchbar";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import * as services from "../../../src/services";
import {modelSelect} from "../../../src/store/actions/publish-actions";
import ResetPublish from "../../../src/core/shared/reset-publish";
import PublishGoBack from "../../../src/core/shared/publish-go-back";
import css from './model.module.scss'
import Head from "next/head";
import publishCss from '../publish.module.scss'
export async function getServerSideProps(context) {
    if (context.query?.brandId) {
        const brandId = context.query.brandId
        // const models = await services.getModels(brandId).then(res=>res.models)
        const [models] = await Promise.all([
            services.getModels(brandId).then(res => res.models) || [],
        ]);
        return {
            props: {
                models,
            }
        }
    }
    return {
        redirect: {
            permanent: false,
            destination: '/publish'
        }
    }
    // const filters = await services.getFilters().then(res => res.filters)

    // const models = await axios.get(endpoints.models).then(res => res.data)
    // const popularModels = await axios.get(endpoints.popularModels).then(res=>res.data)

}

function Model(props) {
    const router = useRouter()
    const dispatch = useDispatch()
    const steps = useSelector(({publish}) => publish.steps)
    const brandId = useSelector(({publish}) => publish.values.brandId)
    const stepId = 1
    const prevStepId = 0

    const [models, setModels] = useState([...props.models])

    const modelClick = (model) => {
        dispatch(modelSelect(model))
    }

    const onSearch = (val) => {
        let newArr = []
        props.models.forEach(dt => {
            if (dt.models && (Array.isArray(dt.models) && dt.models.length)) {
                const newModels = [...dt.models].filter(item => item.name.toLowerCase().includes(val.toLowerCase()))
                newModels.length &&
                newArr.push({
                    ...dt,
                    models: newModels
                })
            } else if (dt.name.toLowerCase().includes(val.toLowerCase())) {
                newArr.push({...dt})
            }
        })

        if (val.trim() !== '') {
            setModels(newArr)
        } else setModels([...props.models])
    }

    useEffect(() => {
        const prevStep = steps[stepId - 1]
        if (!prevStep.done) {
            router.push(prevStep.route)
        }
    }, [])

    return (
        <PublishLayout>
            <Head>
                <title>
                    Treo - Model
                </title>
            </Head>
            <div className={'mt-60'}>
                <div className={'d-flex justify-between align-center'}>
                    <div>
                        <div key={steps[0]?.name + steps[0]?.id} className='d-flex align-center'>
                            <div className={css.model__icon}>
                                <img src={steps[0]?.value?.icon} alt=""/>
                            </div>
                            <span className={`${publishCss.publish__crumb} blue-txt bold-txt ml-10 ml-md-8`}>{steps[0]?.value?.name}</span>
                        </div>
                    </div>
                    <div>
                        <ResetPublish/>
                    </div>
                </div>
                <div className={'mt-30'}>
                    <Searchbar placeholder={'Modellər üzrə axtarış'} noResult onSearch={onSearch}/>
                </div>
                <div className={'py-30'}>
                    <div className="container-fluid">
                        <div className="row">
                            {
                                models.map(model => {
                                    if (model.models && (Array.isArray(model.models) && model.models.length)) {
                                        return (
                                          <div key={model.id + model.name + model.autoBrandId} className={`${css.model__list} col-4 col-lg-3 col-md-3 col-sm-4`}>
                                              <p className={`${css.model__list__group} gray-txt bold-txt txt--xxl mb-22`}>
                                                  {model.name}
                                              </p>
                                              <div>
                                                  {
                                                      model.models.map(item => (
                                                        <p
                                                          onClick={() => modelClick(item)}
                                                          key={item.id + item.name + item.autoBrandId}
                                                          className={`${css.model__list__item} gray-txt py-12 cursor-pointer`}>
                                                            {item.name}
                                                        </p>
                                                      ))
                                                  }
                                              </div>
                                          </div>

                                        )
                                    }
                                    return (
                                      <div key={model.id + model.name + model.autoBrandId} className="col-lg-3">
                                          <div>
                                              <p
                                                onClick={() => modelClick(model)}
                                                key={model.id + model.name + model.autoBrandId}
                                                className={'gray-txt py-12 cursor-pointer'}>
                                                  {model.name}
                                              </p>
                                          </div>
                                      </div>

                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={'pb-100 invisible-md'}>
                <div className="row">
                    <div className="col-6">
                        <PublishGoBack/>
                    </div>
                    <div className="col-6">

                    </div>
                </div>
            </div>
        </PublishLayout>

    );
}

export default Model;
