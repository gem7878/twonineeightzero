const express = require("express");
const router = express.Router();
const fs = require("fs");
const csv = require("csv-parser");
const { resolve } = require("path");
const es = require("event-stream");

const filePaths = [
  "./db/국가철도공단_서울도시철도공사_에스컬레이터_20220927.csv",
  "./db/국가철도공단_서울도시철도공사_엘리베이터_20221122.csv",
  "./db/국가철도공단_서울도시철도공사_장애인화장실_20221013.csv",
  "./db/국가철도공단_서울도시철도공사_화장실_20221013.csv",
];

// 랜딩 페이지 - 전철역 호선 검색
router.get("/stationline/:stationLine/:stationName", async function (req, res, next) {
  let stationLine = req.params.stationLine;
  let stationName = req.params.stationName;
  const data = await getStationLine(stationName, stationLine);

  return res.json(data);
})

// 현재역 시설
router.get("/facility/:sLine/:sName", async function (req, res, next) { // id --> sName 변경
  let current = req.params.sName; //현재역 이름
  let currentLine = req.params.sLine; //현재 호선
  console.log(current);
  
  const lines = await getStationLine(current, currentLine);
  console.log(lines.result);

  const selectedLine = lines.success == true ? currentLine : lines.result[0]; // 없는 호선으로 검색해도 첫번째 호선(오름차순)으로 결과를 보여줌
  
  // 시설물 가져오기
  const es_list1 = await getEscalators(current, selectedLine);
  const el_list1 = await getElevators(current, selectedLine);
  const ta_list1 = await getToiletA(current, selectedLine);
  const tb_list1 = await getToiletB(current, selectedLine);

  return res.json({ lines: lines.result, selectedLine: selectedLine, data: {에스컬레이터: es_list1, 엘레베이터: el_list1, 장애인화장실: ta_list1, 화장실: tb_list1}});
});

// 전역, 후역 시설 : 클릭한 호선과 현재역을 받게 된다. 초기에는 현재 호선과 현재 역을 받게됨.
router.get("/maps/:sLine/:sName", async function (req, res, next) {
  console.log(req.params);
  const currentID = await getStationId(req.params.sLine, req.params.sName);
  console.log(currentID);
  const { 전역, 후역 } = await getStationName(Number(currentID[0].전철역코드));
  console.log(전역, 후역);

  const stationLine = req.params.sLine;
  const es_list1 = await getEscalators(전역.전철역명, stationLine)
  const es_list2 = await getEscalators(후역.전철역명, stationLine)

  const el_list1 = await getElevators(전역.전철역명, stationLine);
  const el_list2 = await getElevators(후역.전철역명, stationLine);

  const ta_list1 = await getToiletA(전역.전철역명, stationLine);
  const ta_list2 = await getToiletA(후역.전철역명, stationLine);

  const tb_list1 = await getToiletB(전역.전철역명, stationLine);
  const tb_list2 = await getToiletB(후역.전철역명, stationLine);

  //{에스컬레이터: [{상세위치:'',...},{상세위치:'',...},...], 화장실: [], ...}
  return res.json({
    전역: {
      호선: 전역.호선,
      전철역명: 전역.전철역명,
      에스컬레이터: es_list1,
      엘레베이터: el_list1,
      장애인화장실: ta_list1,
      화장실: tb_list1,
    },
    후역: {
      호선: 후역.호선,
      전철역명: 후역.전철역명,
      에스컬레이터: es_list2,
      엘레베이터: el_list2,
      장애인화장실: ta_list2,
      화장실: tb_list2,
    },
  });
});
/*
function getFileContents(searchTerm, idx) {
  const results = [];
  const currFile = filePaths[idx].split("_")[2];
  const stream = fs
    .createReadStream(filePaths[idx])
    .pipe(csv({ columns: true }))
    .pipe(
      es.map(function (line, cb) {
        if (
          results.indexOf(currFile) == -1 &&
          line["역명"].includes(searchTerm)
        ) {
          results.push(currFile);
        }

        cb(null, line);
      })
    );

  return new Promise((resolve, reject) => {
    stream.on("error", function (err) {
      console.log("File read Error.");
      resolve(reject);
    });

    stream.on("end", function () {
      console.log("ReadStream End.");
      resolve(results);
    });
  });
}*/

function getMapContents(stationName, idx, stationLine) {
  const results = [];
  const stream = fs
    .createReadStream(filePaths[idx])
    .pipe(csv({ columns: true }))
    .pipe(
      es.map(function (line, cb) {
        if (line["역명"].includes(stationName) && line["선명"].includes(stationLine)) {
          results.push(line);
        }

        cb(null, line);
      })
    );

  return new Promise((resolve, reject) => {
    stream.on("error", function (err) {
      console.log("File read Error.");
      resolve(reject);
    });

    stream.on("end", function () {
      console.log("ReadStream End.");
      resolve(results);
    });
  });
}

