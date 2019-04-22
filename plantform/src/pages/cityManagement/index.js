import React, { Component } from 'react';
import {
    Form, message, Button, Icon, Table, Row, Col, Modal, Input
} from 'antd';
import axios from 'axios';




class cityManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            visible: false,
            type: '',
            row:{},
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
                        "collection": 'City'
                    })
                        .then(function (response) {
                            message.success(response.data.result)
                            axios.post('/queryOneTable', {
                                "condition": {

                                },
                                "collection": 'City'
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
                else if(this.state.type === 'edit'){
                    axios.post('/updateOneTable', {
                        "condition": {
                            ...values
                        },
                        "query":this.state.row,
                        "collection": 'City'
                    })
                        .then(function (response) {
                            message.success(response.data.result)
                            axios.post('/queryOneTable', {
                                "condition": {

                                },
                                "collection": 'City'
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
                else{
                    return ""
                }
            }
        });
    }

    render() {
        let self = this
        const { getFieldDecorator } = this.props.form;
        const columns = [{
            title: '城市名',
            dataIndex: 'cityName',
            key: 'cityName',
        }, {
            title: '城市编码',
            dataIndex: 'cityLabel',
            key: 'cityLabel',
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
                                "collection": 'City'
                            })
                                .then(function (response) {
                                    message.success(response.data.result)
                                    axios.post('/queryOneTable', {
                                        "condition": {
        
                                        },
                                        "collection": 'City'
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
                        }}/>
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
                            新增城市
                        </Button>
                    </Col>
                </Row>
                <Table columns={columns} dataSource={this.state.dataSource} style={{ marginTop: '20px' }} rowKey={(record) => record.cityLabel} />
                <Modal
                    title="详情"
                    visible={this.state.visible}
                    onOk={() => this.handleOk()}
                    onCancel={() => this.setState({ visible: false })}
                >
                    <Form className="login-form">
                        <Form.Item label="城市名称">
                            {getFieldDecorator('cityName', {
                                rules: [{ required: true, message: '请输入城市名称!' }],
                            })(
                                <Input placeholder="城市名称" />
                            )}
                        </Form.Item>
                        <Form.Item label="城市编码">
                            {getFieldDecorator('cityLabel', {
                                rules: [{ required: true, message: '请输入城市城市编码!' }],
                            })(
                                <Input placeholder="城市编码" />
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