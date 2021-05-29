import React, {useState} from 'react'
import { Collapse, Row, Col } from 'antd'
import { Typography } from '@material-ui/core'
import FaqData from './data'
import './index.scss'

const { Panel } = Collapse

function callback(key) {
	console.log(key)
}

class Faq extends React.Component {
	state = {
		expandIconPosition: 'right'
	}

	onPositionChange = expandIconPosition => {
		this.setState({ expandIconPosition })
	}

	render() {
		const { expandIconPosition } = this.state
		return (
			<div className="faq--container">
				<Row>
					<Col xs={{ span: 20}} md={{ span: 12}}>
					 	<div className={"page-subtitle-size"} style={{marginBottom: '30px'}}>
							Questions?
						</div>
					</Col>
				</Row>
				<div className={"collapse-wrapper"}>
					<ul className={"accordion-list"}>
						{
							FaqData.map((data) => (
								<li className="accordion-list__item" key={data.id}>
									<CollapseItem {...data}/>
								</li>
							))
						}
					</ul>
				</div>
			</div>
		)
	}
}

const CollapseItem = (props) => {
    const { answer, question } = props;
    const [opened, setOpened] = useState(false);
    const handleClickItem = () => {
        setOpened(!opened);
    }

    return (
        <div className={`accordion-item, ${opened && 'accordion-item--opened'}`} 
        >
            <a>
                <div className={'accordion-item__line'} onClick={handleClickItem}>
                    <h5 className={'accordion-item__title'}>
                        {question}
                    </h5>
                    <span className={'accordion-item__icon'}/>
                </div>
            </a>
            <div className={'accordion-item__inner'}>
                <div className={'accordion-item__content'}>
                    <p className={'accordion-item__paragraph'}>
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Faq
