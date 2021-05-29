import React, { useState, useEffect } from 'react'
import {
    Form,
    Button,
    Input,
    AutoComplete,
    Row,
    Col,
    Collapse
} from 'antd'
import {CaretRightOutlined} from '@ant-design/icons'
import countryList from 'react-select-country-list'
import axios from '../../constants/axios'
import 'boxicons'
import {provinceList} from './provinceList'

const { Option } = AutoComplete
const { Panel } = Collapse

const OStep2 = ({ selectUserDetails, movePrevStep, setStepsInfo, stepInfo, showToast }) => {

    const [state, setState] = useState({
        street_num: '',
        unit_num: '',
        city: '',
        province: '',
        zipcode: '',
        country: '',
        shipCountry: '',
        product: {},
        country_option: countryList().getData()
    })

    useEffect(() => {
        if(stepInfo) {
            setState({
                ...state,
                street_num: stepInfo.street_num,
                unit_num: stepInfo.unit_num,
                city: stepInfo.city,
                country: stepInfo.country,
                province: stepInfo.province,
                zipcode: stepInfo.zipcode,
                shipCountry: stepInfo.shipCountry
            })
        }
    }, [stepInfo])

    const onFinishStep = async() => {
        const { street_num, province, city, zipcode, shipCountry, country, unit_num } = state
        let input_data = {
            billingInfos: {
                street_num,
                city,
                province,
                zipcode: zipcode.toUpperCase(),
                country: shipCountry,
            },
            step: 1
        }

        setStepsInfo({
            street_num,
            unit_num,
            city,
            province,
            zipcode,
            shipCountry,
            country
        })
        
        try{
			const result = await axios.post('user/auth/confirmsignup2', input_data)
			if(result.data.success) {
                let bInfos = input_data.billingInfos
                bInfos['unit_num'] = unit_num
                selectUserDetails(bInfos)
			} else {
                showToast('error', result.data.message)
			}
		} catch(err) {
			if(err.response && err.response.data) {
				if(err.response.data.message) {
                    showToast('error', err.response.data.message)
				} else if(err.response.data.error) {
					if(Array.isArray(err.response.data.error)) {
                        showToast('error', 'All input fields are mandatory.')
					} else {
                        showToast('error', err.response.data.error || err.response.data.error[0])
					}
				}
				
			} else {
                showToast('error', err.message)
			}
			
		}

    }

    const handleChange = key => async event => {
        event.preventDefault()
        if(event.target.value !== undefined) {
            setState({
                ...state,
                [key] : event.target.value
            })
            setStepsInfo({
                street_num: state.street_num,
                unit_num: state.unit_num,
                city: state.city,
                province: state.province,
                zipcode: state.zipcode,
                country: state.country,
                shipCountry: state.shipCountry,
                [key]: event.target.value
            })
        }

    }

    const handleSelect = key => event => {
		if (key === 'country') {
			const { country_option } = state
            let findResult = country_option.find(e => e.label === event)
            
            setState({
                ...state,
                country: event
            })

			if (findResult) {
                setStepsInfo({
                    street_num: state.street_num,
                    unit_num: state.unit_num,
                    city: state.city,
                    province: state.province,
                    zipcode: state.zipcode,
                    country: event,
                    shipCountry: findResult.value
                })
				setState({
                    ...state,
                    country: event,
                    shipCountry: findResult.value
				})
			}
		} else {
            setState({
                ...state,
                [key]: event
            })
            setStepsInfo({
                street_num: state.street_num,
                unit_num: state.unit_num,
                city: state.city,
                province: event,
                zipcode: state.zipcode,
                country: state.country,
                shipCountry: state.shipCountry
            })
        }
    }

    return (
        <Form 
            onFinish={onFinishStep} 
            className="step-form step2"
        >

            <div className="step-top-part">
                <h2>Tell us where to send it.</h2>
                <div className="common-subtitle-size">
                    Orders are sent in 1-7 business days. Due to COVID-19, you may experience some delay in your shipment.
                </div>
            </div>

            <Collapse className="collapse-container"
                defaultActiveKey={['1']}
                expandIconPosition="right"
                expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>} 
                >
            
                <Panel header="Shipping Address" key="1" className="shipping-address-container">
                    <Input
                        size="large"
                        value={state.street_num}
                        placeholder="Street number and name"
                        onChange={handleChange('street_num')}
                        onInput={handleChange('street_num')}
                    />

                    <Input
                        size="large"
                        value={state.unit_num}
                        placeholder="Unit / Appt. Number"
                        onChange={handleChange('unit_num')}
                        onInput={handleChange('street_num')}
                    />

                    <Input
                        size="large"
                        value={state.city}
                        placeholder="City"
                        onChange={handleChange('city')}
                        onInput={handleChange('city')}
                    />

                    <AutoComplete
                        size="large"
                        value={state.country}
                        defaultValue={state.country}
                        placeholder="Country"
                        onChange={handleSelect('country')}
                    >
                        { 
                            ((state.country_option || []).filter(e => e.label.toLowerCase().includes(state.country.toLowerCase())) || []).map((val, index) => (
                                <Option key={index} value={val.label}>
                                    {val.label}
                                </Option>
                            ))
                        }
                    </AutoComplete>

                    <Row gutter={8}>
                        <Col lg={12} xs={24}>
                            {
                                (state.shipCountry === 'US' || state.shipCountry === 'CA') ? (
                                    <AutoComplete
                                        size="large"
                                        value={state.province}
                                        placeholder="State/Province"
                                        onChange={handleSelect('province')}
                                    >
                                        {
                                            provinceList[state.shipCountry].map((value, index) =>
                                                <Option key={index} value={value}>
                                                    {value}
                                                </Option>
                                            )
                                        }
                                    </AutoComplete>
                                ) : (
                                    <Input
                                        size="large"
                                        value={state.province}
                                        placeholder="State/Province"
                                        onChange={handleChange('province')}
                                    />
                                )
                            }
                        </Col>
                        <Col lg={12} xs={24}>
                            <Input
                                size="large"
                                value={state.zipcode}
                                placeholder="Zip code"
                                onChange={handleChange('zipcode')}
                                onInput={handleChange('zipcode')}
                            />
                        </Col>
                    </Row>
                </Panel>

            </Collapse>

            <div className="btn-group step2">
                <Button size="large" className="prev-button" onClick={movePrevStep}>
                    BACK
                </Button>

                <Button size="large" className="next-button" htmlType="submit">
                    NEXT
                </Button>
            </div>

            <div className="step-bottom-part step2">
                <div className="lock-icon-div">
                    <box-icon type='solid' name='lock-alt' className="lock-icon"></box-icon>
                </div>
                <div className="desc">
                    Your information is securely stored. See our {' '}
                    <a>privacy policy</a>
                </div>
            </div>
        </Form>
    )
}

export default OStep2