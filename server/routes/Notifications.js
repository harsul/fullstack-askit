const express = require("express");
const router = express.Router();
const { Notifications} = require("../models");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    const listofNotifications = await Notifications.findAll()
    res.json(listofNotifications);
  });

router.post("/", validateToken, async (req, res) => {
    const notification = req.body;
    notification.commentUserId = req.user.id;
    notification.commentUsername= req.user.username
    await Notifications.create(notification);
    res.json(notification);
  });

  router.get("/byuser/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const listofNotifications = await Notifications.findAll({where:{postUserId:id}})
    res.json(listofNotifications);
  });

  router.put("/", validateToken, async (req, res) => {
    const {id} = req.body;
    await Posts.update({ read: "1" }, { where: { id: id } });
    res.json(id);
  });
  

module.exports = router;