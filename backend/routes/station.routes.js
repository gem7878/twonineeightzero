import { Router } from "express";
const router = Router();
import {getStations, getCurrentStation, getPrevNextStation} from "../controllers/station.controller.js";


// 랜딩 페이지 : 가까운 역-호선 보여주기
router.get("/stationline/:stationLine/:stationName", getStations)

// 현재역 시설
router.get("/facility/:sLine/:sName", getCurrentStation);

// 전역, 후역 시설 : 클릭한 호선과 현재역을 받게 된다. 초기에는 현재 호선과 현재 역을 받게됨.
router.get("/maps/:sLine/:sName", getPrevNextStation);

export default router;
