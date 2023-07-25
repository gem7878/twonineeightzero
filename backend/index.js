const express = require("express");
const cors = require('cors');
const app = express();
const apiRouter = require('./routes/station');
const congRouter = require('./routes/congestion');

let corsOptions = {
  origin: "*",
  Credential: true,
};
app.use(cors(corsOptions));

app.get("/", function (req, res) {
  res.send("안녕하세요!!!!!!!!!!!");
});


app.use('/api',apiRouter);
app.use('/cong',congRouter);

app.listen(process.env.PORT || 3000);