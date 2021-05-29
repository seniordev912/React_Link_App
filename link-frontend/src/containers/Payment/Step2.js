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
import { Breadcumb } from './Component'
import countryList from 'react-select-country-list'
import axios from '../../constants/axios'
import 'boxicons'
import {provinceList} from './provinceList'

const { Option } = AutoComplete
const { Panel } = Collapse

const Step2 = ({ selectUserDetails, movePrevStep, setStepsInfo, stepInfo, showToast }) => {

    const [state, setState] = useState({
        street_num: '',
        unit_num: '',
        city: '',
        province: '',
        zipcode: '',
        country: '',
        shipCountry: '',
        product: {},
        username: '',
		lastname: '',
        firstname: '',
        password: '',
		email: '',
        country_option: countryList().getData()
    })

    const [userNameMsg, setUserNameMsg] = useState({
        successUNameMsg: false,
        errorUNameMsg: false
    })

    const [emailMsg, setEmailMsg] = useState({
        successEmailMsg: false,
        errorEmailMsg: false
    })

    useEffect(() => {
        if(stepInfo) {
            setState({
                ...state,
                firstname: stepInfo.firstname,
                lastname: stepInfo.lastname,
                username: stepInfo.username,
                email: stepInfo.email,
                password: stepInfo.password,
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
        const { street_num, province, city, zipcode, shipCountry, country, username, firstname, lastname, email, password, unit_num } = state
        let input_data = {
            billingInfos: {
                username,
                firstname,
                lastname,
                email,
                password,
                street_num,
                city,
                province,
                zipcode: zipcode.toUpperCase(),
                country: shipCountry,

            },
            step: 1
        }

        setStepsInfo({
            username,
            lastname,
            firstname,
            email,
            password,
            street_num,
            unit_num,
            city,
            province,
            zipcode,
            shipCountry,
            country
        })
        
        try{
            const emailCount = await axios.get(`user/auth/checkUniqueEmail/${email}`)
            const uNameCount = await axios.get(`user/auth/checkUniqueUserName/${username}`)
            if(!userNameMsg.errorUNameMsg && !emailMsg.errorEmailMsg 
                && (uNameCount.data && uNameCount.data.value === 0 && emailCount.data && emailCount.data.value === 0)) {
                const result = await axios.post('user/auth/confirmsignup1', input_data)
                if(result.data.success) {
                    let bInfos = input_data.billingInfos
                    bInfos['unit_num'] = unit_num
                    selectUserDetails(bInfos)
                } else {
                    showToast('error', result.data.message)
                }
            } else {
                checkUniqueEmail(email)
                checkUniqueUserName(username)
                showToast('error', 'Please fix the above validation errors')
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
                username: state.username,
                firstname: state.firstname,
                lastname: state.lastname,
                email: state.email,
                password: state.password,
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

        if(key === 'email') {
            const emailVal = event.target.value
            checkUniqueEmail(emailVal)
		}

		if(key === 'username') {
            const userName = event.target.value        
            checkUniqueUserName(userName)
		}
    }

    const checkUniqueUserName = async userName => {
        setUserNameMsg({
            errorUNameMsg: false,
            successUNameMsg: false
        })
        try{
            const uNameCount = await axios.get(`user/auth/checkUniqueUserName/${userName}`)
            if(uNameCount) {
                if(uNameCount.data && uNameCount.data.value === 0) {
                    setUserNameMsg({
                        successUNameMsg: false,
                        errorUNameMsg: false
                    })
                } else {
                    setUserNameMsg({
                        successUNameMsg: false,
                        errorUNameMsg: true
                    })
                }
            }
        }catch(err){
            setUserNameMsg({
                successUNameMsg: false,
                errorUNameMsg: false
            })
        }
    }

    const checkUniqueEmail = async emailVal => {
        setEmailMsg({
            errorEmailMsg: false,
            successEmailMsg: false
        })
        try{
            const emailCount = await axios.get(`user/auth/checkUniqueEmail/${emailVal}`)
            if(emailCount) {
                if(emailCount.data && emailCount.data.value === 0) {
                    setEmailMsg({
                        successEmailMsg: false,
                        errorEmailMsg: false
                    })
                } else {
                    setEmailMsg({
                        successEmailMsg: false,
                        errorEmailMsg: true
                    })
                }
            }
        }catch(err){
            setEmailMsg({
                successEmailMsg: false,
                errorEmailMsg: false
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
                    firstname: state.firstname,
                    lastname: state.lastname,
                    username: state.username,
                    email: state.email,
                    password: state.password,
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
                firstname: state.firstname,
                lastname: state.lastname,
                username: state.username,
                email: state.email,
                password: state.password,
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

            <Breadcumb currentStep={1} />

            <div className="step-top-part">
                <h2>Create your free profile.</h2>
                <div className="common-subtitle-size">
                    Every tap product comes with a free profile where you can create and store all of your links in one place.
                </div>
            </div>

            <Collapse className="collapse-container"
                defaultActiveKey={['1', '2']}
                expandIconPosition="right"
                expandIcon={({isActive}) => <CaretRightOutlined rotate={isActive ? 90 : 0}/>} 
                >
                    
                <Panel header="Account Details" key="1" className="profile-details-container">
                    <Row gutter={8}>
                        <Col lg={12} xs={24}>
                            <Input
                                size="large"
                                className="card-name-part"
                                placeholder="First Name"
                                value={state.firstname}
                                defaultValue={state.firstname}
                                onChange={handleChange('firstname')}
                                onInput={handleChange('firstname')}
                            />
                        </Col>
                        <Col lg={12} xs={24}>
                            <Input
                                size="large"
                                className="card-name-part"
                                placeholder="Last Name"
                                value={state.lastname}
                                defaultValue={state.lastname}
                                onChange={handleChange('lastname')}
                                onInput={handleChange('lastname')}
                            />
                        </Col>
                    </Row>

                    <Input
                        size="large"
                        className="card-name-part"
                        placeholder="Username"
                        value={state.username}
                        defaultValue={state.username}
                        onChange={handleChange('username')}
                        onInput={handleChange('username')}
                    />
                    <div className="result-msg-part" style={ userNameMsg.errorUNameMsg || userNameMsg.successUNameMsg ? {display: 'block'} : {display: 'none'} }>
                        {userNameMsg.errorUNameMsg && (
                            <div className="error-msg">
                                Someone else is using this ...
                            </div>
                        )}
                    </div>
                    <div className="card-info-comment">
                        Your public profile will be  
                        {` ${window.location.protocol}//${window.location.host}/${state.username}`}
                    </div>

                    <Input
                        size="large"
                        className="card-name-part"
                        placeholder="Email"
                        value={state.email}
                        defaultValue={state.email}
                        onChange={handleChange('email')}
                        onInput={handleChange('email')}
                        type="email"
                    />
                    <div className="result-msg-part" style={ emailMsg.errorEmailMsg || emailMsg.successEmailMsg ? {display: 'block'} : {display: 'none'} }>
                        {emailMsg.errorEmailMsg && (
                            <div className="error-msg">
                                Someone else is using this ...
                            </div>
                        )}
                    </div>

                    <Input.Password
                        size="large"
                        className="card-password-part"
                        placeholder="Create a Password"
                        value={state.password}
                        defaultValue={state.password}
                        onChange={handleChange('password')}
                        onInput={handleChange('password')}
                    />

                </Panel>
            
                <Panel header="Shipping Address" key="2" className="shipping-address-container">
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
                        onInput={handleChange('unit_num')}
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
                                            ((provinceList[state.shipCountry] || []).filter(e => e.toLowerCase().includes(state.province.toLowerCase())) || []).map((value, index) =>
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

export default Step2