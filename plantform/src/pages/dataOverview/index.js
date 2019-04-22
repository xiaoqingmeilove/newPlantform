import React, { Component } from 'react';
import {
    Input, message, Button, Select, Table, Row, Col, InputNumber, Modal
} from 'antd';
import axios from 'axios';
import moment from 'moment';

const InputGroup = Input.Group;
const Option = Select.Option;




class dataOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            equipmentList: [],
            searchType: 'equipmentNumber',
            searchValue: '',
            row: {},
            visible: false,
            loading:true
        };
    }

    componentDidMount() {
        var self = this
        axios.post('/queryOneTable', {
            "condition": {
                plantSection: { $in: JSON.parse(window.localStorage.getItem('Authorization')) }
            },
            "collection": 'EquipmentList'
        })
            .then(function (response) {
                self.setState({
                    dataSource: response.data.result,
                    loading:false
                })
            })
            .catch(function (error) {
                self.setState({
                    loading:false
                })
                message.error(error)
            });
        axios.post('/queryOneTable', {
            "condition": {
                city: { $in: JSON.parse(window.localStorage.getItem('Authorization')) }
            },
            "collection": 'bindEquipments'
        })
            .then(function (response) {
                self.setState({
                    equipmentList: response.data.result
                })
            })
            .catch(function (error) {
                message.error(error)
            });
    }

    mySearch = () => {
        var self = this
        if (!self.state.searchValue || self.state.searchValue == '') {
            axios.post('/queryOneTable', {
                "condition": {
                    plantSection: { $in: JSON.parse(window.localStorage.getItem('Authorization')) }
                },
                "collection": 'EquipmentList'
            })
                .then(function (response) {
                    self.setState({
                        dataSource: response.data.result
                    })
                })
                .catch(function (error) {
                    message.error(error)
                });
        } else {
            if (self.state.searchType == 'equipmentNumber') {
                axios.post('/queryOneTable', {
                    "condition": {
                        plantSection: { $in: JSON.parse(window.localStorage.getItem('Authorization')) },
                        [self.state.searchType]: self.state.searchValue
                    },
                    "collection": 'EquipmentList'
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
            else if (self.state.searchType == 'registrationCode') {
                axios.post('/convergeRescodeToEquipment', {
                    "condition": {
                        city: { $in: JSON.parse(window.localStorage.getItem('Authorization')) },
                        [self.state.searchType]: self.state.searchValue
                    },
                    "collection": 'EquipmentList'
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
            else if (self.state.searchType == 'customerName') {
                axios.post('/queryOneTable', {
                    "condition": {
                        plantSection: { $in: JSON.parse(window.localStorage.getItem('Authorization')) },
                        [self.state.searchType]: { $regex: `/${self.state.searchValue}/ig` }
                    },
                    "collection": 'EquipmentList'
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
            else {
                axios.post('/queryOneTable', {
                    "condition": {
                        plantSection: { $in: JSON.parse(window.localStorage.getItem('Authorization')) },
                        [self.state.searchType]: self.state.searchValue
                    },
                    "collection": 'EquipmentList'
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
        }

    }

    render() {
        let self = this
        const columns = [{
            title: '电梯设备号',
            dataIndex: 'equipmentNumber',
            key: 'equipmentNumber',
        }, {
            title: '电梯注册码',
            dataIndex: 'registrationCode',
            key: 'registrationCode',
            render: (text, record, index) => {
                let temp = this.state.equipmentList.filter(item => item.equipmentNumber == record.equipmentNumber)[0]
                if (temp) {
                    return temp.registrationCode
                } else {
                    return "尚未绑定"
                }
            }
        }, {
            title: '所属客户',
            dataIndex: 'customerName',
            key: 'customerName',
        }, {
            title: '在线状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record, index) => {
                if (record.status == 'connected') {
                    return '在线'
                } else {
                    return '离线'
                }
            }
        }, {
            title: '城市',
            dataIndex: 'plantSection',
            key: 'plantSection',
            filters: JSON.parse(window.localStorage.getItem("Authorization")).map(item=>{
                return {
                    text: item, 
                    value: item
                }
            }),
              onFilter: (value, record) => record.plantSection.includes(value),
        }];
        const columns1 = [{
            title: '目标来源',
            dataIndex: 'responseUrl',
            key: 'responseUrl',
        }, {
            title: '返回结果',
            dataIndex: 'responseResult',
            key: 'responseResult',
        }, {
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            render: (text, record, index) => {
                return moment(record.time).format("YYYY-MM-DD HH:mm")
            }
        }]
        return (
            <div>
                <Row>
                    <Col span={12}>
                        <InputGroup compact>
                            <Select defaultValue="equipmentNumber" onChange={(value) => this.setState({ searchType: value, searchValue: "" })}>
                                <Option value="equipmentNumber">电梯设备号</Option>
                                <Option value="registrationCode">电梯注册码</Option>
                                <Option value="customerName">所属客户</Option>
                                <Option value="status">在线状态</Option>
                            </Select>
                            {
                                (() => {
                                    if (self.state.searchType == 'equipmentNumber') {
                                        return <InputNumber style={{ width: '300px' }} onChange={(e) => self.setState({ searchValue: e })} />
                                    }
                                    else if (self.state.searchType == 'registrationCode') {
                                        return <Input style={{ width: '300px' }} placeholder={'选择相应字段查询，支持模糊'} onChange={(e) => self.setState({ searchValue: e.target.value })} />
                                    }
                                    else if (self.state.searchType == 'customerName') {
                                        return <Input style={{ width: '300px' }} placeholder={'选择相应字段查询，支持模糊'} onChange={(e) => self.setState({ searchValue: e.target.value })} />
                                    }
                                    else {
                                        return (
                                            <Select defaultValue="" onChange={(value) => self.setState({ searchValue: value })}>
                                                <Option value="connected">在线</Option>
                                                <Option value="disconnected">离线</Option>
                                                <Option value="">全部</Option>
                                            </Select>
                                        )
                                    }
                                })()
                            }

                            <Button type={'primary'} onClick={() => this.mySearch()}>开始搜索</Button>
                        </InputGroup>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    dataSource={this.state.dataSource}
                    style={{ marginTop: '20px' }}
                    loading={this.state.loading}
                    rowKey={(record) => record.equipmentNumber}
                    onRow={(column) => {
                        return {
                            onClick: () => {
                                axios.post('/queryOneTable', {
                                    "condition": {
                                        city: { $in: JSON.parse(window.localStorage.getItem('Authorization')) },
                                        equipmentNumber: String(column.equipmentNumber)
                                    },
                                    "collection": 'onlineSynchronization'
                                })
                                    .then(function (response) {
                                        let obj = { ...column, table: response.data.result }
                                        self.setState({
                                            row: obj,
                                            visible: true
                                        })
                                    })
                                    .catch(function (error) {
                                        message.error(error)
                                    });
                            },
                        };
                    }}
                />
                <Modal
                    title="详细信息以及日志"
                    visible={Boolean(this.state.visible)}
                    width={1200}
                    onOk={() => this.setState({ visible: false })}
                    onCancel={() => this.setState({ visible: false })}
                >
                    <Row style={{ fontSize: 18 }}>
                        <Col span={12}>{`电梯设备号：${this.state.row.equipmentNumber}`}</Col>
                        <Col span={12}>{`电梯类型：${this.state.row.equipmentType}`}</Col>
                        <Col span={12}>{`层数：${this.state.row.landingDoors}`}</Col>
                        <Col span={12}>{`最大载重：${this.state.row.maxLoad}`}</Col>
                        <Col span={12}>{`总运行次数：${this.state.row.totalNumberOfStarts}`}</Col>
                        <Col span={12}>{`总运行时间：${this.state.row.totalRunTime}`}</Col>
                        <Col span={24}>{`电梯安装地址：${this.state.row.address}`}</Col>
                        <Col span={24}>{`电梯所属：${this.state.row.customerName}`}</Col>
                    </Row>
                    <Table
                        columns={columns1}
                        dataSource={this.state.row.table ? this.state.row.table : []}
                        rowKey={(record) => record._id}
                        style={{marginTop:20}}
                    ></Table>
                </Modal>
            </div>
        )
    }
}

export default dataOverview;