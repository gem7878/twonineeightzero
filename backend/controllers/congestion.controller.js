import { createReadStream } from "fs";
import csv from "csv-parser";
import es from "event-stream";
const { map } = es;

const filePaths = "./data/서울교통공사_지하철혼잡도정보_20221231.csv";

export async function getCongestions(req, res) {
    let name = req.params.name;
    const data = await getFileContents(name);
    console.log(data);
    res.json(data);
}


/** functions */

function getFileContents(searchTerm) {
    const results = [];
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
  
    const stream = createReadStream(filePaths)
      .pipe(csv({ columns: true }))
      .pipe(
        map(function (line, cb) {
          if (line["출발역"] === (searchTerm)) {
            let newLine = { 혼잡도: [] };
            let keys = ["요일구분", "호선", "역번호", "출발역", "상하구분"];
            let hourKeys = [];
  
            let hoursB = hours - 1 == 24 ? "00시" : hours - 1 + "시";
            let hoursA = hours + 1 == 24 ? "00시" : hours + 1 + "시";
  
            if (minutes > 0 && minutes <= 29) {
              hourKeys.push(
                hoursB + "00분",
                hoursB + "30분",
                hours + "시00분",
                hours + "시30분",
                hoursA + "00분"
              );
            } else if (minutes >= 30 && minutes <= 59) {
              hourKeys.push(
                hoursB + "30분",
                hours + "시00분",
                hours + "시30분",
                hoursA + "00분",
                hoursA + "30분"
              );
            }
  
            Object.keys(line).forEach((key) => {
              if (keys.includes(key)) newLine[key] = line[key];
            });
            Object.keys(line).forEach((key) => {
              if (hourKeys.includes(key)) {
                newLine["혼잡도"].push([key, line[key]]);
              }
            });
  
            results.push(newLine);
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