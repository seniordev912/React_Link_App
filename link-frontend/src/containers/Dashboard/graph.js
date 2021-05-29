import React, { useState, useMemo } from 'react'
import { Row, Col, Card, Typography, Table, Menu, Popover } from 'antd'
import {
	EllipsisOutlined
} from '@ant-design/icons'
import { PieChart, Pie, ResponsiveContainer } from 'recharts'
import HeatMap from 'react-light-heatmap'
import { useMediaQuery } from '@material-ui/core'
import Papa from 'papaparse'
import './index.css'
import { CSVExporter } from '../../helpers/dataHelper'
import ActiveShape from './pieData'
import BarGraph from './barGraph'
import { sourceDisplayName } from '../../utils'

const { Text } = Typography

const columns = [
	{
		title: 'Name',
		dataIndex: 'name',
		sorter: (a, b) => {
			const x = a.name.toLowerCase()
			const y = b.name.toLowerCase()
			if (x < y) return -1
			if (x > y) return 1
			return 0
		},
		render: value => {
			return <>{sourceDisplayName(value)}</>
		},
		sortDirections: ['descend', 'ascend'],
		defaultSortOrder: 'descend'
	},
	{
		title: 'Clicks',
		dataIndex: 'clicks',
		sorter: (a, b) => a.clicks - b.clicks,
		sortDirections: ['descend', 'ascend'],
		defaultSortOrder: 'descend'
	}
]

const xLabels = new Array(24).fill(0).map((_, i) => i)

