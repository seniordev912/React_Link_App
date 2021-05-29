
import React, { useState } from 'react'

import TextCard from '../TextCard'
import VideoCard from '../VideoCard'
import Imonials from './mockdata'
// import ModalVideo from 'react-modal-video'
import ModalVideo from '../../../../components/ModalVideo'
import '../../../../../node_modules/react-modal-video/scss/modal-video.scss'

import './index.scss'

const CardGrid = (props) => {
	const [ isOpenVideoModal, setIsOpenVideoModal ] = useState(false);
	const [ videoPath, setVideoPath ] = useState("");
	const [ audioMute, setAudioMute ] = useState(false)
	const handlePlayClick = (event, path) => {
		setVideoPath(path);
		setIsOpenVideoModal(true);
	}
	const closePlayModal = () => {
		setIsOpenVideoModal(false);
    }
    return (
        <div className={"cardgrid"}>
            {Imonials.map((imonial, index) => (
				imonial.type === "text" ?
				<div key={index} className={"cardContainer"}>
					<TextCard
						text={imonial.text} 
						image={imonial.image} 
						avatar={imonial.avatar}
						name={imonial.name}
						isGrey={imonial.isGrey}
					/>
				</div> :
				<div key={index} className={"videoTesti"}>
					<VideoCard width={imonial.width} height={imonial.height} videoURL={imonial.data} imageURL={imonial.src} handlePlayClick = {handlePlayClick} audioMute={audioMute} setAudioMute={setAudioMute} />
				</div>
            ))}
			{isOpenVideoModal && (
				<ModalVideo
					isOpen={isOpenVideoModal}
					channel="custom"
					url={videoPath}
					onClose={closePlayModal}
				/>
			)}
		</div>
    )
}

export default CardGrid