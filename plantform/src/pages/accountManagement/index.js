import React, { Component } from 'react';
import {
    Form, message, Button, Icon, Table, Row, Col, Modal, Input, Select
} from 'antd';
import axios from 'axios';
const Option = Select.Option;



class cityManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            visible: false,
            type: '',
            row: {},
            selectArr: []
        };
    }

    componentDidMount() {
        var self = this
        axios.post('/queryOneTable', {
            "condition": {

            },
            "collection": 'City'
        })
            .then(function (response) {
                self.setState({
                    selectArr: response.data.result
                })
            })
            .catch(function (error) {
                message.error(error)
            });

        axios.post('/queryOneTable', {
            "condition": {

            },
            "collection": 'koneUser'
        })
            .then(function (response) {
                console.log(response)
                self.setState({
                    dataSource: response.data.result
                })
            })
            .catch(function (error) {
                message.error(error)
            });
    }


    handleOk() {
        var self = this
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.type === 'add') {
                    axios.post('/insertOneTable', {
                        "condition": {
                            ...values
                        },
                        "collection": 'koneUser'
                    })
                        .then(function (response) {
                            message.success(response.data.result)
                            axios.post('/queryOneTable', {
                                "condition": {

                                },
                                "collection": 'koneUser'
                            })
                                .then(function (response1) {
                                    self.setState({
                                        dataSource: response1.data.result,
                                        visible: false
                                    })
                                })
                                .catch(function (error) {
                                    message.error(error)
                                });
                        })
                        .catch(function (error) {
                            message.error(error)
                        });
                }
                else if (this.state.type === 'edit') {
                    axios.post('/updateOneTable', {
                        "condition": {
                            ...values
                        },
                        "query": this.state.row,
                        "collection": 'koneUser'
                    })
                        .then(function (response) {
                            message.success(response.data.result)
                            axios.post('/queryOneTable', {
                                "condition": {

                                },
                                "collection": 'koneUser'
                            })
                                .then(function (response1) {
                                    self.setState({
                                        dataSource: response1.data.result,
                                        visible: false
                                    })
                                })
                                .catch(function (error) {
                                    message.error(error)
                                });
                        })
                        .catch(function (error) {
                            message.error(error)
                        });
                }
                else {
                    return ""
                }
            }
        });
    }

    render() {
        let self = this
        const { getFieldDecorator } = this.props.form;
        const columns = [{
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        }, {
            title: '密码',
            dataIndex: 'password',
            key: 'password',
        }, {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record, index) => {
                return (
                    <div>
                        <Icon type="edit" style={{ cursor: 'pointer', fontSize: "18px" }} onClick={() => {
                            let { _id, ...rest } = record
                            this.props.form.setFieldsValue(rest)
                            this.setState({
                                visible: true,
                                type: "edit",
                                row: rest
                            })
                        }} />
                        <Icon type="delete" style={{ marginLeft: "15px", cursor: 'pointer', fontSize: "18px" }} onClick={() => {
                            let { _id, ...rest } = record
                            axios.post('/deleteOneTable', {
                                "condition": {
                                    ...rest
                                },
                                "collection": 'koneUser'
                            })
                                .then(function (response) {
                                    message.success(response.data.result)
                                    axios.post('/queryOneTable', {
                                        "condition": {

                                        },
                                        "collection": 'koneUser'
                                    })
                                        .then(function (response1) {
                                            self.setState({
                                                dataSource: response1.data.result,
                                                visible: false
                                            })
                                        })
                                        .catch(function (error) {
                                            message.error(error)
                                        });
                                })
                                .catch(function (error) {
                                    message.error(error)
                                });
                        }} />
                    </div>
                )
            }
        }];
        return (
            <div>
                <Row>
                    <Col span={2}>
                        <Button type={'primary'} onClick={() => {
                            this.props.form.resetFields();
                            this.setState({
                                visible: true,
                                type: "add"
                            })
                        }}>
                            新增用户
                        </Button>
                    </Col>
                </Row>
                <Table columns={columns} dataSource={this.state.dataSource} style={{ marginTop: '20px' }} rowKey={(record) => record._id} />
                <Modal
                    title="详情"
                    visible={this.state.visible}
                    onOk={() => this.handleOk()}
                    onCancel={() => this.setState({ visible: false })}
                >
                    <Form>
                        <Form.Item label="用户名">
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input placeholder="用户名" />
                            )}
                        </Form.Item>
                        <Form.Item label="密码">
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input placeholder="密码" />
                            )}
                        </Form.Item>
                        <Form.Item label="城市权限">
                            {getFieldDecorator('cityArr', {
                                rules: [{ required: true, message: '请输入城市权限!' }],
                            })(
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="请输入城市权限"
                                >
                                    {this.state.selectArr.map(item=>{
                                        return <Option key={item.cityLabel}>{item.cityName}</Option>
                                    })}
                                </Select>,
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

const CityManagement = Form.create()(cityManagement);

export default CityManagement;