// day of the week
const yLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const GraphComponent = ({ dashboard }) => {
	const matches = useMediaQuery('(min-width: 960px)')
	const [state, setState] = useState({
		activeSourceIndex: 0,
		activeLocationIndex: 0,
		heatData: dashboard.heatData
	})

	const [ cardType, setCardType ] = useState(null)

	const _data = []
	for (let i=0;i<dashboard.buttons.length; i++) {
		dashboard.buttons[i].key = i
		_data.push(dashboard.buttons[i])
	}
	const getHeatWay = () => {
		if (matches) {
			return { xLabels, heatData: state.heatData }
		}
		return {
			xLabels: xLabels.filter(i => i % 2 === 0),
			heatData: state.heatData.map(v => v.filter((_, index) => index % 2 === 0))
		}
	}
	const calcedHeat = useMemo(() => getHeatWay(), [getHeatWay])
	const onPieEnter = which => (_data, index) => {
		setState({ ...state, [which]: index })
	}

	const handleExportFile = (name) => {
		if(name === 'csv') {
			if(cardType === 'socials' || cardType === 'buttons') {
				dashboard[cardType].map(e => {
					delete e.id 
				})
			}
			console.log(dashboard[cardType])
			
			convertCSV(dashboard[cardType])
		}
	}

	const convertCSV = data => {
		const csvResult = Papa.unparse(data)
		CSVExporter(csvResult, cardType, true)
	}

	const exportComponent = () => {
		return (
			<Menu className="export-menu">
				<Menu.Item onClick={() => handleExportFile('csv')}>
					Export CSV
				</Menu.Item>
				<Menu.Item onClick={() => handleExportFile('gsheet')}>
					Open in Google Sheets
				</Menu.Item>
			</Menu>
		)
	}

	return (
		<div>
			{dashboard.graph.length > 0 && (
				<Row gutter={[48, 32]}>
					<Col xs={24} span={24} className="sm-top">
						<Card className="card-border" style={{ height: '450px' }}>
							<Row style={{ marginBottom: '30px' }}>
								<Col className="graph-show-title">
									<Text className="ant-statistic-title">Unique Views</Text>
									<Popover
										placement="bottomRight"
										trigger={['click']}
										content={exportComponent}
									>
										<EllipsisOutlined onClick={() => setCardType('graph')} />
									</Popover>
								</Col>
							</Row>
							<BarGraph data={dashboard.graph} />
						</Card>
					</Col>
				</Row>
			)}
			{calcedHeat.heatData.length > 0 && (
				<Row gutter={[48, 32]}>
					<Col xs={24} span={24} className="sm-top">
						<Card>
							<div style={{ marginBottom: '30px' }}>
								<div className="graph-show-title">
									<Text className="ant-statistic-title">Heatmap Activity</Text>
									<Popover
										placement="bottomRight"
										trigger={['click']}
										content={exportComponent}
									>
										<EllipsisOutlined onClick={() => setCardType('heatData')} />
									</Popover>
								</div>
							</div>
							<HeatMap
								xLabels={calcedHeat.xLabels}
								yLabels={yLabels}
								data={calcedHeat.heatData}
								height={20}
								cellStyle={(background, value, min, max) => ({
									background: `rgba(58, 163, 174, ${1 - (max - value) / (max - min)})`,
									fontSize: '10px'
								})}
								cellRender={value => value && `${value}%`}
							/>
						</Card>
					</Col>
				</Row>
			)}
			{dashboard.buttons.length > 0 && (
				<Row gutter={[48, 32]}>
					<Col xs={24} span={24} className="sm-top">
						<Card>
							<Row
								style={{
									marginBottom: 30
								}}
							>
								<Col className="graph-show-title">
									<Text className="ant-statistic-title">Buttons</Text>
									<Popover
										placement="bottomRight"
										trigger={['click']}
										content={exportComponent}
									>
										<EllipsisOutlined onClick={() => setCardType('buttons')} />
									</Popover>
								</Col>
							</Row>

							<Table
								columns={columns}
								dataSource={_data}
								style={{
									marginTop: 15
								}}
							/>
						</Card>
					</Col>
				</Row>
			)}
			{dashboard.socials.length > 0 && (
				<Row gutter={[48, 32]}>
					<Col xs={24} span={24} className="sm-top">
						<Card>
							<Row
								style={{
									marginBottom: 30
								}}
							>
								<Col className="graph-show-title">
									<Text className="ant-statistic-title">Socials</Text>
									<Popover
										placement="bottomRight"
										trigger={['click']}
										content={exportComponent}
									>
										<EllipsisOutlined onClick={() => setCardType('socials')} />
									</Popover>
								</Col>
							</Row>

							<Table
								columns={columns}
								dataSource={dashboard.socials}
								style={{
									marginTop: 15
								}}
							/>
						</Card>
					</Col>
				</Row>
			)}
			{dashboard.source.length > 0 && (
				<Row gutter={[48, 32]}>
					<Col xs={24} span={24} className="sm-top">
						<Card>
							<div style={{ marginBottom: 30 }}>
								<div className="graph-show-title">
									<Text className="ant-statistic-title">Source</Text>
									<Popover
										placement="bottomRight"
										trigger={['click']}
										content={exportComponent}
									>
										<EllipsisOutlined onClick={() => setCardType('source')} />
									</Popover>
								</div>
							</div>
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										activeIndex={state.activeSourceIndex}
										activeShape={props => <ActiveShape {...props} />}
										data={dashboard.source}
										innerRadius={60}
										outerRadius={80}
										fill="#3aa3ae"
										dataKey="value"
										onMouseEnter={onPieEnter('activeSourceIndex')}
									/>
								</PieChart>
							</ResponsiveContainer>
						</Card>
					</Col>
				</Row>
			)}
			{dashboard.location.length > 0 && (
				<Row gutter={[48, 32]}>
					<Col xs={24} span={24} className="sm-top">
						<Card>
							<div style={{ marginBottom: '30px' }}>
								<div className="graph-show-title">
									<Text className="ant-statistic-title">Location</Text>
									<Popover
										placement="bottomRight"
										trigger={['click']}
										content={exportComponent}
									>
										<EllipsisOutlined onClick={() => setCardType('location')} />
									</Popover>
								</div>
							</div>
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										activeIndex={state.activeLocationIndex}
										activeShape={props => <ActiveShape {...props} />}
										data={dashboard.location}
										innerRadius={60}
										outerRadius={80}
										fill="#3aa3ae"
										dataKey="value"
										onMouseEnter={onPieEnter('activeLocationIndex')}
									/>
								</PieChart>
							</ResponsiveContainer>
						</Card>
					</Col>
				</Row>
			)}
		</div>
	)
}

export default GraphComponent
