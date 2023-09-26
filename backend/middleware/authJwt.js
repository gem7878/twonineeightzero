import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import db from "../models/index.js";

const User = db.user;

export function verifyToken (req, res, next) {
    let token = req.headers["x-access-token"];

    if(!token) {
        return res.status(403).send({
            message: "인증 토큰이 없습니다."
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            return res.status(401).send({
                message: "권한이 없습니다."
            });
        }
        req.user_id = decoded.id;
        next();
    });
}

export function isAdmin (req, res, next) {
    User.findByPk(req.user_id).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if(roles[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "관리자 권한이 필요합니다."
            });
            return;
        });
    })
}

export function isModerator (req, res, next) {
    User.findByPk(req.user_id).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if(roles[i].name === "moderator") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "중재자 권한이 필요합니다."
            });
            return;
        });
    })
}

export function isModeratorOrAdmin (req, res, next) {
    User.findByPk(req.user_id).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if(roles[i].name === "moderator") {
                    next();
                    return;
                }

                if(roles[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "관리자 또는 중재자 권한이 필요합니다."
            });
            return;
        });
    })
}



