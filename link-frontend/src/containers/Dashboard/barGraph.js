import React from 'react'
import {
	ComposedChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer
} from 'recharts'

// const data = [
// 	{ date: '06/01/2020', uniqueViews: 20, totalViews: 35, ctr: 50 },
// 	{ date: '06/02/2020', uniqueViews: 10, totalViews: 15, ctr: 30 },
// 	{ date: '06/03/2020', uniqueViews: 35, totalViews: 60, ctr: 20 },
// 	{ date: '06/04/2020', uniqueViews: 5, totalViews: 30, ctr: 60 },
// 	{ date: '06/05/2020', uniqueViews: 15, totalViews: 40, ctr: 35 },
// 	{ date: '06/06/2020', uniqueViews: 12, totalViews: 34, ctr: 60 }
// ]

const BarGraph = ({ data }) => {
	return (
		<ResponsiveContainer width="100%" height={360}>
			<ComposedChart
				// width={600}
				// height={400}
				data={data}
				// margin={{ top: 20, right: 80, bottom: 20, left: 20 }}
				margin={{
					top: 10,
					right: 15,
					left: 15,
					bottom: 15
				}}
			>
				<XAxis
					dataKey="date"
					label={{ value: 'Dates', position: 'insideBottomLeft', offset: -10 }}
				/>
				<YAxis
					label={{
						value: 'Views',
						angle: 0,
						position: 'insideLeft',
						offset: -10
					}}
				/>
				{/* <Tooltip
					separator=": "
					content={props => {
						return (
							<div
								className="recharts-default-tooltip"
								style={{
									margin: 0,
									padding: 10,
									backgroundColor: 'white',
									border: '1px solid rgb(204, 204, 204)',
									whiteSpace: 'nowrap'
								}}
							>
								<p className="recharts-tooltip-label" style={{ margin: 0 }}>
									{props.label}
								</p>
								{props.payload.length > 0 && (
									<ul
										className="recharts-tooltip-item-list"
										style={{ padding: 0, margin: 0 }}
									>
										{props.payload.map(value => {
											return (
												<li
													className="recharts-tooltip-item"
													key={value.dataKey}
													style={{
														display: 'block',
														paddingTop: 4,
														paddingBottom: 4,
														color: value.fill
													}}
												>
													<span className="recharts-tooltip-item-name">{value.name}</span>
													<span className="recharts-tooltip-item-separator">: </span>
													<span className="recharts-tooltip-item-value">{value.value}</span>
													<span className="recharts-tooltip-item-unit" />
												</li>
											)
										})}
										<li
											className="recharts-tooltip-item"
											style={{
												display: 'block',
												paddingTop: 4,
												paddingBottom: 4
											}}
										>
											<span className="recharts-tooltip-item-name">CTR</span>
											<span className="recharts-tooltip-item-separator">: </span>
											<span className="recharts-tooltip-item-value">
												{props.payload[0].payload.ctr}
											</span>
											<span className="recharts-tooltip-item-unit">%</span>
										</li>
									</ul>
								)}
							</div>
						)
					}}
				/> */}
				<Legend />
				<CartesianGrid stroke="#f5f5f5" />
				<Bar name="Unique Views" dataKey="uniqueViews" barSize={20} fill="#ff0000" />
				<Bar name="Total Views" dataKey="totalViews" barSize={20} fill="#413ea0" />
			</ComposedChart>
		</ResponsiveContainer>
	)
}

export default BarGraph
