import Express from 'express';
import cfenv from 'cfenv';
import Parse from 'parse/node';
import bodyParser from 'body-parser';
import path from'path';
import schedule from 'node-schedule';
import rp from 'request-promise';


let appEnv = cfenv.getAppEnv();
let port = appEnv.port;

const SERVER_PORT = port;
const SERVER_HOST = 'localhost';
const APP_ID = 'myserver-app-2016';
const MASTER_KEY = '80b7083aca4a8e33768a1c7ad3dd3e5a74ef5dae';


Parse.initialize(APP_ID);
Parse.serverURL = `http://kc3ip-govplatform-cn.mychinabluemix.net/parse`;
Parse.masterKey = MASTER_KEY;
Parse.Cloud.useMasterKey();
let server = Express();


server.use(bodyParser.json({limit: '5mb'}));
server.use(bodyParser.urlencoded({extended: true,limit: '5mb',parameterLimit:50000}));
server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



server.use('/', Express.static(path.join(__dirname, 'public')));  //读取静态文件


var exportExcel = require('./api/doExcel.js')//从parse中导出相应表格
server.get('/export', function(req, res){
    exportExcel.default("hangzhou_alarm_one",res)
})  


var uploadExcel = require('./api/uploadExcel.js')//从接受excel上传数据
server.post('/uploadExcel', function(req, res){
    uploadExcel.default(req,res)
}) 


server.post('/transmit/*', async function(req, res){
    console.log(`https://kone-gov-service.mychinabluemix.net/${req.params['0']}`)
    try {
        let result = await rp({
            method: 'POST',
            uri: `https://kone-gov-service.mychinabluemix.net/${req.params['0']}`,
            body: req.body,
            json:true
        })
        res.json(result)
    } catch (error) {
        res.json({state:'fail',result:error})
    }
})//消息转发（用于转发至node-red）








server.listen(SERVER_PORT, () => {
    console.log(`server running http://${SERVER_HOST}:${SERVER_PORT}`);
});