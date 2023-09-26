import * as express from 'express';
const router = express.Router();
import {authJwt} from "../middleware/index.js";
import * as userController from "../controllers/user.controller.js";

router.get("/all", userController.allAccess);

router.get("/user",
    [authJwt.verifyToken],
    userController.userBoard
);

router.get("/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    userController.moderatorBoard
);

router.get("/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.adminBoard
);

export default router;