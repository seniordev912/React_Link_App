
import React, { useState } from 'react'

import { 
    AudioMutedOutlined, 
    AudioOutlined, 
    CloseOutlined
} from '@ant-design/icons'
import { Modal } from 'antd'
import ReactPlayer from 'react-player'

import './index.scss'

const ModalVideo = (props) => {
    const [audioMute, setAudioMute] = useState(false)

    const handleMuteAudio = () => {
        setAudioMute(!audioMute)
    }

    return(
        <Modal className="video-player-modal" visible={props.isOpen} onCancel={props.onClose} footer={null}>
            <div className="video-player-container">
                <div className="button-group">
                    <div>
                        <CloseOutlined className="modal-close-btn" onClick={props.onClose} />
                        {
                            audioMute ? 
                                <AudioMutedOutlined className="modal-mute-btn" onClick={handleMuteAudio} /> : 
                                <AudioOutlined className="modal-mute-btn" onClick={handleMuteAudio} />
                        }
                    </div>
                </div>
                <ReactPlayer className="video-player" url={props.url} playing={true} muted={audioMute} loop={true} />
            </div>
        </Modal>
    )
}

export default ModalVideo