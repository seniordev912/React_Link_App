import React from 'react'
import { 
    Button,
} from 'antd'
import AuthNavigation from '../../../components/AuthNavigation'
import '../index.scss'
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'
import { Link } from 'react-router-dom'
import { Layout, Menu } from 'antd';

const { Header, Content, Sider } = Layout;

iziToast.settings({
	position: 'bottomLeft',
	maxWidth: '400px'
})

const SettingsLayout = props => {
  const { children, selectedIndex } = props;

  const displayPaymentOrder = () => {
   props.history.push('/order-tap-product')
}

  return (
   <main className="container-fluid">
    <div className="background-header">
        <div className="container-header">
            <AuthNavigation user={props.user} pathKey={"billing"}/>
            <div className="header-part">
                <h2 className="title">
                    Your account settings
                </h2>
                <h4 className="desc">
                    Manage your order history, credits, and profile settings from one single place.
                </h4>
            </div>
        </div>                
    </div>
    <Layout>
        <Header className="header">
            <div className="logo" />
            <Menu mode="horizontal" defaultSelectedKeys={[selectedIndex]}>
                <Menu.Item className="nav-item" key="1">
                    <Link to={"/settings/billing"}>
                        Billing
                    </Link>
                </Menu.Item>
                <Menu.Item className="nav-item" key="2">
                    <Link to={"/settings/referrals"}>
                        Referrals
                    </Link>
                </Menu.Item>
                {/* <Menu.Item className="nav-item" key="3">
                    <Link to={"/settings/plan"}>
                        Plan
                    </Link>
                </Menu.Item> */}
            </Menu>
        </Header>
        <Layout className="main-layout">
            <Sider width={200} className="site-layout-background sidebar">
                <div className="order-button-container">
                    <Button className="order-button" onClick={displayPaymentOrder}>
                        Order
                    </Button>
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={[selectedIndex]}
                    defaultOpenKeys={['sub1']}
                    className={"side-menu"}
                >
                    <Menu.Item className="menu-item" key="1">
                        <Link to={"/settings/billing"}>
                            Billing
                        </Link>
                    </Menu.Item>
                    <Menu.Item className="menu-item" key="2">
                        <Link to={"/settings/referrals"}>
                            Referrals
                        </Link>
                    </Menu.Item>
                    {/* <Menu.Item className="menu-item" key="3">
                        <Link to={"/settings/plan"}>
                            Plan
                        </Link>
                    </Menu.Item> */}
                </Menu>
            </Sider>
            <Layout className={"site-layout-content-container"}>
                <Content className="site-layout-content">
                    <div>{children}</div>
                </Content>
            </Layout>
        </Layout>
    </Layout>
   </main>
  );
};

export default SettingsLayout;
