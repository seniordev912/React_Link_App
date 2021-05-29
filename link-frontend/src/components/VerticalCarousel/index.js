import React, { Component } from 'react'
import { Row, Col } from 'antd'
import LUCard from '../../containers/Card/LUCard'
import './index.scss'

class VerticalCarousel extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeID: 0,
			buttonHover: false,
			buttonStyle: {
				color: '#ffffff'
			}
		}
	}

	_changeActive(id) {
		this.setState({
			activeID: id
		})
	}

	render() {
		return (
			<Row>
				<Col xs={24} sm={24} md={12} lg={10} span={10} className="card-part-left">
					<Selectors
						data={this.props.data}
						activeID={this.state.activeID}
						_changeActive={this._changeActive.bind(this)}
					/>
					<div className="lucard-part">
						<div className="comment-part">
							<div className="lucard-new">NEW</div>
							<div className="lucard-comment">
								We created a physical card to make sharing your Linkup with your audience
								easier offline.
							</div>
						</div>

						<LUCard user={{ firstName: 'Bob', lastName: 'Marley', username: 'bob123' }} />
					</div>
				</Col>
				<Col xs={24} sm={24} md={12} lg={14} span={14} className="card-part-right">
					<div className="right-subpart">
						<div>
							<p className="right-subtitle">
								{this.props.data[this.state.activeID].header}
							</p>
							<p className="right-subtext">{this.props.data[this.state.activeID].body}</p>
						</div>
					</div>
				</Col>
			</Row>
		)
	}
}
class Selectors extends Component {
	_handleClick(e) {
		if (this.props.id !== this.props.activeID) {
			this.props._changeActive(this.props.id)
		} else {
		}
	}

	render() {
		return (
			<div className="selectors">
				{this.props.data.map(item => (
					<Selector
						key={item.id}
						id={item.id}
						_handleClick={this._handleClick}
						_changeActive={this.props._changeActive}
						activeID={this.props.activeID}
					/>
				))}
			</div>
		)
	}
}
class Selector extends Component {
	render() {
		let componentClass = 'selector'
		if (this.props.activeID === this.props.id) {
			componentClass = 'selector active'
		}
		return <div className={componentClass} onClick={this.props._handleClick.bind(this)} />
	}
}

export default VerticalCarousel
