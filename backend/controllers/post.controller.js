import db from "../models/index.js";
const board = db.board;

export function findAll(req, res) {
    const pageNumber = req.params.num;
    const limit = 10;
    board.findAndCountAll({
        attributes: ['id', 'title', 'createdAt'],
        order: [['createdAt', 'DESC']],
        offset: (pageNumber-1)*limit,
        limit: limit,
    })
    .then((data) => {
        const countPage = Math.ceil(data.count / limit);
        if (pageNumber > countPage) res.status(400).send({message: "잘못된 페이지입니다."});
        else {
            res.status(200).send({
                "countAllPost": data.count,
                "countPage": Math.ceil(data.count / limit),
                "data": data.rows
            });
        }
    })
    .catch((err) => {
        res.status(500).send({
            message: "Some error occurred while findAll: " + err.message,
        });
    });
}
  
export function findOne(req, res) {
    const id = req.params.id;
  
    // 수정 또는 삭제를 할 수 있는 역할인지 확인 
    // editable : admin, moderator --> true , user --> user_id
    board.findByPk(id)
    .then((data) => {
        res.status(200).send({
            data,
            "editable" : typeof req.editable !== "boolean" ? (req.editable === data.userAccountUserId ? true : false) : req.editable,
        });
    })
    .catch((err) => {
        res.status(500).send({
            message: "post findone error: " + err.message,
        });
    });
}

export function writePost(req, res) {
    const {title, content} = req.body;
    const user_id = req.user_id;
    
    board.create({
        userAccountUserId : user_id,
        title : title,
        content : content,
    })
    .then((data) => {
        res.status(200).send({success: true, data});
    })
    .catch((err) => {
        res.status(500).send({
            message: err.message || "Write Post Error"
        })
    });
}

export function updatePost(req, res) {
    const id = req.params.id;

    board.update(req.body, {
        where : {id:id, userAccountUserId:req.user_id},
    })
    .then((num) => {
        console.log(num);
        if(num == 1) { // 고유한 하나의 row만 바꾸려는 것이기 때문에 1이다.
            res.status(200).send({
                success: true
            });
        } else if (num == 0) {
            res.status(400).send({
                message: "기존의 값과 같거나 권한이 없습니다."
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Update Post Error: "+err.message
        });
    });
}

export function deletePost(req, res) {
    const id = req.params.id;

    board.destroy({
        where: {id: id, userAccountUserId:req.user_id}
    })
    .then((num) => {
        if(num == 1) {
            res.status(200).send({
                success: true
            });
        } else if(num == 0) {
            res.status(400).send({
                success: false,
                message: "post를 찾지 못했거나 권한이 없습니다."
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Delete Post Error: "+err.message
        });
    });  

}