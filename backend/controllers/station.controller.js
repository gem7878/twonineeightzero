import { createReadStream } from "fs";
import csv from "csv-parser";
import es from "event-stream";
const { map } = es;

const filePaths = [
    "./data/국가철도공단_서울도시철도공사_에스컬레이터_20220927.csv",
    "./data/국가철도공단_서울도시철도공사_엘리베이터_20221122.csv",
    "./data/국가철도공단_서울도시철도공사_장애인화장실_20221013.csv",
    "./data/국가철도공단_서울도시철도공사_화장실_20221013.csv",
];

export async function getStations (req, res) {
    let stationLine = req.params.stationLine;
    let stationName = req.params.stationName;
    console.log(stationLine,stationName);
    const data = await getStationLine(stationName, stationLine);
    res.json(data);
}

export async function getCurrentStation (req, res) {
    let current = req.params.sName;
    let currentLine = req.params.sLine;
    console.log(current, currentLine);
    
    const lines = await getStationLine(current, currentLine);
    console.log(lines.result);

    const selectedLine = lines.success == true ? currentLine : lines.result[0]; // 없는 호선으로 검색해도 첫번째 호선(오름차순)으로 결과를 보여줌
    
    // 시설물 가져오기
    const es_list1 = await getEscalators(current, selectedLine);
    const el_list1 = await getElevators(current, selectedLine);
    const ta_list1 = await getToiletA(current, selectedLine);
    const tb_list1 = await getToiletB(current, selectedLine);

    res.json({
        lines: lines.result, 
        selectedLine: selectedLine, 
        data: {에스컬레이터: es_list1, 엘레베이터: el_list1, 장애인화장실: ta_list1, 화장실: tb_list1}
    });
}

export async function getPrevNextStation (req, res) {
    let stationLine = req.params.sLine;
    let stationName = req.params.sName;
    console.log(stationLine, stationName);

    const currentLines = await getStationLine(stationName, stationLine); // 현재역의 모든 호선
    const selectedLine = currentLines.success == true ? stationLine : currentLines.result[0]; // 없는 호선으로 검색해도 첫번째 호선(오름차순)으로 결과를 보여줌
    const currentID = await getStationId(selectedLine, stationName);
    console.log(currentID);

    const { 전역, 후역 } = await getStationName(Number(currentID[0].전철역코드));
    console.log(전역, 후역);

    const es_list1 = await getEscalators(전역.전철역명, stationLine)
    const es_list2 = await getEscalators(후역.전철역명, stationLine)

    const el_list1 = await getElevators(전역.전철역명, stationLine);
    const el_list2 = await getElevators(후역.전철역명, stationLine);

    const ta_list1 = await getToiletA(전역.전철역명, stationLine);
    const ta_list2 = await getToiletA(후역.전철역명, stationLine);

    const tb_list1 = await getToiletB(전역.전철역명, stationLine);
    const tb_list2 = await getToiletB(후역.전철역명, stationLine);

    res.json({
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
}


/** functions */

function getStationLine(stationName, stationLine) {
    const results = [];
    const stream = createReadStream("./data/서울교통공사 노선별 지하철역 정보.csv")
      .pipe(csv({ columns: true }))
      .pipe(
        map(function (line, cb) {
          if (line["전철역명"] === stationName) {
            let newLine = line.호선.replace('호선','');
            newLine = newLine.replace('0','')
            results.push(newLine);
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

function getStationId(stationLine, stationName) {
    const results = [];
    const stream = createReadStream("./data/서울교통공사 노선별 지하철역 정보.csv")
      .pipe(csv({ columns: true }))
      .pipe(
        map(function (line, cb) {
          if (
            line["전철역명"] === stationName &&
            line["호선"].includes(stationLine)
          ) {
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
    const stream = createReadStream("./data/서울교통공사 노선별 지하철역 정보.csv")
      .pipe(csv({ columns: true }))
      .pipe(
        map(function (line, cb) {
          if (Number(line["전철역코드"]) === beforeId) {
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

function getFileData(stationName, idx, stationLine) {
    const results = [];
    const stream = createReadStream(filePaths[idx])
      .pipe(csv({ columns: true }))
      .pipe(
        map(function (line, cb) {
          if (line["역명"] === stationName && line["선명"].includes(stationLine)) {
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

async function getEscalators(stationName, stationLine) {
    const escalator = await getFileData(stationName, 0, stationLine);
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
    const elevator = await getFileData(stationName, 1, stationLine);
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
    const toiletA = await getFileData(stationName, 2, stationLine);
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
    const toiletB = await getFileData(stationName, 3, stationLine);
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