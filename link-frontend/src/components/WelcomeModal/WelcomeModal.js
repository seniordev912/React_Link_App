import React from 'react'
import { Modal, Button } from 'antd'
import WelcomeImg from '../../assets/images/rocket.png'
import './index.scss'

const Companies = (props) => {
    return (
        <Modal
				className="welcome-modal"
				title="Welcome to LikUp"
                visible={props.visibleModal}
                footer={null}
                onCancel={props.closeModal}
			>
            <div className="modal-content">
                <div className="rocket-image">
                    <img src={WelcomeImg} />
                </div>
                <div className="desc common-text-size">
                    We're glad you're with us. It's time to create your profile, add links to your creator content, and share them with the world! 
                </div>
                <div className="start-btn">
                    <Button onClick={props.closeModal} type="primary">Get Started</Button>
                </div>
                
            </div>
            
        </Modal>
    )
}

export default Companies