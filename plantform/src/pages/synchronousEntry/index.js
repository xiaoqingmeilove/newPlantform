import React, { Component } from 'react';
import {
    Upload, message, Button, Icon, Table, Row, Col
} from 'antd';
import axios from 'axios';



class SynchronousEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        };
    }

    doExcel = () => {
        axios.post('/SynchronizeToDatabase', {
            dataSource:this.state.dataSource
          })
          .then(function (response) {
            message.success(response.data.result)
          })
          .catch(function (error) {
            message.error(error)
          });
    }

    render() {
        let self = this
        const props = {
            name: 'file',
            action: 'http://localhost:6002/uploadExcel',
            headers: {
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`上传成功，请核对后点击导入`);
                    self.setState({
                        dataSource: info.file.response.result
                    })
                } else if (info.file.status === 'error') {
                    message.error(`上传失败请重新上传`);
                }
            },
        };
        const columns = [{
            title: '电梯设备号',
            dataIndex: 'equipmentNumber',
            key: 'equipmentNumber',
        }, {
            title: '电梯注册码',
            dataIndex: 'registrationCode',
            key: 'registrationCode',
        }, {
            title: '城市',
            dataIndex: 'city',
            key: 'city',
        }];
        return (
            <div>
                <Row>
                    <Col span={3}>
                        <Upload {...props}>
                            <Button>
                                <Icon type="upload" /> 上传电梯数据
                            </Button>
                        </Upload>
                    </Col>
                    <Col span={3} offset={1}>
                        <Button type={'primary'} onClick={()=>this.doExcel()}>同步至数据库</Button>
                    </Col>
                </Row>
                <Table columns={columns} dataSource={this.state.dataSource} style={{ marginTop: '20px' }} rowKey={(record) => record.equipmentNumber} />
            </div>
        )
    }
}

export default SynchronousEntry;