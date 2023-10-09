import db from '../models/index.js';
import config from '../config/auth.config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const User = db.user;
const Role = db.role;
const {Op} = db.Sequelize;

export function signup (req,res) {
    User.create({
        user_name: req.body.user_name,
        password_hash: bcrypt.hashSync(req.body.user_password, 10)
    }).then(user => {
        if(req.body.roles) {
            Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            }).then(roles => {
                user.setRoles(roles).then(() => {
                    res.send({message: "회원가입 성공"})
                });
            });
        } else {
            //1 = user
            user.setRoles([1]).then(() => {
                res.send({message: "회원가입 성공"})
            });
        }
    })
    .catch(err => {
        res.status(500).send({message: err.message});
    });
    
};

export function signin (req,res) {
    User.findOne({
        where: {
            user_name: req.body.user_name
        }
    }).then(user => {
        if(!user) {
            return res.status(404).send({message: "아이디가 존재하지 않습니다."})
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.user_password,
            user.password_hash
        )
    

        if(!passwordIsValid) {
            return res.status(401).send({
                message: "비밀번호가 다릅니다"
            });
        }

        const token = jwt.sign({id:user.user_id},
            config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: '3h',
            });
        var authorities = [];
        user.getRoles().then(roles => {
            for(let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_"+roles[i].name.toUpperCase());
            }
            res.status(200).send({
                user_id:user.user_id,
                user_name:user.user_name,
                roles: authorities,
                accessToken: token 
            });
        });

    }).catch(err => {
        res.status(500).send({message: err.message});
    });
};
