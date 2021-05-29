import React, { useEffect, useState } from 'react'
import { Form, Row, Col, Upload, Button, Modal, Tag } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { AttentionSeeker } from "react-awesome-reveal"
import { Breadcumb } from './Component'
import axios from '../../constants/axios'
import Loading from '../../components/Loading'

const Step1 = ({ 
    categoryList, 
    selectProducts, 
    setStepsInfo, 
    stepInfo, 
    showToast, 
    user, 
    setRQuantity, 
    selProducts,
}) => {

    const [state, setState] = useState({
        displayName: "Your name here",
        pCategory: 'Card',
        checkedProducts: [],
        sCategory: {},
        loadImg : false
    })

    const [shakeEffect, setShakeEffect] = useState(false)
    const [shakeCount, setShakeCount] = useState(0)

    const [isShowUploadModal, setShowUploadModal] = useState(false)
    const [logoFile, setLogoFile] = useState(null)
    const [designFile, setDesignFile] = useState(null)
    const [selCProduct, setSelCProduct] = useState(null)

    useEffect(() => {
        if(!shakeEffect) {
            setTimeout(() => {
                setShakeEffect(true)
                setShakeCount(shakeCount + 1)
            }, 5000)
        } else {
            setTimeout(() => {
                setShakeEffect(false)
            }, 1000)
        }
    }, [shakeEffect])

    useEffect(() => {
        if(stepInfo && categoryList) {
            let cList = null
            if(selProducts && selProducts.length > 0) {
                let cList = categoryList
                cList.map(cItem => {
                    cItem.details.map(dItem => {
                        dItem.checked = selProducts.find(e => e.id === dItem.id) ? true : false
                    })
                })
            }
            setState({
                ...state,
                pCategory: stepInfo.pCategory,
                checkedProducts: categoryList.find(e => e.name === stepInfo.pCategory)?.details,
                displayName: stepInfo.displayName,
                cList: cList ? cList : categoryList,
                sCategory: categoryList.find(e => e.name === stepInfo.pCategory)
            })
        }
    }, [stepInfo, categoryList])

    const onFinishStep = () => {
        const {pCategory, checkedProducts, displayName, cList} = state
        let selProducts = []
        cList.forEach(cItem => {
            cItem.details.forEach(dItem => {
                if(dItem.checked) {
                    let rPrice = 0
                    if(dItem.prices && dItem.prices.length > 0) {
                        if(((dItem.metadata.custom_logo === 'true' && dItem.metadata.custom_design === 'true') && (!dItem.logoIcon && !dItem.designIcon)) ||
                            ((dItem.metadata.custom_logo === 'true' && (dItem.metadata.custom_design !== 'true' || !dItem.metadata.custom_design)) && !dItem.logoIcon) ||
                            (((dItem.metadata.custom_logo !== 'true' || !dItem.metadata.custom_logo) && dItem.metadata.custom_design === 'true') && !dItem.designIcon)) {
                            rPrice = dItem.prices.find(e => e.nickname === 'standard').unit_amount ? dItem.prices.find(e => e.nickname === 'standard').unit_amount : 0
                        } else if(((dItem.metadata.custom_logo === 'true' && dItem.metadata.custom_design === 'true') && (dItem.logoIcon || dItem.designIcon)) ||
                            ((dItem.metadata.custom_logo === 'true' && (dItem.metadata.custom_design !== 'true' || !dItem.metadata.custom_design)) && dItem.logoIcon) ||
                            (((dItem.metadata.custom_logo !== 'true' || !dItem.metadata.custom_logo) && dItem.metadata.custom_design === 'true') && dItem.designIcon)) {
                            rPrice = dItem.prices.find(e => e.nickname === 'custom') ? dItem.prices.find(e => e.nickname === 'custom').unit_amount : 0
                        }
                    }
                    dItem.price = rPrice ? rPrice : dItem.price
                    selProducts.push(dItem)
                }
            })
        })
        
        selectProducts(selProducts)

        setStepsInfo({
            pCategory,
            checkedProducts,
            displayName
        })
    }

    const handleSelectProduct = obj => event => {
        const { checkedProducts, cList, pCategory } = state
        checkedProducts.map(value => {
            if(!value.checked) {
                value.checked = false
                value.quantity = 0
            }
            return value
        })
        let sProduct = checkedProducts.find(e => e.id === obj.id)
        if(sProduct) {
            sProduct.checked = !sProduct.checked
            sProduct.quantity = 1

            let rPrice = 0
            if(sProduct.prices && sProduct.prices.length > 0) {
                if(((sProduct.metadata.custom_logo === 'true' && sProduct.metadata.custom_design === 'true') && (!sProduct.logoIcon && !sProduct.designIcon)) ||
                    ((sProduct.metadata.custom_logo === 'true' && (sProduct.metadata.custom_design !== 'true' || !sProduct.metadata.custom_design)) && !sProduct.logoIcon) ||
                    (((sProduct.metadata.custom_logo !== 'true' || !sProduct.metadata.custom_logo) && sProduct.metadata.custom_design === 'true') && !sProduct.designIcon)) {
                    rPrice = sProduct.prices.find(e => e.nickname === 'standard').unit_amount ? sProduct.prices.find(e => e.nickname === 'standard').unit_amount : 0
                } else if(((sProduct.metadata.custom_logo === 'true' && sProduct.metadata.custom_design === 'true') && (sProduct.logoIcon || sProduct.designIcon)) ||
                    ((sProduct.metadata.custom_logo === 'true' && (sProduct.metadata.custom_design !== 'true' || !sProduct.metadata.custom_design)) && sProduct.logoIcon) ||
                    (((sProduct.metadata.custom_logo !== 'true' || !sProduct.metadata.custom_logo) && sProduct.metadata.custom_design === 'true') && sProduct.designIcon)) {
                    rPrice = sProduct.prices.find(e => e.nickname === 'custom') ? sProduct.prices.find(e => e.nickname === 'custom').unit_amount : 0
                }
            }

            sProduct.price = rPrice ? rPrice : sProduct.price

            let rquantity = 0
            cList.forEach(cItem => {
                cItem.details.forEach(dItem => {
                    if(dItem.checked) {
                        rquantity += dItem.quantity
                    }
                })
            })
            
            setRQuantity(rquantity)
            cList.map(e => {
                if(e.name === pCategory) {
                    e.details = checkedProducts
                }
            })
            setState({
                ...state,
                checkedProducts,
                cList
            })
        }
    }

    const handleSelectCategory = obj => {
        const { cList } = state
        let nDetails = cList.find(e => e.name === obj.name)?.details
        if(nDetails) {
            nDetails.map(e => {
                e.checked = e.checked ? e.checked : false
                return e
            })
            setState({
                ...state,
                checkedProducts: nDetails,
                pCategory: obj.name,
                sCategory: obj
            })
        }
    }

    const calcIPercentage = (newValue, oldValue) => {
        let _old = Math.ceil(oldValue)
        let _new = Math.ceil(newValue)
        
        let percentage = 0
        
        if(_old) {
            percentage = Math.floor(((_new - _old) / _old) * 100)
        } else {
            percentage = 0
        }
        return percentage
    }

    const handleOpenUploadModal = obj => e => {
        e.stopPropagation()
        setSelCProduct(obj)
        setShowUploadModal(true)
    }

    const handleCustomRequest = name => async({ onSuccess, onError, file, onProgress }) => {
        const formData = new FormData()
        formData.append('image', file)
        try {
            let result = await axios.post('user/product/uploadProductImage', formData)
            if( result && result.data.success ) {
                if(name === 'logoFile') {
                    setLogoFile([{
                        uid: -1,
                        name: result.data.imageUrl.split('/')[2],
                        status: 'done',
                        url: result.data.imageUrl
                    }])

                } else if(name === 'designFile') {
                    setDesignFile([{
                        uid: -1,
                        name: result.data.imageUrl.split('/')[2],
                        status: 'done',
                        url: result.data.imageUrl
                    }])
                }
                showToast('success', 'Successfully Uploaded')
            }
            
        } catch(err) {
            showToast('error', 'Failed uploading')
        }
    }

    const handleUploadImage = () => {
        const { checkedProducts } = state
        let nObj = {}

        if(logoFile) {
            nObj['logoIcon'] = logoFile[0].url
        }
        if(designFile) {
            nObj['designIcon'] = designFile[0].url
        }
        checkedProducts.map(value => {
            if(value.id === selCProduct.id) {
                if(logoFile) {
                    value['logoIcon'] = logoFile[0].url
                }
                if(designFile) {
                    value['designIcon'] = designFile[0].url
                }
                return value
            }
        })

        setState({
            ...state,
            checkedProducts
        })

        setStepsInfo({
            pCategory: state.pCategory,
            checkedProducts: state.checkedProducts,
            displayName: state.displayName
        })

        setShowUploadModal(false)
    }

    const handleCloseIcon = (name, obj) => event => {
        const { checkedProducts } = state
        checkedProducts.map(value => {
            if(value.id === obj.id) {
                delete value[name]
                return value
            }
        })

        setState({
            ...state,
            checkedProducts
        })

        setStepsInfo({
            pCategory: state.pCategory,
            checkedProducts: state.checkedProducts,
            displayName: state.displayName
        })
    }

    const setCardImage = obj => {

        const { checkedProducts, cList } = state

        let resultImg = null
        
        if(checkedProducts) {
            let selProducts = checkedProducts.filter(e => e.checked === true)

            if(selProducts && selProducts.length > 0) {
                let category = selProducts[0].metadata.category
                if(category.toUpperCase() === obj.name.toUpperCase()) {
                    let product_count = selProducts.length
                    resultImg = `${window.location.origin}/cards/${obj.name}/${selProducts[product_count - 1].name}.png`
                }
            } else {
                if(cList) {
                    let category = cList.find(e => e.name === obj.name)
                    if(category.details && category.details.length > 0) {
                        resultImg = `${window.location.origin}/cards/${obj.name}/${category.details[0].name}.png`
                    }
                }
            }
        } 
        return resultImg
    }

    const setCCardImage = obj => {
        const { cList } = state
        let resultImg = null
        if(cList) {
            let category = cList.find(e => e.name === obj.name)
            if(category.details && category.details.length > 0) {
                resultImg = `${window.location.origin}/cards/${obj.name}/${category.details[0].name}.png`
            }
        }
        return resultImg
    }

    const handleLoadImage = () => {
        setState({
            ...state,
            loadImg: true
        })
    }

    return (
        <div>
            {
                !state.loadImg && <Loading className="blank-loading-icon" />
            }

            <Breadcumb currentStep={0} />

            <Form onFinish={onFinishStep} className="step-form step1" style={state.loadImg ? {} : {visibility: 'hidden'}} >
                <div className="step-top-part font-weight-900">
                    <h2>Select your tap product.</h2>
                    <div className="common-subtitle-size">
                        Personalize your order.
                    </div>
                </div>

                <Form.Item>
                    {
                        setCardImage(state.sCategory) && (
                            <img className="card-image" src={setCardImage(state.sCategory)} alt="linkup card"  onLoad={handleLoadImage} />
                        )
                    }
                    
                </Form.Item>

                <Form.Item>
                    <Row className="category-list-part">
                        {categoryList && categoryList.map((cValue, cIndex) => {
                            const imgUrl = setCCardImage(cValue)
                            return(
                                <Col 
                                    className="category-item" 
                                    xs={6} 
                                    key={cIndex}
                                    >
                                    <div 
                                        className="category-image" 
                                        onClick={() => handleSelectCategory(cValue)}>
                                        <div style={cValue.name === state.pCategory && imgUrl ? {borderColor: '#3aa3ae', backgroundImage: `url("${imgUrl}")`} : {borderColor: '#9fa9ba', backgroundImage: `url("${imgUrl}")`}}>
                                        </div>
                                    </div>
                                    <div className="category-name common-text-size">
                                        {cValue.name}
                                    </div>
                                </Col>
                            )
                        }
                        )}
                    </Row>
                </Form.Item>

                <div className="category-product-details">
                    {
                        state.checkedProducts && state.cList && state.cList.find(e => e.name === state.pCategory)?.details.map((dValue, dIndex) => {
                            let rPrice = 0
                            if(dValue.prices && dValue.prices.length > 0) {
                                if(((dValue.metadata.custom_logo === 'true' && dValue.metadata.custom_design === 'true') && (!dValue.logoIcon && !dValue.designIcon)) ||
                                    ((dValue.metadata.custom_logo === 'true' && (dValue.metadata.custom_design !== 'true' || !dValue.metadata.custom_design)) && !dValue.logoIcon) ||
                                    (((dValue.metadata.custom_logo !== 'true' || !dValue.metadata.custom_logo) && dValue.metadata.custom_design === 'true') && !dValue.designIcon)) {
                                    rPrice = dValue.prices.find(e => e.nickname === 'standard').unit_amount ? dValue.prices.find(e => e.nickname === 'standard').unit_amount : 0
                                } else if(((dValue.metadata.custom_logo === 'true' && dValue.metadata.custom_design === 'true') && (dValue.logoIcon || dValue.designIcon)) ||
                                    ((dValue.metadata.custom_logo === 'true' && (dValue.metadata.custom_design !== 'true' || !dValue.metadata.custom_design)) && dValue.logoIcon) ||
                                    (((dValue.metadata.custom_logo !== 'true' || !dValue.metadata.custom_logo) && dValue.metadata.custom_design === 'true') && dValue.designIcon)) {
                                    rPrice = dValue.prices.find(e => e.nickname === 'custom') ? dValue.prices.find(e => e.nickname === 'custom').unit_amount : 0
                                }
                            }

                            return (
                                <div 
                                    className="child-product-details" 
                                    key={dIndex} 
                                    onClick={handleSelectProduct(dValue)}
                                    style={!state.checkedProducts.find(e => e.id === dValue.id)?.checked ? {backgroundColor: 'transparent', borderColor: '#9fa9ba'} : {backgroundColor: 'transparent', borderColor: '#3aa3ae'}}>
                                    {
                                        calcIPercentage(rPrice ? rPrice /100 : dValue.price / 100, dValue.metadata.old_price) !== 0 && (
                                            <div className="increase-percentage common-text-small-size">
                                                {calcIPercentage(rPrice ? rPrice /100 : dValue.price / 100, dValue.metadata.old_price)}%
                                            </div>
                                        )
                                    }

                                    <div className="child-product-content">
                                        <div className="header">
                                            <div className="header-part">
                                                <div className="title">
                                                    <span>
                                                        {dValue.name}
                                                    </span>

                                                    {
                                                        (((dValue.metadata.custom_logo === 'true' && dValue.metadata.custom_design === 'true') && (!dValue.logoIcon || !dValue.designIcon)) ||
                                                        ((dValue.metadata.custom_logo === 'true' && (dValue.metadata.custom_design !== 'true' || !dValue.metadata.custom_design)) && !dValue.logoIcon) ||
                                                        (((dValue.metadata.custom_logo !== 'true' || !dValue.metadata.custom_logo) && dValue.metadata.custom_design === 'true') && !dValue.designIcon)) && (
                                                            // shakeEffect ? (
                                                            //     <AttentionSeeker 
                                                            //         effect="jello" 
                                                            //         duration={ 1000 } 
                                                            //         delay={ 0 } 
                                                            //     >
                                                            //         <div className="add-on-part" onClick={handleOpenUploadModal(dValue)}>
                                                            //             <Button>Add on</Button>
                                                            //             <span>Add logo for +$20</span>
                                                            //             {/* <UploadOutlined style={{width: '12px', height: '12px'}} /> */}
                                                            //         </div>
                                                            //     </AttentionSeeker>
                                                            // ) : (
                                                            //     <div className="add-on-part" onClick={handleOpenUploadModal(dValue)}>
                                                            //         <Button>Add on</Button>
                                                            //         <span>Add logo for +$20</span>
                                                            //         {/* <UploadOutlined style={{width: '12px', height: '12px'}} /> */}
                                                            //     </div>
                                                            // )
                                                            <AttentionSeeker 
                                                                effect="jello" 
                                                                duration={ 1000 } 
                                                                delay={!shakeEffect ? 6000 * shakeCount : 0}
                                                            >
                                                                <div className="add-on-part" onClick={handleOpenUploadModal(dValue)}>
                                                                    <Button>Add on</Button>
                                                                    <span>Add logo for +$20</span>
                                                                    {/* <UploadOutlined style={{width: '12px', height: '12px'}} /> */}
                                                                </div>
                                                            </AttentionSeeker>
                                                            // <Animated 
                                                            //     animationIn="jello"
                                                            //     animationOut="jello"
                                                            //     animationInDuration={1000}
                                                            //     animationOutDuration={0}
                                                            //     isVisible={shakeEffect}
                                                            // >
                                                            //     <div className="add-on-part" onClick={handleOpenUploadModal(dValue)}>
                                                            //         <Button>Add on</Button>
                                                            //         <span>Add logo for +$20</span>
                                                            //         {/* <UploadOutlined style={{width: '12px', height: '12px'}} /> */}
                                                            //     </div>
                                                            // </Animated>
                                                        )
                                                    }
                                                </div>

                                                <div>
                                                    {
                                                        dValue.metadata.custom_logo === 'true' && dValue.logoIcon && (
                                                            <Tag className="exist-logo-status" closable onClose={handleCloseIcon('logoIcon', dValue)}>Logo</Tag>
                                                        )
                                                    }

                                                    {
                                                        dValue.metadata.custom_design === 'true' && dValue.designIcon && (
                                                            <Tag className="exist-logo-status" closable onClose={handleCloseIcon('designIcon', dValue)}>Design</Tag>
                                                        )
                                                    }
                                                </div>

                                            </div>
                                            <div className="desc common-text-size">
                                                {dValue.description ? dValue.description : ''}
                                            </div>
                                        </div>
                                        <div className="prices common-text-small-size">
                                            <span className="current-price common-text-small-size border-radius-2 color-white">${rPrice / 100 ? parseFloat(rPrice / 100).toFixed(2) : parseFloat(dValue.price / 100).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            )
                        })
                    }
                </div>
                
                <div className="btn-group">
                    <Button size="large" className="next-button" htmlType="submit">
                        NEXT
                    </Button>
                </div>
                
            </Form>

            <Modal 
                className="upload-img-modal"
                title="Upload your custom images" 
                visible={isShowUploadModal}
                onOk={handleUploadImage}
                onCancel={() => { setShowUploadModal(false) }}
            >
                <div className="upload-box-title">We accept png, jpg, jpeg files only. For the best resolution, images should be transparent.</div>

                { selCProduct && selCProduct.metadata.custom_logo === 'true' && (
                    <div className="upload-box-container">
                        <Upload 
                            className="upload-box-part"
                            fileList={logoFile}
                            customRequest={handleCustomRequest('logoFile')}
                            listType="picture"
                            beforeUpload={async file => {
                                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
                                if (!isJpgOrPng) {
                                    showToast('error', 'You can only upload JPG/PNG file!')
                                }
                                const isLt2M = file.size / 1024 / 1024 < 2
                                if (!isLt2M) {
                                    showToast('error', 'Image must smaller than 2MB!')
                                }
                                return isJpgOrPng && isLt2M
                            }}
                            onRemove={() => {setLogoFile(null)}}
                        >
                            <Button icon={<UploadOutlined />}>Upload logo</Button>
                            <p className="box-desc">Image size: 50 x 50</p>
                        </Upload>
                    </div>
                )}

                { selCProduct && selCProduct.metadata.custom_design === 'true' && (
                    <div className="upload-box-container">
                        <Upload 
                            className="upload-box-part"
                            fileList={designFile}
                            customRequest={handleCustomRequest('designFile')}
                            listType="picture"
                            beforeUpload={async file => {
                                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
                                if (!isJpgOrPng) {
                                    showToast('error', 'You can only upload JPG/PNG file!')
                                }
                                const isLt2M = file.size / 1024 / 1024 < 2
                                if (!isLt2M) {
                                    showToast('error', 'Image must smaller than 2MB!')
                                }
                                return isJpgOrPng && isLt2M
                            }}
                            onRemove={() => {setDesignFile(null)}}
                        >
                            <Button icon={<UploadOutlined />}>Upload design</Button>
                            <p className="box-desc">Image size: 86 x 54</p>
                        </Upload>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Step1