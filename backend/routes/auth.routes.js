import * as express from 'express';
const router = express.Router();
import {verifySignUp} from "../middleware/index.js";
import * as authController from "../controllers/auth.controller.js";

router.post("/signup",
    [   
        verifySignUp.checkDuplicateUsername, 
        verifySignUp.checkRolesExisted
    ],
    authController.signup
);

router.post("/signin", authController.signin);

export default router;