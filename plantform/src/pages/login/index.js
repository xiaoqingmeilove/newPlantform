import React, { Component } from 'react';
import { Form, Input, Button, message, Row, Col, Icon } from 'antd';
import Logo from './kone.png';
import './index.css';
import axios from 'axios';
const FormItem = Form.Item;


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    // 页面初始化 获取city数据
    componentDidMount() {
        
    }

    //  提交表单数据
    handleSubmit(e) {
        var self = this
        this.props.form.validateFields((err, values) => {
            axios.post('/queryOneTable', {
                "condition": {
                    ...values
                },
                "collection": 'koneUser'
            })
                .then(function (response) {
                    if(response.data.result.length){
                        window.localStorage.setItem('Authorization',JSON.stringify(response.data.result[0].cityArr));
                        window.localStorage.setItem('username',JSON.stringify(response.data.result[0].username));
                        self.props.history.push('/')
                    }else{
                        message.error('用户名或密码错误')
                    }
                })
                .catch(function (error) {
                    message.error(error)
                });
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form horizontal onSubmit={this.handleSubmit} id="login">
                    <Row>
                        <Col span={6} offset={9}>
                            <img src={Logo} style={{ width: '20%', marginLeft: '40%', marginTop: 80 }} alt="logo" />
                            <div style={{ fontSize: 20, marginTop: 20, textAlign: 'center', fontWeight: 'bold' }}>通力电梯</div>
                            <div style={{ fontSize: 30, marginTop: 0, textAlign: 'center', fontWeight: 'bold' }}>信息接口平台</div>
                            <FormItem style={{ marginTop: 40 }}>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: 'Please input your username!' }],
                                })(
                                    <Input addonBefore={<Icon type="user" />} placeholder="Username" />
                                )}
                            </FormItem>
                            <FormItem style={{ marginTop: 10 }}>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Please input your Password!' }],
                                })(
                                    <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
                                )}
                            </FormItem>
                            <Button
                                type="primary"
                                size="large"
                                style={{ width: "100%", height: 30, float: "right", marginTop:10 }}
                                onClick={e => this.handleSubmit(e)}>
                                登录
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }


};
Login = Form.create()(Login);
export default Login;
