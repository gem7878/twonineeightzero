import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
import apiRouter from './routes/station.routes.js';
import congRouter from './routes/congestion.routes.js';
import userRouter from './routes/user.routes.js';

let corsOptions = {
  origin: "*",
  Credential: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.send("이구팔땡 API 서버입니다");
});


app.use('/api',apiRouter);
app.use('/cong',congRouter);
app.use('/user',userRouter);

app.listen(process.env.PORT || 4000);
