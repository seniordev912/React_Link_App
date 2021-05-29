import React, { useEffect, useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
// import ModalVideo from 'react-modal-video'
import { Button, Row, Col, Card, Avatar, Timeline, Input } from 'antd'
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Typography } from '@material-ui/core'
import { Carousel } from 'react-responsive-carousel'
import { Helmet } from 'react-helmet'
import { Parallax } from 'react-scroll-parallax'
import { LazyLoadImage, trackWindowScroll } from 'react-lazy-load-image-component'
import Aos from 'aos'
import axios from '../../constants/axios'
import Navigation from '../../components/Navigation'
import FooterApp from '../../components/FooterApp'
import linkup_card from './images/group-7.png'
import workspace from './images/workspace-007.png'
// import receiver_icon from './images/group-6.svg'
import Faq from '../../components/Faq'
import influencers from './data'

import SocialMetaImg from '../../assets/images/meta-social.png'

import PBackImage1 from '../../assets/images/back-item-0.png'
import PBackImage2 from '../../assets/images/back-item-1.png'
import PBackImage3 from '../../assets/images/back-item-2.png'
import PBackImage4 from '../../assets/images/back-item-3.png'
import PVideo from './images/linkup-gif.mp4'

import { Companies } from '../../components'
import { CreateAccountCard } from '../../components'

import './index.scss'
import '../../../node_modules/react-modal-video/scss/modal-video.scss'
import 'react-lazy-load-image-component/src/effects/blur.css'
import "react-responsive-carousel/lib/styles/carousel.min.css" // requires a loader
import "aos/dist/aos.css"

