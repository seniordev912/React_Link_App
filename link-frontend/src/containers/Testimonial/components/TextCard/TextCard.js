import React from 'react'
import { Row, Col, Avatar } from 'antd'

import WhiteQuoteBeak from '../../../../assets/icons/blockquote-beak.svg'
import GreyQuoteBeak from '../../../../assets/icons/blockquote-beak-grey.svg'

import './index.scss'

const TextCard = (props) => {
    const { text, image, name, avatar, isGrey } = props
    return (
        <div>
            <div className={"textcard"} style={{background: isGrey ? "#f3f4f4" : "white"}}>
                <div>
                    {
                        image &&
                        <img className={"textcard-image"} src={image} alt="card-image"/>
                    }
                    <div className={"textcard-text"}>
                        <h5 className={isGrey? "quote-text-grey" : "quote-text"}>“</h5>
                        {
                            isGrey ?
                            <h5>
                                {text}
                            </h5> :
                            <h5>
                                {text}                            
                            </h5>
                        }   
                    </div>
                </div>
                <img src={isGrey ?  GreyQuoteBeak : WhiteQuoteBeak} className="quote-beak" alt="QuoteBeak" />
            </div>
            <div className={"user"}>
                {
                    avatar &&
                    <Avatar className={"user-avatar"} size={64} src={avatar} />
                }
                <a href={`/${name}`} target="_blank">
                    <div className={"Body-1"}>{name}</div>
                </a>
            </div>
        </div>
    )
}

export default TextCard