import Excel from 'node-xlsx';
import fs from 'fs';
import Parse from 'parse/node';


function do_excel(data, res) {
    var buffer = Excel.build([{ name: "mySheetName", data: data }]); // returns a buffer
    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    var day = new Date().getDate();
    var num = parseInt(Math.random() * 1000000);
    month = month < 9 ? '0' + month : month;
    day = day < 9 ? '0' + day : day;
    num = num < 100000 ? '0' + num : num;
    var name = "excel" + '_' + year + "-" + month + "-" + day + '_' + num + '.xlsx';
    fs.writeFileSync('./public/' + name, buffer);
    var mes = '/excel/' + name;
    res.send({ mes: mes });
}

export default async function (table, res) {
    let fieldArr = []
    let valueArr = []
    let find = []
    let MaintUserInfo = Parse.Object.extend(table)
    for (let i = 3; ; i = i + 1000) {
        let query = new Parse.Query(MaintUserInfo);
        // query.equalTo("TaskStartDate","2018-07-29")
        // query.equalTo("city","宁波")
        query.skip(i)
        query.limit(1000)
        let find_arr = await query.find()
        if (find_arr.length) {
            find = find.concat(find_arr)
        } else {
            break
        }
    }

    for (let key in find[0].toJSON()) {
        fieldArr.push(key)
    }
    for (let i = 0; i < find.length; i++) {
        let new_arr = []
        for (let j = 0; j < fieldArr.length; j++) {
            let temp = find[i].get(fieldArr[j]) ? JSON.stringify(find[i].get(fieldArr[j])) : ""
            new_arr.push(temp)
        }
        valueArr.push(new_arr)
    }
    fieldArr = [fieldArr]
    let result = fieldArr.concat(valueArr)
    do_excel(result, res)
}