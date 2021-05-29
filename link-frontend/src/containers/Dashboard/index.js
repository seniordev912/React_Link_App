import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
	Row,
	Col,
	Typography,
	Card,
	Layout,
	Statistic,
	Tooltip,
	Modal,
	message,
	Table,
	Popover,
	Menu
} from 'antd'
import {
	ArrowUpOutlined,
	QuestionCircleTwoTone,
	ArrowDownOutlined,
	EllipsisOutlined
} from '@ant-design/icons'
import moment from 'moment'
// import MetaTags from 'react-meta-tags'
import { Helmet } from 'react-helmet'
import { useSpring, animated } from 'react-spring'
import { useStoreon } from 'storeon/react'
import AuthNavigation from '../../components/AuthNavigation'
import EmptyComponent from './empty'
import GraphComponent from './graph'
import Footer from '../../components/Footer'
import Loading from '../../components/Loading'
import './index.css'
import { removePropsNew } from '../../utils'
import axios from '../../constants/axios'
import SocialMetaImg from '../../assets/images/meta-social.png'
// import BarGraph from './barGraph'

const { Content } = Layout
const { Title, Text } = Typography

const AnimatedStatistic = animated(Statistic)

const start = moment().weekday(-7).format('MM/DD/YYYY')
const end = moment().weekday(-1).format('MM/DD/YYYY')
const thisStartWeek = moment().weekday(0).format('MM/DD/YYYY')
const thisEndWeek = moment().format('MM/DD/YYYY')
const thisLastMonthDay = moment().endOf('month').format('LL')
// const start = moment()
// 	.day(moment().weekday() - 7)
// 	.format('MM/DD/YYYY')
// const end = moment().format('MM/DD/YYYY')

const getIncrease = dashboard => {
	if (dashboard) {
		const { lastUniqueViews, currentUniqueViews } = dashboard
		if (lastUniqueViews) {
			const ret = (currentUniqueViews / lastUniqueViews - 1) * 100
			// return 300
			return !isNaN(ret) || isFinite(ret) ? ret : 0
		}
	}
	return 0
}

