import React, { useState } from 'react'
import { 
    CaretRightOutlined, 
    AudioMutedOutlined, 
    AudioOutlined, 
    PauseOutlined 
} from '@ant-design/icons'
import ReactPlayer from 'react-player'

import './index.scss'

const VideoCard = (props) => {
    const { imageURL, videoURL, width, height, handlePlayClick } = props
    const [ isHovered, setIsHovered ] = useState(false);
    const [ isPlay, setIsPlay ] = useState(true);

    const handleMouseEnter = () => {
        setIsHovered(true);
    }

    const handleMouseLeave = () => {
        setIsHovered(false);
    }

    const handlePlayVideo = () => {
        setIsPlay(!isPlay);
    }

    const handleMuteAudio = () => {
        props.setAudioMute(!props.audioMute)
    }

    return (
        <div 
            className={"video-card"}
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()}
            style={{paddingTop: `${height / width * 100}%`}}
            // `${window.location.host}/${props.user.username}`
        >
            <div className={"video-card-container"}>
                {/* <div className={"item-img-part"} style={{display: isHovered ? "none" : "block"}}>
                    <img alt="" className="item-thumbnail" src={imageURL}/>
                    <div className="item-play-btn" onClick={(event) => handlePlayClick(event, videoURL)}></div>
                </div> */}
                <div className={"item-video-part"}>
                    <ReactPlayer  
                        className="item-video"
                        url={ videoURL }
                        type="video/mp4"
                        playing={isPlay && isHovered ? true : false}
                        onClick={(event) => handlePlayClick(event, videoURL)}
                        muted={props.audioMute} /> 
                    {/* <div className="item-play-btn" onClick={(event) => handlePlayClick(event, videoURL)}></div> */}

                    {
                        isHovered && (isPlay ? 
                            <PauseOutlined className="item-play-btn" onClick={handlePlayVideo} /> : 
                            <CaretRightOutlined className="item-play-btn" onClick={handlePlayVideo} />)
                    }
                    
                    {
                        isHovered && (props.audioMute ? 
                            <AudioMutedOutlined className="item-mute-btn" onClick={handleMuteAudio} /> : 
                            <AudioOutlined className="item-mute-btn" onClick={handleMuteAudio} />)
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default VideoCard