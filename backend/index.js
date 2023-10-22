import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';

import apiRouter from './routes/station.routes.js';
import congRouter from './routes/congestion.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import boardRouter from './routes/board.routes.js';
import db from './models/index.js';

const app = express();

const Role = db.role;

db.sequelize.sync({force: false})
  .then(() => {
    console.log("데이터베이스 연결 성공하였습니다.")
  }).catch((err) => {
    console.error(err);
  });
  

let corsOptions = {
  origin: "*",
  Credential: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req,res,next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.get("/", function (req, res) {
  res.send("이구팔땡 API 서버입니다.");
});

app.use('/api',apiRouter);
app.use('/cong',congRouter);
app.use('/auth',authRouter);
app.use('/test', userRouter);
app.use("/board", boardRouter);

app.listen(process.env.PORT || 4000);
