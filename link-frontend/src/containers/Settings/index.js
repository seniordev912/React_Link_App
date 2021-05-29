import React from 'react'
import { 
    Row,
    Col
} from 'antd'
import AuthNavigation from '../../components/AuthNavigation'
import Footer from '../../components/Footer'
import './index.scss'
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'

iziToast.settings({
	position: 'bottomLeft',
	maxWidth: '400px'
})


function Settings(props, user) {

	return (
		<main className="container-fluid">
			<AuthNavigation user={props.user} />
            <div className="header-part">
                <div className="title">
                    Your account settings
                </div>
                <div className="desc">
                    Manage your subscription, billing, and payment settings from one place
                </div>
            </div>
            <Row>
                <Col ></Col>
            </Row>
			<Footer />
		</main>
	)
}

export default Settings
