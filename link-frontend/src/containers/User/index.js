import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { Row, Col, Typography, Result, Switch } from 'antd'
import { useMediaQuery } from '@material-ui/core'
import MetaTags from 'react-meta-tags'
import Loading from '../../components/Loading'
import Social from '../../components/Social'
import useStyles from './styles'
import './index.scss'
import Avatar from '../../components/Avatar'
import Button from '../../components/Button'
import ReadOnly from './components/ReadOnly'
import Footer from './components/Footer'
import { SignButton } from '../../components/Sign/SignButton'

const { Title } = Typography

const localAnimation = localStorage.getItem('animation')

const User = () => {
	const { username } = useParams()
	const { dispatch, user, authUser, gettingUser } = useStoreon(
		'user',
		'authUser',
		'gettingUser'
	)
	const [card, setCard] = useState(null)
	const [socialArray, setSocialArray] = useState([]);
	const [enteredTime, setEnteredTime] = useState(new Date().toISOString())
	const [animation, setAnimation] = useState(
		localAnimation ? localAnimation === 'true' : true
	)
	const classes = useStyles()
	const match = useMediaQuery('(max-width: 1350px)')
	const { data } = user
	useEffect(() => {
		dispatch('users/getUser', username)
		if (localAnimation) {
			if (localAnimation !== 'false' && localAnimation !== 'true') {
				localStorage.removeItem('animation')
				setAnimation(true)
			}
		}
		setEnteredTime(new Date().toISOString())
		return () => {
			document.body.style.backgroundColor = '#fafafa'
		}
	}, [dispatch, username])
	useEffect(() => {
		if (!user.loading) {
			if (user.data) {
				if (user.data.card) {
					document.body.style.backgroundColor = user.data.card.bgColor
					setCard(user.data.card)
					var tempSocialArray = [];
					const cardSocials = user.data.card.socials;
					setSocialArray(cardSocials);
					if (!gettingUser && (!authUser || authUser.id !== user.data.id)) {
						dispatch('users/cardView', { enteredTime })
					}
				}
			}
		}
	}, [user.loading, gettingUser, user.data, authUser, dispatch, enteredTime])

	const changeAnimation = value => {
		setAnimation(value)
		localStorage.setItem('animation', value)
	}

	const getTitleText = blocks => {
		let text = ''
		if(blocks && blocks.length > 0) {
			text = blocks[0].data.text
		}
		return text
	}

	const getBlocksText = blocks => {
		let text = ''
		if (blocks && blocks.length > 1) {
			for (let i = 1; i < blocks.length; i++) {
				text += `${blocks[i].data.text} `
			}
		}
		if(text.length > 100) {
			text = text.substr(0, 100) + "..."
		}
		return text
	}

	return (
		// make the width  of the card 100 or equal to vw. Set bg color...
		<>
			{!user.loading && data && card !== null ? (
				<div className={classes.root}>
					<MetaTags>
						<meta name="title" content={getTitleText(card.text.blocks)} />
						<meta name="description" content={getBlocksText(card.text.blocks)} />
						<meta name="image" content={card.imageUrl && card.imageUrl[0]} />

						<meta property="og:title" content={getTitleText(card.text.blocks)} />
						<meta property="og:description" content={getBlocksText(card.text.blocks)} />
						<meta property="og:image" content={card.imageUrl && card.imageUrl[0]} />

						<meta itemProp="title" content={getTitleText(card.text.blocks)} />
						<meta itemProp="description" content={getBlocksText(card.text.blocks)} />
						<meta itemProp="image" content={card.imageUrl && card.imageUrl[0]} />

						<meta name="twitter:title" content={getTitleText(card.text.blocks)} />
						<meta name="twitter:description" content={getBlocksText(card.text.blocks)} />
						<meta name="twitter:image" content={card.imageUrl && card.imageUrl[0]} />

						<meta property="fb:title" content={getTitleText(card.text.blocks)} />
						<meta property="fb:description" content={getBlocksText(card.text.blocks)} />
						<meta property="fb:image" content={card.imageUrl && card.imageUrl[0]} />
					</MetaTags>

					{card.imageUrl.length !== 0 && (
						<Row justify="center">
							<Col>
								{/* Add Avatar effect here */}
								<Avatar
									imagesUrl={card.imageUrl}
									className="image-avatar"
									style={
										card.isRectangle !== undefined && card.isRectangle
											? { borderRadius: '8px' }
											: { borderRadius: '50%' }
									}
								/>
								{/* <Avatar
									className={classes.profileImage}
									src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
									alt={`${data.firstName} ${user.data.lastName}`}
								/> */}
							</Col>
						</Row>
					)}

					<Row justify="center" className="mt">
						{/* <Col> */}
						{card.usernameVisible ? (
							<Title className="username" style={{ color: card.text.color }}>
								{username}
							</Title>
						) : (
							<></>
						)}

						{/* </Col> */}
					</Row>
					{/* <Row
						justify={match ? 'center' : 'left'}
						className="mt--2 user-row-title"
					>
						<Col>
							<Title
								level={2}
								style={{
									fontSize: card.titleFontSize,
									color: card.titleColor
								}}
							>
								replace this with title
								{card.title}
							</Title>
						</Col>
					</Row> */}
					<Row justify={match ? 'center' : 'left'} className="user-row-title">
						<Col>
							<Title
								level={3}
								className="font--bio"
								// style={{ color: card.descColor }}
							>
								{/* replace this with text */}
								{/* {card.desc} */}
							</Title>
						</Col>
					</Row>

					<div className="editor-content" style={{ color: card.text.color }}>
						<ReadOnly data={card.text} color={card.text.color} />
					</div>

					<Row justify="center" align="center" className="mt--2">
						<Col
							justify="center"
							span={24}
							style={{ display: 'flex', flexDirection: 'column' }}
						>
							{/* add buttons */}
							{card.buttons.length !== 0 ? (
								card.buttons.map(value => (
									<Button
										enteredTime={enteredTime}
										isAnimation={animation}
										value={value}
										key={value.id}
									/>
								))
							) : (
								<Title className="no-card-button" level={3}>
									{/* This card doesn't have any button */}
								</Title>
							)}
						</Col>
					</Row>
					{socialArray.length !== 0 && (
						<Row className="user-row-title" style={{ marginBottom: 40 }} justify="center">
							<Col
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								{/* display social icons that are 'active' or user has a link added to them only */}
								{socialArray.map(social => (
									<Social key={social.id} social={social} enteredTime={enteredTime} />
								))}
							</Col>
						</Row>
					)}
					<Footer bgColor={card.bgColor}/>
				</div>

			) : user.error ? (
				<div
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)'
					}}
				>
				<Result status="error" title={user.error}> 
				<Link to={`/signup?username=${username}`} className = "ant-result-title">
							<SignButton size="large" htmlType="submit">
								Claim {username} as my username
							</SignButton>
						</Link>
				</Result>	

				</div>
			) : user.loading ? (
				<Loading />
			) : (
				!user.loading &&
				!user.data &&
				!user.error && (
					<div
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)'
						}}
					>
						<Result
							status="error"
							title={
								<>
									An internal error has occurred.
									<br />
									Please try again after a few minutes
								</>
							}
						/>
					</div>
				)
			)}
		</>
	)
}

export default User
