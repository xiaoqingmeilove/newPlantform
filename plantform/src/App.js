import React, { Component } from 'react';
import { Layout, Menu, Icon, Avatar, Dropdown } from 'antd';
import { Route, Switch } from 'react-router-dom';

import SynchronousEntry from './pages/synchronousEntry';
import dataOverview from './pages/dataOverview';
import CityManagement from './pages/cityManagement';
import AccountManagement from './pages/accountManagement';

import './App.css'


const {
  Header, Content, Footer, Sider,
} = Layout;

class App extends Component {
  render() {
    if (!window.localStorage.getItem('Authorization')) {
      this.props.history.push('/login')
    }
    let pathname = window.location.hash.split('#')[1]
    const menu = (
      <Menu onClick={(e) => { this.props.history.push('/login') }}>
        <Menu.Item key="logout">
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout style={{ height: "1000px" }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => { console.log(broken); }}
          onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[pathname]} onClick={(e) => { window.location.hash = `#${e.key}` }}>
            <Menu.Item key="/accountManagement">
              <Icon type="user" />
              <span className="nav-text">账号管理</span>
            </Menu.Item>
            <Menu.Item key="/cityManagement">
              <Icon type="user" />
              <span className="nav-text">城市管理</span>
            </Menu.Item>
            <Menu.Item key="/dataOverview">
              <Icon type="video-camera" />
              <span className="nav-text">电梯数据</span>
            </Menu.Item>
            <Menu.Item key="/synchronousEntry">
              <Icon type="upload" />
              <span className="nav-text">电梯同步</span>
            </Menu.Item>
            <Menu.Item key="/alarm">
              <Icon type="user" />
              <span className="nav-text">电梯故障概览</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} >
            <div className="Avatar">
              <Dropdown overlay={menu}>
                <Avatar style={{ backgroundColor: '#87d068' }} icon="user" />
              </Dropdown>
              <span>&nbsp;&nbsp;欢迎您 {(window.localStorage.getItem('username')?window.localStorage.getItem('username'):"").replace(/^\"|\"$/g,"")}</span>
            </div>
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Switch>
                <Route path='/cityManagement' component={CityManagement} />
                <Route path='/SynchronousEntry' component={SynchronousEntry} />
                <Route path='/dataOverview' component={dataOverview} />
                <Route path='/accountManagement' component={AccountManagement} />
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            kone Info ©2019 Created by XU ZHUOQING
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
