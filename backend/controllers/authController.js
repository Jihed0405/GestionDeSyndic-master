const conn = require("../config/sequelizeConfig");
const bcrypt = require("bcrypt");
const { models } = require("../models/index");
const jwt = require("jsonwebtoken");
const storage = require("../libs/handystorage");
const userUpload = require("../libs/users");
const fs = require("fs");
const handle = require("../libs/promiseHandler");
const { Op } = require("sequelize");
const { sendConfirmationEmail } = require("../nodeMailer");

const authController = {
  register: async (req, res) => {
    try {
      if (
        req.body.CIN === "" ||
        req.body.mail === "" ||
        req.body.password === ""
      ) {
        return res.status(403).json({ message: "Please fill  all the fields" });
      } else {
        const existingUser = await models.User.findOne({
          where: {
            [Op.or]: [{ mail: req.body.mail }, { CIN: req.body.CIN }],
          },
        });
        if (existingUser) {
          return res.status(403).json({ message: "User already exist" });
        } else {
          const hash = await bcrypt.hash(req.body.password, 10);
          let role = "";
          if (
            req.body.numbloc === undefined &&
            req.body.numhabitat === undefined
          ) {
            role = "syndic";
          } else {
            role = "resident";
          }
          const user = await models.User.create({
            CIN: req.body.CIN,
            nom: req.body.nom,
            prenom: req.body.prenom,
            mail: req.body.mail,
            password: hash,
            role: role,
            numbloc: req.body.numbloc,
            numhabitat: req.body.numhabitat,
            numTel: req.body.numTel,
          });
          const token = jwt.sign(
            { user: req.body.mail },
            "supersecretpassword"
          );
          return res
            .status(201)
            .send({
              message: "User registered successfully.",
              token: token,
              profile: user,
            });
        }
      }
    } catch (error) {
      console.log("error", error);
      return res
        .status(500)
        .send({ message: "An error occurred during registration." });
    }
  },

  login: async (req, res) => {
    userUpload(req, res, async (err) => {
      if (err) {
        console.log(err);
      }

      try {
        const condition = { mail: req.body.mail };
        const user = await models.User.findOne({
          where: condition,
          include: [{ model: models.paiment }],
        });

        if (!user) {
          return res.status(403).json({ message: "User not found " });
        }

        const password = req.body.password;
        const userHash = user.password;
        const isPasswordCorrect = await bcrypt.compare(password, userHash);

        if (!isPasswordCorrect) {
          return res.status(402).json({ message: "Incorrect password." });
        }
        const token = jwt.sign({ user: req.body.mail }, "supersecretpassword", {
          expiresIn: "2h",
        });
        /* user.paiments.forEach((paiment) => {
           console.log(paiment.dataValues);
         });*/
        return res
          .status(200)
          .json({
            message: "User connected",
            token: token,
            role: user.role,
            id: user.CIN,
          });
      } catch (error) {
        console.log("error", error);
        return res.status(500).json({
          message: "An error occurred during login.",
        });
      }
    });
  },
  forgetPassword: async (req, res) => {
    const email = req.body.mail;
    try {
      const user = await models.User.findOne({
        where: { mail: email },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      sendConfirmationEmail(email);
      return res.status(200).json({ message: "Email envoyé avec succès " });
    } catch {
      return res.status(500).json({ message: " Nodemailer error " });
    }
  },

  resetPassword: async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const email = req.params.id;
    try {
      const user = await models.User.findOne({
        where: { mail: email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } else {
        const newDate = {
          password: hash,
        };

        await user.update(newDate);

        return res.status(200).json({ message: "password changed", user });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = authController;
