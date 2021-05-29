
import {
  MoreOutlined,
} from '@ant-design/icons';

import './content.scss'

import React, { useState } from 'react'
import {
	Row,
	Col,
	Layout,
	Button,
    Space,
} from 'antd'

import ThemeBoard from './themeBoard';
import TextBoard from './textBoard';
import ImageBoard from './imageBoard';
import ButtonBoard from './buttonBoard'
import SocialBoard from './socialBoard'

import SocialComponent from './social/index'
import AvatarUpload from './avatar'
import ButtonComponent from './button'
import ColorPicker from './color.js'
import TextColorPicker from './textcolor.js'
import TitleComponent from './title'
import './index.scss'
import closeIcon from '../../assets/icons/circle-close.svg'
import SocialArray from './SocialArray'

const { Sider, Content } = Layout;

const ContentComponent = (props) => {
    const { user, 
            state, 
            handleImageShape, 
            switchVisibleUName
        } = props;
    const [showId, setShowId] = useState(1);
    const [collapsed, setCollapsed] = useState(true);

    const handleClickTheme = (event) => {
        setShowId(1);
        setCollapsed(false);
    }

    const handleClickAvatar = (event) => {
        event.stopPropagation();
        setShowId(3);
        setCollapsed(false);
    }

    const handleClickSocial = (event) => {
        event.stopPropagation();
        setShowId(5);
        setCollapsed(false);
    }

    const handleClickButton = (event) => {
        event.stopPropagation();
        setShowId(4);
        setCollapsed(false);
    }

    const handleClickUpdate = () => {
        setCollapsed(true);
    }

    const toggle = () => {
        setCollapsed(!collapsed);
    }
    
    return (
        <Layout>
            <Layout className="site-layout">
                <Button
                    className="sidebar-toggle"
                    type="primary"
                    icon={<MoreOutlined />}
                    onClick={toggle}
                />
                <Content
                className="site-layout-background"
                style={{
                    minHeight: 280,
                }}
                >
                    <Row className="main-section">
                        <Col xs={24}>
                            <div className="wrap-section">
                                <section
                                    className="main--card"
                                    style={{
                                        backgroundColor: user.card.bgColor
                                    }}
                                >
                                    <Row justify="end">
                                        <Space size="middle">
                                            <ColorPicker />
                                            <TextColorPicker />
                                        </Space>
                                    </Row>
                                    <div onClick={handleClickTheme}>
                                        <div>
                                            {user.card && (
                                                <>
                                                    <Row justify="center">
                                                        <AvatarUpload
                                                            cardId={user.card.id}
                                                            user={user}
                                                            changeImageUpdate={handleImageShape}
                                                            type="create"
                                                            handleClickTheme={handleClickAvatar}
                                                        />
                                                    </Row>
                                                    <Row className="create-row-title">
                                                    </Row>
                                                    <div
                                                        className="username-visibility"
                                                        style={{
                                                            color: user.card.text ? user.card.text.color : '#000'
                                                        }}
                                                    >
                                                        {!state.userNameVisible ? (
                                                            <div className="show-username-part">
                                                                <a onClick={switchVisibleUName}>add username</a>
                                                            </div>
                                                        ) : (
                                                            <div className="hide-username-part">
                                                                <div>@{user.username}</div>
                                                                <img
                                                                    onClick={switchVisibleUName}
                                                                    className="close-btn"
                                                                    src={closeIcon}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                            <div
                                                style={{
                                                    color: user.card.text ? user.card.text.color : '#000'
                                                }}
                                            >
                                                <TitleComponent user={user} />
                                            </div>
                                        </div>

                                        {user.card && user.card.buttons ? (
                                            <Row justify="center" className="top-space">
                                                <ButtonComponent user={user} handleClickButton={handleClickButton}/>
                                            </Row>
                                        ) : null}
                                        <Row justify="center" className="top-space">
                                            <SocialComponent handleClickSocial={handleClickSocial} card={user.card} socialArray={user.socialArray ? user.socialArray : SocialArray}/>
                                        </Row>
                                    </div>
                                </section>
                            </div>
                        </Col>
                    </Row>
                </Content>
            </Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={0} width={300}>
                <div className="sidebar-board">
                    {
                        showId === 1 &&
                        <ThemeBoard handleClickUpdate={handleClickUpdate} collapsed={collapsed}/>
                    }
                    {
                        showId === 2 &&
                        <TextBoard handleClickUpdate={handleClickUpdate} collapsed={collapsed}/>
                    }
                    {
                        showId === 3 &&
                        <ImageBoard handleClickUpdate={handleClickUpdate} collapsed={collapsed}/>
                    }
                    {
                        showId === 4 &&
                        <ButtonBoard handleClickUpdate={handleClickUpdate} collapsed={collapsed}/>
                    }
                    {
                        showId === 5 &&
                        <SocialBoard handleClickUpdate={handleClickUpdate} collapsed={collapsed}/>
                    }
                </div>
            </Sider>
        </Layout>
    );
}

export default ContentComponent;