const express = require("express");
const router = express.Router();
const fs = require("fs");
const csv = require("csv-parser");
const { resolve } = require("path");
const es = require("event-stream");

const filePaths = "./db/서울교통공사_지하철혼잡도정보_20221231.csv";

const results = [];

router.get("/congestion/:name", async function (req, res, next) {
  let name = req.params.name;
  const data = await getFileContents(name);
  return res.json(data);
});

function getFileContents(searchTerm) {
  const results = [];
  const stream = fs
    .createReadStream(filePaths)
    .pipe(csv({ headers: false }))
    .pipe(
      es.map(function (line, cb) {
        results.push(line);

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
      resolve(results); // Array 반환
    });
  });
}
module.exports = router;
