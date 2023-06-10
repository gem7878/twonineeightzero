const express = require("express");
const router = express.Router();
const fs = require("fs");
const csv = require("csv-parser");

const filePaths = [
  "./db/국가철도공단_서울도시철도공사_에스컬레이터_20220927.csv",
  "./db/국가철도공단_서울도시철도공사_엘리베이터_20221122.csv",
  "./db/국가철도공단_서울도시철도공사_장애인화장실_20221013.csv",
  "./db/국가철도공단_서울도시철도공사_화장실_20221013.csv",
];

const current = "김포공항"; //숫자
const searchTerm1 = "개화산"; //숫자
const searchTerm2 = "송정"; //숫자

const results = [];

router.get("/excelShow", function (req, res, next) {
  shownearly(searchTerm1);
  shownearly(searchTerm2);
  return res.send("끝");
});

function shownearly(searchTerm) {
  const ulist = [];
  for (var i = 0; i < filePaths.length; i++) {
    const filePath = filePaths[i];
    fs.createReadStream(filePath, "utf-8")
      .pipe(csv({ headers: false }))
      .on("data", (data) => {
        if (data["2"].includes(searchTerm)) {
          ulist.push(filePath);
          return;
        }
      })
      .on("end", () => {
        console.log(filePath + "의 검색이 끝났습니다");
      });
  }
  setTimeout(() => {
    console.log(ulist);
  }, 1000);
}
module.exports = router;
