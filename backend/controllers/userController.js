const { models } = require("../models/index");
const storages = require("../libs/handystorage");
const handle = require("../libs/promiseHandler");
const userController = {
  getMe: async (req, res) => {
    try {
      const email = req.user;
      const condition = { mail: email };
      const user = await models.User.findOne({
        where: condition,
      });
      if (!user) {
        return res.status(403).json({ message: "User not found " });
      }
      return res.status(200).json(user);
    } catch {
      return res.status(500).json({
        message: "An error .",
      });
    }
  },
  getAllUser: async (req, res) => {
    try {
      const user = await models.User.findAll({
        include: [models.paiment],
      });

      if (!user) {
        return res.status(404).send({ message: "Error retrieving users" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Error reaching the users, please try again later" });
    }
  },
  getUserByID: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await models.User.findOne({
        where: { CIN: userId },
      });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      res.status(200).json({user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateUser: async (req, res) => {
    const userId = req.params.id;
    const newData = req.body.user;
    if (newData.mail == "" || newData.CIN == "") {
      return res.status(403).json({ message: "Email or CIN can not be empty" });
    }

    try {
      const user = await models.User.findOne({
        where: { CIN: userId },
        include: [models.paiment],
      });
      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }

      await user.update(newData);

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await models.User.findOne({
        where: { CIN: userId },
      });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      await models.paiment.destroy({
        where: { UserCIN: userId },
      });

      await user.destroy();

      res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};

module.exports = userController;
