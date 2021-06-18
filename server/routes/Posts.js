const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes]});
  const listOfBestPosts = await Posts.findAll({ include: [Likes] });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts,listOfBestPosts:listOfBestPosts});
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id,{include:[Likes]});
  res.json(post);
});

router.get("/byuserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  const likedPosts = await Likes.findAll({ where: { UserId: id} });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts});
});

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
});

router.put("/posttext", validateToken, async (req, res) => {
  const { postText, id } = req.body;
  await Posts.update({ postText: postText }, { where: { id: id } });
  res.json(postText);
});

router.put("/username", validateToken, async (req, res) => {
  const { username, id } = req.body;
  await Posts.update({ username: username }, { where: { UserId: id } });
  res.json(username);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});


module.exports = router;