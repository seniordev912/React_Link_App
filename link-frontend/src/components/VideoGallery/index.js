import React, { Component } from 'react'
import ModalVideo from 'react-modal-video'
import './index.scss'

class VideoGallery extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isPlayingVideo: false,
            isOpenVideoModal: false,
            isHovered: {},
        }
    }

    componentDidMount(){
        const {videos} = this.props
        if(videos?.length > 0) {
            this.setState({
                isHovered: {
                    0: true
                }
            })
        }
    }

    playFullVideo = data => {
        this.setState({
            isOpenVideoModal: true,
            videoPath: data
        })
    }

    mouseEnterEvent = index => {

        this.setState({
            isHovered: {[index]: true}
        })
    }

    closePlayModal = () => {
        this.setState({
            isOpenVideoModal: false
        })
    }

    convertUrl = path => {
        let newUrl = path
        if(path.indexOf("youtube") > 0) {
            newUrl += '?autoplay=1&mute=1&rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0'
        } else if(path.indexOf("vimeo") > 0) {
            newUrl += '?autoplay=1&background=1'
        }
        return newUrl
    }

    makeVideoGallery = () => {
        const { videos } = this.props
        let row = [], rows = []
        let currentWidth = 0
        let maxHeight = 400
        let viewportWidth = window.innerWidth >= 1350 ? 1320 : (window.innerWidth - 30)
        videos.forEach(video => {
            row.push(video)
            currentWidth += Math.round((maxHeight / video.height) * video.width)
            if(currentWidth >= viewportWidth) {
                rows.push(row)
                row = []
                currentWidth = 0
            }
        })
        row.length && rows.push(row)
        // console.log('------============>>>>>>>>>>', rows, window.innerWidth, viewportWidth)
        return rows
    }

    render(){
        const { videos } = this.props
        const { videoPath, isOpenVideoModal, isHovered } = this.state

        let video_list = this.makeVideoGallery()
        return(
            <>
                {/* <Row gutter={[4, 4]}>
                    {videos.map((item, index) => (
                        <Col 
                            span={6} 
                            key={index} 
                            className="item-column"
                            className={`item-column ${isHovered[index] ? `self-play` : ``}`}
                            onMouseEnter={() => this.mouseEnterEvent(index)}>

                            <div className="item-img-part">
                                <img src={item.src} className="item-thumbnail" />
                                <div className="item-play-btn" onClick={() => this.playFullVideo(item.data)}></div>
                            </div>

                            <div className="item-video-part">
                                {
                                    item.data.indexOf("youtube") > 0 || item.data.indexOf("vimeo") > 0 ? (
                                        <iframe 
                                            className="item-video"
                                            src={isHovered[index] ? this.convertUrl(item.data) : ""} 
                                            frameBorder="0" 
                                            allow={isHovered[index] ? "autoplay;fullscreen;" : ""} 
                                            allowFullScreen="allowfullscreen"
                                            mozallowfullscreen="true"
                                            msallowfullscreen="true"
                                            oallowfullscreen="true"
                                            webkitallowfullscreen="true" />
                                    ) : (
                                        <video 
                                            className="item-video" 
                                            src={isHovered[index] ? item.data : ""}
                                            type="video/mp4"
                                            autoPlay
                                            muted > 
                                        </video>
                                    )
                                }
                                <div className="item-play-btn" onClick={() => this.playFullVideo(item.data)}></div>
                            </div>

                        </Col>
                        )
                    )}
                </Row> */}

                {
                    video_list && video_list.map((row, rIndex) => (
                        <div className="video-gallery-list" key={rIndex}>
                            {row.map((item, cIndex) => (
                                <div 
                                    key={rIndex + '_' + cIndex} 
                                    className="item-column"
                                    className={`item-column ${isHovered[rIndex + '_' + cIndex] ? `self-play` : ``}`}
                                    onMouseEnter={() => this.mouseEnterEvent(rIndex + '_' + cIndex)}
                                    style={{width: item.width, height: item.height}}>

                                    <div className="item-img-part">
                                        <img src={item.src} className="item-thumbnail" />
                                        <div className="item-play-btn" onClick={() => this.playFullVideo(item.data)}></div>
                                    </div>

                                    <div className="item-video-part">
                                        {
                                            item.data.indexOf("youtube") > 0 || item.data.indexOf("vimeo") > 0 ? (
                                                <iframe 
                                                    className="item-video"
                                                    src={isHovered[rIndex + '_' + cIndex] ? this.convertUrl(item.data) : ""} 
                                                    frameBorder="0" 
                                                    allow={isHovered[rIndex + '_' + cIndex] ? "autoplay;fullscreen;" : ""} 
                                                    allowFullScreen="allowfullscreen"
                                                    mozallowfullscreen="true"
                                                    msallowfullscreen="true"
                                                    oallowfullscreen="true"
                                                    webkitallowfullscreen="true" />
                                            ) : (
                                                <video 
                                                    className="item-video" 
                                                    src={isHovered[rIndex + '_' + cIndex] ? item.data : ""}
                                                    type="video/mp4"
                                                    autoPlay
                                                    muted > 
                                                </video>
                                            )
                                        }
                                        <div className="item-play-btn" onClick={() => this.playFullVideo(item.data)}></div>
                                    </div>

                                </div>
                                )
                            )}
                        </div>
                    ))
                }

                {isOpenVideoModal && (
                    <ModalVideo
                        isOpen={isOpenVideoModal}
                        channel="custom"
                        url={videoPath}
                        onClose={this.closePlayModal}
                    />
                )}
            </>
        )
    }
}

export default VideoGallery