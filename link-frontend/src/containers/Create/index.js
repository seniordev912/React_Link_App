import React, { useState, useRef, useEffect } from 'react'
import {
	Row,
	Col,
	Typography,
	Layout,
	Button,
	Input,
	Switch,
	message,
	Modal,
	Space
} from 'antd'
import {
	CopyOutlined,
	CheckOutlined,
	CloseOutlined
	// MobileOutlined,
	// LaptopOutlined,
	// DesktopOutlined
} from '@ant-design/icons'
import MetaTags from 'react-meta-tags'
import { useStoreon } from 'storeon/react'
import Drawer from './drawer'
import AuthNavigation from '../../components/AuthNavigation'
import Footer from '../../components/Footer'
import './index.scss'
import Loading from '../../components/Loading'
import SocialMetaImg from '../../assets/images/meta-social.png'

import ContentComponent from './content';

const { Content } = Layout
const { Text } = Typography

const Create = ({ user, color, history }) => {
	if (user && user.order) {
		history.push('/order-tap-product')
		user.order = false
	}
	const { dispatch, isLoading } = useStoreon('isLoading')
	const [state, setState] = useState({
		visible: false,
		open: false,
		drawerName: 'Unknown',
		drawerContent: <></>,
		color: '#E2E2E2',
		width: '300px',
		userNameVisible: false,
		isPublic: true
	})

	useEffect(() => {
		if (user.card === null) {
			dispatch('session/isLoading')
			dispatch('session/createCard')
		} else {
			dispatch('session/isLoading', false)
			dispatch('buttons/set', user.card.buttons)
		}
		// message.info(`This user comes from: ${document.referrer}`)
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		if (user.card !== null) {
			setState(prevState => ({
				...prevState,
				userNameVisible: user.card.usernameVisible,
				isPublic: user.card.isPublic
			}))
		}
	}, [user.card])

	useEffect(() => {
		const newScript = document.createElement('script')
		newScript.type = 'text/javascript'
		newScript.async = true
		newScript.innerHTML =
			'!function(d,s,c){s=d.createElement(\'script\');s.src=\'https://widget.indemand.ly/launcher.js\';s.onload=function(){indemandly=new Indemandly({domain:\'david-phan\'})};c=d.getElementsByTagName(\'script\')[0];c.parentNode.insertBefore(s,c)}(document)'
		document.head.appendChild(newScript)
		return () => {
			document.head.removeChild(newScript)
		}
	}, [])

	const linkRef = useRef(null)

	const onCloseDrawer = () => {
		setState({
			...state,
			open: false
		})
	}

	const showModal = () => {
		setState({
			...state,
			visible: true
		})
	}

	const hideModal = () => {
		setState({
			...state,
			visible: false
		})
	}

	const copyLink = () => {
		linkRef.current.select()
		document.execCommand('copy')
		message.success('Link copied to clipboard')
	}

	const switchPublic = isPublic => {
		dispatch('card/update', { isPublic })
		setState({
			...state,
			isPublic: isPublic
		})
	}

	const switchVisibleUName = () => {
		dispatch('card/update', { usernameVisible: !state.userNameVisible })
		setState({
			userNameVisible: !state.userNameVisible
		})
	}

	const handleImageShape = imageShape => {
		dispatch('card/update', { isRectangle: imageShape })
	}

	message.config({
		top: 30,
		duration: 1,
		maxCount: 1,
		rtl: true
	})

	return (
		<main className="container">

			<MetaTags>
				<meta name="title" content="LinkUp - All your links in one place" />
				<meta name="description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
				<meta name="image" content={SocialMetaImg} />

				<meta itemProp="title" content="LinkUp - All your links in one place" />
				<meta itemProp="description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
				<meta itemProp="image" content={SocialMetaImg} />

				<meta name="twitter:title" content="LinkUp - All your links in one place" />
				<meta name="twitter:description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
				<meta name="twitter:image" content={SocialMetaImg} />

				<meta property="fb:title" content="LinkUp - All your links in one place" />
				<meta property="fb:description" content="Everywhere you are online and offline can now be in one place. LinkUp lets you instantly share your social media, music, payment platforms and contact info with just one link or tap on anyone's phones with a single card." />
				<meta property="fb:image" content={SocialMetaImg} />
			</MetaTags>

			<AuthNavigation user={user} />
			{typeof isLoading === 'undefined' || isLoading || isLoading === null ? (
				<Loading />
			) : (
				<>
					<Content className="content">
						<Row justify="end">
							<Col xs={24} span={24} className="button-spacing">
								<Modal
									title="Share your card"
									visible={state.visible}
									onCancel={hideModal}
									footer={false}
								>
									<div className="modal--text">
										<p>
											Changes you make to your card are automatically saved. To share your
											card, share the link below with your audience.
										</p>
										<p>
											<strong>Make link public</strong>
										</p>
										<Switch
											style={{ marginBottom: '15px' }}
											className="switch"
											checked={state.isPublic}
											onChange={switchPublic}
											checkedChildren={<CheckOutlined />}
											unCheckedChildren={<CloseOutlined />}
											// toggle boolean DB field: save state to card DB. Public: True/False
										/>
										<Input
											addonAfter={<CopyOutlined onClick={() => copyLink()} />}
											onDoubleClick={() => copyLink()}
											ref={linkRef}
											readOnly
											defaultValue={`https://www.linkupcard.com/${user.username}`}
										/>
										<Text>
											<small>
												Copy and paste the link in another tab to see how it looks!
											</small>
										</Text>
									</div>
								</Modal>
								<Button onClick={showModal}>Share</Button>
							</Col>
						</Row>
						<Row className="top-space">
							<ContentComponent 
								user={user} 
								state={state} 
								handleImageShape={handleImageShape} 
								switchVisibleUName={switchVisibleUName}
							/>
						</Row>
						<Footer />
					</Content>
					<Drawer name={state.drawerName} visible={state.open} onClose={onCloseDrawer}>
						{state.drawerContent}
					</Drawer>
				</>
			)}
		</main>
	)
}

export default Create
