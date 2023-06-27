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

// 현재역 시설
router.get("/facility/:id", async function (req, res, next) {
  let current = req.params.id;
  console.log(current);
  const datas = [];
  for (var idx = 0; idx < filePaths.length; idx++) {
    const data = await getFileContents(current, idx);
    if (data.length) datas.push(data[0]);
  }
  return res.json({ success: true, data: datas });
});

// 전역, 후역 시설
router.get("/maps/:sLine/:sName", async function (req, res, next) {
  console.log(req.params);
  const currentID = await getStationId(req.params.sLine, req.params.sName);
  console.log(currentID);
  const { 전역, 후역 } = await getStationName(Number(currentID[0].전철역코드));

  const escalator1 = await getMapContents(전역.전철역명, 0);
  const escalator2 = await getMapContents(후역.전철역명, 0);
  const es_list1 = {};
  escalator1.forEach((row) => {
    let new_row = { 상하행구분: row.상하행구분, 상세위치: row.상세위치 };
    if (Object.keys(es_list1).includes(row.시작층)) {
      es_list1[row.시작층].push(new_row);
    } else {
      es_list1[row.시작층] = [new_row];
    }
  });

  const es_list2 = {};
  escalator2.forEach((row) => {
    let new_row = { 상하행구분: row.상하행구분, 상세위치: row.상세위치 };
    if (Object.keys(es_list2).includes(row.시작층)) {
      es_list2[row.시작층].push(new_row);
    } else {
      es_list2[row.시작층] = [new_row];
    }
  });

  const elevator1 = await getMapContents(전역.전철역명, 1);
  const elevator2 = await getMapContents(후역.전철역명, 1);

  const el_list1 = {};
  let uniqueIndex1 = 1;
  elevator1.forEach((row) => {
    let new_row = { 구분: uniqueIndex1, 상세위치: row.상세위치 };
    let floors = row.상세위치
      .match(/\(.*\)/)[0]
      .match(/\w\d/g)
      .sort();
    floors = allfloor(floors);
    floors.forEach((floor) => {
      if (Object.keys(el_list1).includes(floor)) {
        el_list1[floor].push(new_row);
      } else {
        el_list1[floor] = [new_row];
      }
    });
    uniqueIndex1++;
  });

  const el_list2 = {};
  let uniqueIndex2 = 1;
  elevator2.forEach((row) => {
    let new_row = { 구분: uniqueIndex2, 상세위치: row.상세위치 };
    let floors = row.상세위치
      .match(/\(.*\)/)[0]
      .match(/\w\d/g)
      .sort();
    floors = allfloor(floors);
    floors.forEach((floor) => {
      if (Object.keys(el_list2).includes(floor)) {
        el_list2[floor].push(new_row);
      } else {
        el_list2[floor] = [new_row];
      }
    });
    uniqueIndex2++;
  });

  const toiletA1 = await getMapContents(전역.전철역명, 2);
  const toiletA2 = await getMapContents(후역.전철역명, 2);

  const ta_list1 = {};
  toiletA1.forEach((row) => {
    let new_row = { 게이트내외: row.게이트내외, 상세위치: row.상세위치 };
    let detail = row.지상지하구분 + row.역층 + "층";
    if (Object.keys(ta_list1).includes(detail)) {
      ta_list1[detail].push(new_row);
    } else {
      ta_list1[detail] = [new_row];
    }
  });

  const ta_list2 = {};
  toiletA2.forEach((row) => {
    let new_row = { 게이트내외: row.게이트내외, 상세위치: row.상세위치 };
    let detail = row.지상지하구분 + row.역층 + "층";
    if (Object.keys(ta_list2).includes(detail)) {
      ta_list2[detail].push(new_row);
    } else {
      ta_list2[detail] = [new_row];
    }
  });

  const toiletB1 = await getMapContents(전역.전철역명, 3);
  const toiletB2 = await getMapContents(후역.전철역명, 3);

  const tb_list1 = {};
  toiletB1.forEach((row) => {
    let new_row = { 게이트내외: row.게이트내외, 상세위치: row.상세위치 };
    let detail = row.지상지하구분 + row.역층 + "층";
    if (Object.keys(tb_list1).includes(detail)) {
      tb_list1[detail].push(new_row);
    } else {
      tb_list1[detail] = [new_row];
    }
  });

  const tb_list2 = {};
  toiletB2.forEach((row) => {
    let new_row = { 게이트내외: row.게이트내외, 상세위치: row.상세위치 };
    let detail = row.지상지하구분 + row.역층 + "층";
    if (Object.keys(tb_list2).includes(detail)) {
      tb_list2[detail].push(new_row);
    } else {
      tb_list2[detail] = [new_row];
    }
  });

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
}

function getMapContents(searchTerm, idx) {
  const results = [];
  const stream = fs
    .createReadStream(filePaths[idx])
    .pipe(csv({ columns: true }))
    .pipe(
      es.map(function (line, cb) {
        if (line["역명"].includes(searchTerm)) {
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
  const results = {};
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

function allfloor(array) {
  const all = [];
  array.forEach((item) => {
    for (var idx = item[1]; idx > 0; idx--)
      all.push((item[0] === "B" ? "지하" : "지상") + idx + "층");
  });
  return all;
}
module.exports = router;
