import db from "../models/index.js";
const Comment = db.comment;
const User = db.user;

export async function findAll(req, res) {
  const postId = req.params.id;
  // const pageNumber = req.params.num;
  // const limit = 5;

  try {
    const data = await Comment.findAll({
      where: { customerBoardId: postId },
      attributes: ["id", "userAccountUserId", "content", "updatedAt"],
      order: [["createdAt", "ASC"]],
      // offset: (pageNumber-1)*limit,
      // limit: limit,
      include: [
        {
          model: User,
          attributes: ["user_name"],
        },
      ],
    });

    /* const countPage = Math.ceil(data.count / limit);
        if (pageNumber > countPage) res.status(400).send({message: "잘못된 페이지입니다."});*/

    const comments = await Promise.all(
      data.map(async (comment) => {
        return {
          commentId: comment.id,
          content: comment.content,
          updatedAt: comment.updatedAt,
          userName: comment.user_account.user_name,
          editable: comment.userAccountUserId === req.editable ? true : false,
        };
      })
    );

    await res.status(200).send(comments);
  } catch (err) {
    res.status(500).send({
      message: err.message || "comment error",
    });
  }
}

export function writeComment(req, res) {
  const postId = req.params.id;
  const { content } = req.body;
  const user_id = req.user_id;

  Comment.create({
    customerBoardId: postId,
    userAccountUserId: user_id,
    content: content,
  })
    .then((data) => {
      res.status(200).send({ success: true, data });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Write Comment Error: " + err.message,
      });
    });
}

export function updateComment(req, res) {
  const id = req.params.id;

  Comment.update(req.body, {
    where: { id: id, userAccountUserId: req.user_id },
  })
    .then((num) => {
      console.log(num);
      if (num == 1) {
        res.status(200).send({
          success: true,
        });
      } else if (num == 0) {
        res.status(400).send({
          message: "기존의 값과 같거나 권한이 없습니다.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Update Comment Error: " + err.message,
      });
    });
}

export function deleteComment(req, res) {
  const id = req.params.id;

  Comment.destroy({
    where: { id: id, userAccountUserId: req.user_id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          success: true,
        });
      } else if (num == 0) {
        res.status(400).send({
          success: false,
          message: "post를 찾지 못했거나 권한이 없습니다.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Delete Comment Error: " + err.message,
      });
    });
}
