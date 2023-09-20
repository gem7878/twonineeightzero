import bcrypt from "bcrypt";
import { confirmUserName, createUserAccount } from "../models/user.model.js";


export async function register (req, res) {
    console.log(req.body);
    const {user_name, user_password} = req.body;
    try {
        const confirmedUser = await confirmUserName(user_name);
        //console.log(confirmedUser);
        
        if (confirmedUser.length !== 0) {
            res.status(409).json({
                error: "이미 사용 중인 아이디입니다.",
            });
        } else {
            bcrypt.hash(user_password, 10, async (err, hashedPassword) => {
                if (err) {
                    res.status(500).json({ // bcrypt error
                        error: err.message,
                    });
                } else {                    
                    const user_id = await createUserAccount(user_name, hashedPassword);
                    res.status(201).json({
                        message: "회원가입 성공",
                    });
                }
            })
        }
    } catch (err) {
        console.error('register',err);
    }
}

export async function login (req, res) {
    console.log(req.body);
    const {user_name, user_password} = req.body;
    try {
        const confirmedUser = await confirmUserName(user_name);
        //console.log(confirmedUser);
        
        if (confirmedUser.length !== 0) {
            let validatePassword = await bcrypt.compare(user_password, confirmedUser[0].password_hash);
            //console.log(validatePassword);
            if(!validatePassword){
                res.status(400).json({
                    code: "P",
                    error: "비밀번호가 틀렸습니다.",
                });
            } else res.status(200).json({message: '로그인 성공'});

        } else {
            res.status(400).json({
                code: "I",
                error: "아이디가 존재하지 않습니다.",
            });
        }
    } catch (err) {
        console.error('login',err);
    }
}