const HomePage = (props) => {
	const { scrollPosition, history } = props
	const [textIdx, setTextIdx] = useState(0)
	const [currentSlide, setCurrentSlide] = useState(0)
	const [carouselDivided, setCarouseDivided] = useState(100);
	const [isCheckingUserName, setIsCheckingUserName] = useState(false);
	const [checkUserName, setCheckUserName] = useState("");
	const [checkUserNameResult, setCheckUserNameResult] = useState("");
	const [imageStatus, setImageStatus] = useState("loading")
	const [firstScrolling, setFirstScrolling] = useState(false)
	const [scrTop, setScrTop] = useState(0)

	useEffect(() => {
		const newScript = document.createElement('script')
		newScript.type = 'text/javascript'
		newScript.async = true
		newScript.innerHTML =
			'!function(d,s,c){s=d.createElement(\'script\');s.src=\'https://widget.indemand.ly/launcher.js\';s.onload=function(){indemandly=new Indemandly({domain:\'david-phan\'})};c=d.getElementsByTagName(\'script\')[0];c.parentNode.insertBefore(s,c)}(document)'
		document.head.appendChild(newScript)

		const newScript2 = document.createElement('script')
		newScript2.type = 'text/javascript'
		newScript2.async = true
		newScript2.src = 'https://widget.manychat.com/103338161339453.js'
		document.head.appendChild(newScript2)

		const elmnt = document.getElementById("homepage");
		const number = Math.floor( elmnt.clientWidth);
		if(number > 1350) {
			setCarouseDivided(25);
		} else if(number > 1200) {
			setCarouseDivided(30);
		} else if (number > 992) {
			setCarouseDivided(35);
		} else if (number > 768) {
			setCarouseDivided(40);
		} else if (number > 576) {
			setCarouseDivided(60);
		} else if (number > 480) {
			setCarouseDivided(70);
		} else if (number <= 480) {
			setCarouseDivided(100);
		}
		window.addEventListener("resize", displayWindowSize)
		window.addEventListener("scroll", getScrollTop)

		setFirstScrolling(true)

		// document.getElementsByClassName('slider animated')[0].style.webkitTransform = 'translate3d(' + getPos(document.getElementById('testimonial-text')).x + 'px, 0px, 0px)'
		// document.getElementsByClassName('slider animated')[0].style.MozTransform = 'translate3d(' + getPos(document.getElementById('testimonial-text')).x + 'px, 0px, 0px)'
		// document.getElementsByClassName('slider animated')[0].style.msTransform = 'translate3d(' + getPos(document.getElementById('testimonial-text')).x + 'px, 0px, 0px)'
		// document.getElementsByClassName('slider animated')[0].style.OTransform = 'translate3d(' + getPos(document.getElementById('testimonial-text')).x + 'px, 0px, 0px)'
		// document.getElementsByClassName('slider animated')[0].style.transform = 'translate3d(' + getPos(document.getElementById('testimonial-text')).x + 'px, 0px, 0px)'
		
		const container = document.getElementById("cardi");
		container.addEventListener('wheel', e => {
			e.preventDefault();
			e.deltaY > 0 ? handleCarouselNext() : handleCarouselPrev()
			const containerScrollPosition = container.scrollLeft;
			container.scrollTo({
				top: 0,
				left: containerScrollPosition + e.deltaY,
				behaviour: "smooth"
			});
		})
		

		document.getElementsByClassName("slider animated")[0].setAttribute('style', 'transform: none;');

	}, [])

	useEffect(() => {
		if(imageStatus === 'loaded' || imageStatus === 'failed') {
			Aos.init({
				// delay: 50,
				duration: 1000,
				once: true
			})
		}
	}, [imageStatus])

	const handleImageLoaded = () => {
		console.log("----------->>>>>")
		setImageStatus('loaded')
	}

	const handleImageError = () => {
		setImageStatus('failed')
	}

	const getPos = (el) => {
		for (var lx = 0, ly = 0;
			el != null;
			lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
	   return { x : lx, y : ly };
	}

	function displayWindowSize () {
		// Get width and height of the window excluding scrollbars
		const elmnt = document.getElementById("homepage");
		if(elmnt) {
			const number = Math.floor( elmnt.clientWidth);
			if(number > 1350) {
				setCarouseDivided(25);
			} else if(number > 1200) {
				setCarouseDivided(30);
			} else if(number > 992) {
				setCarouseDivided(35);
			} else if(number > 768) {
				setCarouseDivided(40);
			} else if (number > 576) {
				setCarouseDivided(60);
			} else if (number > 480) {
				setCarouseDivided(70);
			} else if (number <= 480) {
				setCarouseDivided(100);
			}
		}
	}

	function getScrollTop() {
		const top = window.pageYOffset || document.documentElement.scrollTop
		console.log('top==========:', top)
		setScrTop(top)
	}

	const pushSignup = () => {
		history.push('order-tap-product-no-auth')
	}

	const onChangeCheckUser = (event) => {
		if(!event.target.value) {
			setCheckUserNameResult("")
		}
		setCheckUserName(event.target.value);
	}

	const handleCheckUserName = () => {
		setIsCheckingUserName(true);
		axios.get(`users/${checkUserName}/checkusername`).then(res => {
			if(res.data.result) {
				setCheckUserNameResult(res.data.message)
				setIsCheckingUserName(false);
			} else {
				setCheckUserNameResult(res.data.message)
				setIsCheckingUserName(false);
				localStorage.setItem("username", checkUserName);
				history.push('/signup');
			}
			
		})
	}

	const handleCarouselPrev = () => {
		setCurrentSlide(currentSlide => currentSlide - 1)
	}

	const handleCarouselNext = () => {
		setCurrentSlide(currentSlide => currentSlide + 1)
	}

	const updateCurrentSlide = (index) => {
		if (currentSlide !== index) {
			setCurrentSlide(index);
		}
	}

	const handlePIScroll = e => {
		e.preventDefault();
		console.log(containerScrollPosition, e.deltaX, e.deltaY)
		
		const container = document.getElementById("cardi");
		const containerScrollPosition = document.getElementById("cardi").scrollLeft;
		if(firstScrolling) {
			setFirstScrolling(false)
		}
		
		// if(e.deltaY > 0) {
		// 	handleCarouselNext()
		// } else {
		// 	handleCarouselPrev()
		// }

		container.scrollTo({
		  top: 0,
		  left: containerScrollPosition + e.deltaY,
		  behaviour: "smooth"
		});

		return false;
	}
	
	return (
		<div id="homepage" className="main">
			<Helmet>
				<meta name="title" content="LinkUp - All your links in one place" />
				<meta name="description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
				<meta name="image" content={SocialMetaImg} />
		
				<meta property="og:title" content="LinkUp - All your links in one place" />
				<meta property="og:description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
				<meta property="og:image" content={SocialMetaImg} />

				<meta itemProp="title" content="LinkUp - All your links in one place" />
				<meta itemProp="description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
				<meta itemProp="image" content={SocialMetaImg} />

				<meta name="twitter:title" content="LinkUp - All your links in one place" />
				<meta name="twitter:description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
				<meta name="twitter:image" content={SocialMetaImg} />

				<meta property="fb:title" content="LinkUp - All your links in one place" />
				<meta property="fb:description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
				<meta property="fb:image" content={SocialMetaImg} />
			</Helmet>

			<Row className="top-banner">
				<Col className="top-banner-part">
					<div className="banner-badge">NEW</div>
					<a className="banner-text" href="https://www.notion.so/Affiliate-Partners-56ef1b326c184b68b64276ee658556de" target="_blank" rel="noopener noreferrer">
						Creator? Get sponsored today!
						<span role="img" aria-label="" aria-labelledby=""> ✨</span>
					</a>
				</Col>
			</Row>
			<Navigation />
			<div className="container">
				<Row>
					<Col xs={24} sm={24} md={24} span={12} className="hero--component">
						<div className="title page-title-size">
						<h1>All your links in one place</h1>
						</div>
						<div className="page-subtitle-size">
							Sharing made easy with one link or tap
						</div>
						<div className="sign--up--container">
							<Button onClick={pushSignup} className="sign--up">
								Get started
							</Button>
							<div className="common-text-size under-txt">
								Have an account?{' '}
								<span className="underline">
									<Link to="/signin">Login</Link>
								</span>
							</div>
						</div>
					</Col>
					<Col xs={24} sm={24} md={24} span={24} className="phone-image-part">
						<div className="imgContainer">
							{/* <img 
								src={linkup_card} 
								className="img" 
								alt="linkup" 
								onLoad={handleImageLoaded}
								onError={handleImageError}
							/> */}

							<video 
								autoPlay
								loop
								onLoadedData={handleImageLoaded}
								onError={handleImageError}>
								<source 
									src={PVideo} 
									type="video/mp4" />
							</video>
						</div>

						<div className="background-part">
							{/* <div className="top-part">
								<Parallax className="card-img" y={[40, 80]} x={[0, 80]}>
									<img src={PBackImage1} />
								</Parallax>
								<Parallax className="mark-img1" y={[20, 150]} x={[0, -250]}>
									<img src={PBackImage2} />
								</Parallax>
							</div>
							<div className="bottom-part">
								<Parallax className="mark-img2" y={[-10, -100]} x={[20, 100]}>
									<img src={PBackImage3} />
								</Parallax>
								<Parallax className="mark-img1" y={[-20, -150]} x={[-20, -270]}>
									<img src={PBackImage4} />
								</Parallax>
							</div> */}
							<div className="img-group">
								<div className="left-part" id="left-part">
									<div className="top-left-part">
										<img className="top-left-img" id="top-left-img" src={PBackImage1} style={{top: `${scrTop/3}px`, left: `${scrTop/2}px`, transform: `rotate(${scrTop/20 - 20}deg)`}} />
									</div>
									<div className="bottom-left-part">
										<img className="bottom-left-img" id="bottom-left-img" src={PBackImage3} style={{bottom: `${scrTop/3}px`, left: `${scrTop/2}px`, transform: `rotate(${-scrTop/20 + 20}deg)`}} />
									</div>
								</div>
								<div className="right-part" id="right-part">
									<div className="top-right-part">
										<img className="top-right-img" id="top-right-img" src={PBackImage2} style={{top: `${scrTop/3}px`, right: `${scrTop/2}px`, transform: `rotate(${-scrTop/20 + 20}deg)`}} />
									</div>
									<div className="bottom-right-part">
										<img className="bottom-right-img" id="bottom-right-img" src={PBackImage4} style={{bottom: `${scrTop/3}px`, right: `${scrTop/2}px`, transform: `rotate(${scrTop/20 - 20}deg)`}} />
									</div>
								</div>
							</div>
						</div>
					</Col>
				</Row>
				<Row className={"check-username"}>
					<Col data-aos="zoom-in-up" className={"check-username-container"} xs={24} sm={24} md={12} span={12}>
						<div style={{textAlign:'center'}}>
							<h5>Check username availability</h5>
						</div>
						<div>
							<div className={"check-username-input-container"}>
								<div className={"check-username-text"}>
									linkupcard.com/
								</div>
								<Input className={"check-username-input"} placeholder="yourusername" onChange={onChangeCheckUser}/>
								<Button onClick={handleCheckUserName} disabled={checkUserName === "" ? true : false} className="check-username-button" loading={isCheckingUserName}>
									<ArrowRightOutlined />
								</Button>
							</div>
						</div>
						<div className={"check-username-result"}>
							{checkUserNameResult}
						</div>
					</Col>
				</Row>
				<Row>
					<Companies/>
				</Row>
				<Row className={"advantage"}>
					<Row className={"advantage-title"}>
						<div className={"page-subtitle-size"}>
							Why LinkUp?
						</div>
					</Row>
					<Row className={"advantage-content"}>
						<Col className={"advantage-item"} xs={24} sm={24} md={6} span={6}>
							{/* <img src={receiver_icon} className="receiver-icon" alt="linkup" /> */}
							<h5>
								Easy to manage
							</h5>
							<div className={"common-text-size"}>
								Use our simple drag-and-drop editor to LinkUp all your important content in seconds. No hosting, domain or coding required.
							</div>
						</Col>
						<Col className={"advantage-item"} xs={24} sm={24} md={6} span={6}>
							{/* <img src={receiver_icon} className="receiver-icon" alt="linkup" /> */}
							<h5>
								Grow your business
							</h5>
							<div className={"common-text-size"}>
								All the tools you need to grow and monetize your business - Collect contacts, accept payments, Real time anaytics, and unlimited app integrations.
							</div>
						</Col>
						<Col className={"advantage-item"} xs={24} sm={24} md={6} span={6}>
							{/* <img src={receiver_icon} className="receiver-icon" alt="linkup" /> */}
							<h5>
								Use it anywhere
							</h5>
							<div className={"common-text-size"}>
								Share your LinkUp wherever your audience is. Online with a link or offline with a tap product to help them to discover all your latest content.
							</div>
						</Col>
					</Row>
				</Row>
			</div>
			<Row className={"tap-product"}>
				<div className={"page-subtitle-size"}>
					Choose from a collection of tap products that will make your brand stand out
				</div>
				<img src={workspace} className="img-left" alt="linkup" />
			</Row>
			<div className="container">
				<Row className="testimonials">
					<Col>
						<div className={"page-subtitle-size"}>
							Join thousands of creators and business owners who use LinkUp to grow their brand
						</div>
						<Link to={"/testimonials"} target="_blank">
							<h4 id="testimonial-text" className={"testimonial-text"}>
								See customer testimonials
								<ArrowRightOutlined />
							</h4>
						</Link>
					</Col>
				</Row>
			</div>
			<div className="cardi" id="cardi">
				<Carousel 
					infiniteLoop
					centerMode
					centerSlidePercentage={carouselDivided}
					selectedItem={currentSlide}
					onChange={updateCurrentSlide}
					showThumbs={false}
				>
				{/* <HorizontalScroll> */}
					{influencers.map((influencer, index) => (
						<Link
							className="card--body"
							to={influencer.link}
							key={index}
							rel="noopener noreferrer"
							target="_blank"
						>
							<div className="card--body-part">
								<LazyLoadImage
									alt={influencer.name}
									effect="blur"
									src={influencer.image}
									scrollPosition={scrollPosition}
									className="card--image"
								/>
								<div className="card--content">
									<Row gutter={[12, 0]}>
										<Col>
											<Avatar
												style={{
													color: influencer.avatar_color,
													backgroundColor: influencer.avatar_bg,
													top: '5px'
												}}
											>
												{influencer.avatar}
											</Avatar>
										</Col>
										<Col>
											<Typography variant="subtitle1">{influencer.name}</Typography>
											<Typography variant="body2" className="follower-desc" gutterBottom>
												{influencer.followers}
											</Typography>
										</Col>
									</Row>
								</div>
							</div>
							
						</Link>
					))}
				{/* </HorizontalScroll> */}
				</Carousel>
			</div>
			<div className="container">
				<Row className="testimonials-bottom">
					<div>
						<Button onClick={handleCarouselPrev} className="carousel-button">
							<ArrowLeftOutlined />
						</Button>
						<Button onClick={handleCarouselNext} className="carousel-button">
							<ArrowRightOutlined />
						</Button>
					</div>
				</Row>
				<Faq />
				<div className={"accountCardContainer"}>
					<CreateAccountCard/>	
				</div>
			</div>
			<FooterApp />
		</div>
	)
}

export default withRouter(trackWindowScroll(HomePage))
