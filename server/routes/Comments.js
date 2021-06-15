const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  const listOfComments = await Comments.findAll({ where: { PostId: postId } });
  res.json(listOfComments);
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const comment = await Comments.findByPk(id);
  res.json(comment);
});

router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  comment.username = req.user.username;
  comment.UserId = req.user.id;
  await Comments.create(comment);
  res.json(comment);
});

router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;

  await Comments.destroy({
    where: {
      id: commentId,
    },
  });
  res.json("DELETED SUCCESSFULLY");
});

router.put("/postcomment", validateToken, async (req, res) => {
  const { newComment, id } = req.body;
  await Comments.update({ commentBody: newComment }, { where: { id: id } });
  res.json(newComment);
});

module.exports = router;