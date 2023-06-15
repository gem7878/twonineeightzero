const express = require("express");
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');
const { resolve } = require('path');
const es = require('event-stream');

const filePaths = [
  "./db/국가철도공단_서울도시철도공사_에스컬레이터_20220927.csv",
  "./db/국가철도공단_서울도시철도공사_엘리베이터_20221122.csv",
  "./db/국가철도공단_서울도시철도공사_장애인화장실_20221013.csv",
  "./db/국가철도공단_서울도시철도공사_화장실_20221013.csv",
];

router.get("/maps/:id", async function(req,res,next) {
    let current = req.params.id;
    const escalator = await getMapContents(current,0);
    const es_list = {}
    escalator.forEach(row => {
        let new_row = {'상하행구분':row.상하행구분, '상세위치':row.상세위치};
        if (Object.keys(es_list).includes(row.시작층)){
            es_list[row.시작층].push(new_row);
        } else {
            es_list[row.시작층] = [new_row];
        }
        
    });
    
    const elevator = await getMapContents(current,1);
    const el_list = {};
    elevator.forEach(row => {
        let new_row = {'상하행구분':row.상하행구분, '상세위치':row.상세위치};
        if (Object.keys(el_list).includes(row.시작층)){
            el_list[row.시작층].push(new_row);
        } else {
            el_list[row.시작층] = [new_row];
        }
    })
    
    const toiletA = await getMapContents(current,2);
    const ta_list = {};
    toiletA.forEach(row => {
        let new_row = {'게이트내외': row.게이트내외, '상세위치':row.상세위치};
        let detail = row.지상지하구분 + row.역층 + '층';
        if (Object.keys(ta_list).includes(detail)) {
            ta_list[detail].push(new_row);
        } else {
            ta_list[detail] = [new_row]
        }
    })

    const toiletB = await getMapContents(current,3)
    const tb_list = {};
    toiletB.forEach(row => {
        let new_row = {'게이트내외': row.게이트내외, '상세위치':row.상세위치};
        let detail = row.지상지하구분 + row.역층 + '층';
        if (Object.keys(tb_list).includes(detail)) {
            tb_list[detail].push(new_row);
        } else {
            tb_list[detail] = [new_row]
        }
    })
    //{에스컬레이터: [{상세위치:'',...},{상세위치:'',...},...], 화장실: [], ...}
    return res.json({'에스컬레이터': es_list, '엘레베이터': el_list, '장애인화장실': ta_list, '화장실': tb_list});
})

router.get("/facility/:id", async function(req,res,next){
    let current = req.params.id;
    console.log(current);
    /*let current = req.params.id;
    let searchTerm1 = current-1;
    let searchTerm2 = current+1;*/
    const datas = [];
    for (var idx = 0; idx < filePaths.length; idx++) {
        const data = await getFileContents(current,idx);
        if(data.length) datas.push(data[0]);
    }
    return res.json({success:true, data:datas})
})

function sortList(list) {
    list.sort((a,b) => {
        if(a.상하행구분 == "상행" && b.상하행구분 == "하행"){
            return 1;
        } else if (a.상하행구분 == "하행" && b.상하행구분 == "상행"){
            return -1;
        } else if (a.상하행구분 ==  b.상하행구분) {
            return 0;
        }
    })
    /*list.forEach(element => {
        console.log(element.상하행구분);
    });*/
}

function getFileContents(searchTerm,idx) {
    const results = [];
    const currFile = filePaths[idx].split('_')[2];
    const stream = fs.createReadStream(filePaths[idx])
        .pipe(csv({ columns: true}))
        .pipe(es.map(function(line, cb){
            if(results.indexOf(currFile) == -1 && line['역명'].includes(searchTerm)){
                results.push(currFile);
            }
            
            cb(null, line)
        }))
        
    ;
    return new Promise((resolve, reject) => { 
        stream.on('error', function(err){
            console.log('File read Error.');
            resolve(reject);
        })

        stream.on('end', function(){
        console.log('ReadStream End.');
        resolve(results);
        })
    })
}

function getMapContents(searchTerm,idx) {
    const results = [];
    const stream = fs.createReadStream(filePaths[idx])
        .pipe(csv({ columns: true}))
        .pipe(es.map(function(line, cb){
            if(line['역명'].includes(searchTerm)){
                results.push(line);
            }
            
            cb(null, line)
        }))
        
    ;
    return new Promise((resolve, reject) => { 
        stream.on('error', function(err){
            console.log('File read Error.');
            resolve(reject);
        })

        stream.on('end', function(){
        console.log('ReadStream End.');
        resolve(results);
        })
    })
}
module.exports = router;
