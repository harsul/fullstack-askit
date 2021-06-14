const express = require("express");
const router = express.Router();
const { Commentlikes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
  const { CommentId } = req.body;
  const UserId = req.user.id;

  const found = await Likes.findOne({
    where: { CommentId: CommentId, UserId: UserId },
  });
  if (!found) {
    await Commentlikes.create({ CommentId: CommentId, UserId: UserId });
    res.json({ liked: true });
  } else {
    await Commentlikes.destroy({
      where: { CommentId: CommentId, UserId: UserId },
    });
    res.json({ liked: false });
  }
});

module.exports = router;