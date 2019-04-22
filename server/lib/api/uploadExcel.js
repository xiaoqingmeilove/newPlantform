import Excel from 'node-xlsx';
import fs from 'fs';
import formidable from 'formidable';


function uploadExcel(req,res){
    var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = '.';     //设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    form.parse(req, function(err, fields, files) {
      if (err) {
        res.json({state:"fail",result:""})
      }else{
        var newPath = form.uploadDir + 'uploadExcel.xlsx' ;
        fs.renameSync(files.file.path, newPath);  //重命名
        var list = Excel.parse(newPath);
        var dataArr = list[0].data;
        dataArr.shift();
        let new_arr = [];
        dataArr.forEach(function(data){
          if(data.length>0){
            var new_obj = {};
            new_obj.equipmentNumber = String(data[1].replace(/\"/g, "").replace(/\s+/g," "))
            new_obj.registrationCode = String(data[0].replace(/\"/g, "").replace(/\s+/g," "))
            new_obj.city = data[3]
            new_arr.push(new_obj);
          }
        });
        res.json({state:"success",result:new_arr})
        fs.unlink(newPath,function(err, written, buffer) {});    //读取后删除
      }
    })
  }
  
export default uploadExcel;
  


