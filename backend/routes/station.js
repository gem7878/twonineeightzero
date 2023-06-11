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

const results = [];

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

function getFileContents(searchTerm,idx) {
    const results = [];
    const currFile = filePaths[idx].split('_')[2];
    const stream = fs.createReadStream(filePaths[idx])
        .pipe(csv({ headers: false}))
        .pipe(es.map(function(line, cb){
            if(results.indexOf(currFile) == -1 && line['2'].includes(searchTerm)){
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
module.exports = router;