const Dashboard = ({ user, history }) => {
	const [state, setState] = useState({
		visible: false,
		discountRate: 0
	})
	const { dispatch } = useStoreon()
	// const [increaseBase, setIncreaseBase] = useState(0)
	const increaseBase = useMemo(() => getIncrease(user.dashboard), [user.dashboard])

	useEffect(() => {
		axios.get('user/getDiscountRate').then(res => {
			setState({
				...state,
				discountRate: res.data.value
			})
		})
	}, [])

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

	const { increase, currentUniqueViews } = useSpring({
		increase: increaseBase,
		currentUniqueViews: removePropsNew(user.dashboard)
			? user.dashboard.currentUniqueViews
			: 0,
		from: {
			increase: 0,
			currentUniqueViews: 0
		}
	})
	const showModal = e => {
		e.preventDefault()
		setState({
			visible: true
		})
	}

	const handleOk = e => {
		setState({
			visible: false
		})
	}

	const handleCancel = e => {
		setState({
			visible: false
		})
	}

	useEffect(() => {
		dispatch('session/getClicks')
	}, [dispatch])

	const copyLink = () => {
		document.execCommand('copy')
		message.success('Code copied to clipboard')
	}

	message.config({
		top: 30,
		duration: 1,
		maxCount: 1,
		rtl: true
	})

	const getEarningAmount = () => {
		let amount = 0
		user.monthData && user.monthData.forEach(val => {
			amount += Object.values(val)[0] * 4
		})
		return amount
	}

	return (
		<main className="container">

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

			<AuthNavigation user={user} />
			<Content>
				<div ></div>
				<Row>
					<Col>
						<Title className="title-font" level={3}>
							Hey {user.firstName ? `${user.firstName}` : 'there'}, you reached{' '}
							<span className="counter">
								<animated.strong>
									{currentUniqueViews.interpolate(x => x.toFixed(0))}
								</animated.strong>
							</span>{' '}
							unique views this week!
							<Tooltip
								title={
									<small>
										Week over week change from{' '}
										<span style={{ textDecoration: 'underline' }}>{thisStartWeek}</span> to{' '}
										<span style={{ textDecoration: 'underline' }}>{thisEndWeek}</span>
									</small>
								}
								mouseEnterDelay={0}
								trigger="hover"
							>
								<QuestionCircleTwoTone
									style={{
										fontSize: '15px',
										position: 'absolute',
										bottom: '49px',
										right: '-22px'
									}}
									className="outline--none"
								/>
							</Tooltip>
						</Title>

						<Text>
							Engage your audience with your best content!{' '}
							<Link to="/create">Edit your card</Link>
						</Text>
					</Col>
				</Row>
				<Row gutter={[32, 32]} className="top-space">
					<Col xs={24} sm={24} md={12} span={12} className="sm-top">
						<Card style={{ height: '250px' }}>
							<div className="title-part">
								<Text className="ant-statistic-title">Unique Views</Text>
								{/* <Popover
									placement="bottomRight"
									trigger={['click']}
									content={(
										<div>
											<Menu>
												<Menu.Item>
													Export CSV
												</Menu.Item>
												<Menu.Item>
													Open in Google Sheets
												</Menu.Item>
											</Menu>
										</div>
									)}
								>
									<EllipsisOutlined />
								</Popover> */}
							</div>
							
							<AnimatedStatistic
								style={{ marginTop: '25px' }}
								value={increase.interpolate(x => x.toFixed(0))}
								precision={0}
								valueStyle={{ color: increaseBase < 0 ? '#cf1322' : '#3f8600' }}
								prefix={increaseBase >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} // add logic to switch between ArrowUp and ArrowDown depending on weekly % change
								suffix="%"
							/>
							<Text
								style={{
									color: 'rgba(0, 0, 0, 0.45)'
								}}
							>
								<small>
									Week over week change from {thisStartWeek} and {thisEndWeek}{' '}
									{removePropsNew(user.dashboard) &&
										`(${user.dashboard.currentUniqueViews} Unique Views)`}
								</small>
								<br />
								<small>
									to {start} and {end}{' '}
									{removePropsNew(user.dashboard) &&
										`(${user.dashboard.lastUniqueViews} Unique Views)`}
								</small>
							</Text>
						</Card>
					</Col>
				</Row>
				{/* {<BarGraph />} */}
				<DrawGraph user={user} dashboard={user.dashboard} />
				<Footer />
			</Content>
			<Modal
				className="pay-share-modal"
				title="It pays to share!"
				visible={state.visible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Table
					className="pay-share-table"
					columns={[
						{
							title: 'First name',
							dataIndex: 'firstName'
						},
						{
							title: 'Last name',
							dataIndex: 'lastName'
						},
						{
							title: 'Email',
							dataIndex: 'email'
						},
						{
							title: 'Date',
							dataIndex: 'paymentDate'
						},
						{
							title: 'Amount',
							dataIndex: 'paymentAmount',
							sorter: (a, b) => a.paymentAmount - b.paymentAmount,
						}
					]}
					dataSource={user.usedByOthers}
					size="middle"
				/>

				<div className="pay-share-month-earn">
					{/* {
						user.monthData && user.monthData.map((val, index) => {
							return (
								<div>{Object.keys(val)[0] + ' $' + (Object.values(val)[0] * 4)}</div>
							)
						})
					} */}
					{
						getEarningAmount() < 20 ? (
							<>
								You only earned ${ getEarningAmount() } so far. A minimum of $20 earned is required to receive funds.
							</>
						) : (
							<>
								Your next payment of ${ getEarningAmount() } will be sent on { thisLastMonthDay }. All payments will be made through PayPal. 
								Contact <a href="mailto://hello@linkupcard.com">hello@linkupcard.com</a> for any questions or concerns.
							</>
						)
					}
					
				</div>
			</Modal>
		</main>
	)
}

function DrawGraph({ user, dashboard }) {
	if (!user.card) {
		return <EmptyComponent />
	}
	if (!dashboard) {
		return <Loading />
	}
	if (!removePropsNew(dashboard)) {
		return <EmptyComponent isClicks />
	}
	// return <Loading />
	return <GraphComponent user={user} dashboard={dashboard} />
}

export default Dashboard