function getStationId(stationLine, stationName) {
  const results = [];
  const stream = fs
    .createReadStream("./db/서울교통공사 노선별 지하철역 정보.csv")
    .pipe(csv({ columns: true }))
    .pipe(
      es.map(function (line, cb) {
        if (
          line["전철역명"].includes(stationName) &&
          line["호선"].includes(stationLine)
        ) {
          // '5' or '경의선' 등..
          results.push(line);
        }
        cb(null, line);
      })
    );

  return new Promise((resolve, reject) => {
    stream.on("error", function (err) {
      console.log("File read Error.");
      resolve(reject);
    });

    stream.on("end", function () {
      console.log("ReadStream End.");
      resolve(results);
    });
  });
}

function getStationName(id) {
  const results = {"전역": {}, "후역": {}};
  const beforeId = id - 1;
  const afterId = id + 1;
  const stream = fs
    .createReadStream("./db/서울교통공사 노선별 지하철역 정보.csv")
    .pipe(csv({ columns: true }))
    .pipe(
      es.map(function (line, cb) {
        if (Number(line["전철역코드"]) == beforeId) {
          results["전역"] = line;
        } else if (Number(line["전철역코드"]) === afterId) {
          results["후역"] = line;
        }
        cb(null, line);
      })
    );

  return new Promise((resolve, reject) => {
    stream.on("error", function (err) {
      console.log("File read Error.");
      resolve(reject);
    });

    stream.on("end", function () {
      console.log("ReadStream End.");
      console.log(results);
      resolve(results);
    });
  });
}

function getStationLine(stationName, stationLine) {
  const results = [];
  const stream = fs
    .createReadStream("./db/서울교통공사 노선별 지하철역 정보.csv")
    .pipe(csv({ columns: true }))
    .pipe(
      es.map(function (line, cb) {
        if (line["전철역명"].includes(stationName)) {
          let newLine = line.호선.replace('호선','');
          newLine = newLine.replace('0','')
          results.push(newLine);
          //results.push({'전철역코드':line.전철역코드,'전철역명':line.전철역명,'호선':line.호선});
        }
        cb(null, line);
      })
    );
  results.sort(); // 오름차순 정렬

  return new Promise((resolve, reject) => {
    stream.on("error", function (err) {
      console.log("File read Error.");
      resolve(reject);
    });

    stream.on("end", function () {
      console.log("ReadStream End.");
      if(results.includes(stationLine)) {
        resolve({success:true, result:results});
      } else {
        resolve({success:false, result:results});
      }
    });
  });
}

async function getEscalators(stationName, stationLine) {
  const escalator = await getMapContents(stationName, 0, stationLine);
  const es_list = {};
  escalator.forEach((row) => {
    let new_row = { 상하행구분: row.상하행구분, 상세위치: row.상세위치 };
    if (Object.keys(es_list).includes(row.시작층)) {
      es_list[row.시작층].push(new_row);
    } else {
      es_list[row.시작층] = [new_row];
    }
  });

  return es_list;
}

async function getElevators(stationName, stationLine) {
  const elevator = await getMapContents(stationName, 1, stationLine);
  const el_list = {};
  let uniqueIndex1 = 1;
  elevator.forEach((row) => {
    let new_row = { 구분: uniqueIndex1, 상세위치: row.상세위치 };
    let floors = row.상세위치
      .match(/\(.*\)/)[0]
      .match(/\w\d/g)
      .sort();
    floors = allfloor(floors);
    floors.forEach((floor) => {
      if (Object.keys(el_list).includes(floor)) {
        el_list[floor].push(new_row);
      } else {
        el_list[floor] = [new_row];
      }
    });
    uniqueIndex1++;
  });

  return el_list;
}

function allfloor(array) {
  const all = [];
  array.sort();
  if (array[0][0] === array[1][0]) {
    for(var i = array[0][1]; i <= array[1][1]; i++) {
      all.push(array[0][0] === 'B' ? '지하'+i+'층' : '지상'+i+'층');
    }
  } else {
    for(var i = array[0][1]; i > 0; i--) {
      all.push('지하'+i+'층');
    }
    for(var j = array[1][1]; j > 0; j--) {
      all.push('지상'+j+'층');
    }
  }
  return all;
}

async function getToiletA(stationName, stationLine) {
  const toiletA = await getMapContents(stationName, 2, stationLine);
  const ta_list = {};
  toiletA.forEach((row) => {
    let new_row = { 게이트내외: row.게이트내외, 상세위치: row.상세위치 };
    let detail = row.지상지하구분 + row.역층 + "층";
    if (Object.keys(ta_list).includes(detail)) {
      ta_list[detail].push(new_row);
    } else {
      ta_list[detail] = [new_row];
    }
  });

  return ta_list;
}

async function getToiletB(stationName, stationLine) {
  const toiletB = await getMapContents(stationName, 3, stationLine);
  const tb_list = {};
  toiletB.forEach((row) => {
    let new_row = { 게이트내외: row.게이트내외, 상세위치: row.상세위치 };
    let detail = row.지상지하구분 + row.역층 + "층";
    if (Object.keys(tb_list).includes(detail)) {
      tb_list[detail].push(new_row);
    } else {
      tb_list[detail] = [new_row];
    }
  });

  return tb_list;
}

module.exports = router;
