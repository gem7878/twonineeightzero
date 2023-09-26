import db from '../models/index.js';
const ROLES = db.ROLES;
const User = db.user;

export function checkDuplicateUsername (req, res, next) {
    User.findOne({
        where: {
            user_name: req.body.user_name
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "이미 사용 중인 아이디입니다."
            });
            return;
        }
    })
    next();
}

export function checkRolesExisted (req, res, next) {
    if(req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if(!ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: req.body.roles[i] + " Role이 존재하지 않습니다."
                });
                return;
            }
        }
    }
    next();
}