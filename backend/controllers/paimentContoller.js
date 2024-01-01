const { models } = require("../models/index");
const storages = require("../libs/handystorage");
const handle = require("../libs/promiseHandler");
const paimentController = {
  getAllPaiment: async (req, res) => {
    try {
      const Paiment = await models.paiment.findAll({
        include: [models.Caisse, models.User, models.frais],
      });

      if (!Paiment) {
        return res.status(500).send({ message: "Error retrieving paiment" });
      }

      return res.status(200).json(Paiment);
    } catch (error) {
      console.log("error", error);
      return res
        .status(500)
        .json({
          message: "Error reaching the payment, please try again later",
        });
    }
  },
  createPaiment: async (req, res) => {
    try {
      const { userId, fraisId } = req.body;

      const user = await models.User.findByPk(userId);
      const Frais = await models.frais.findByPk(fraisId);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      if (!Frais) {
        return res.status(404).json({ message: "Frais not found." });
      }
      const payment = await models.paiment.create({
        UserCIN: user.CIN,
        fraiNom: Frais.Nom,
      });
      const paymentWithUser = {
        ...payment.toJSON(),
        User: user,
      };

      return res
        .status(201)
        .json({
          message: "Create payment with success.",
          data: paymentWithUser,
        });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Some Error when create new payment",
      });
    }
  },

  getPaimentByID: async (req, res) => {
    const PaimentId = req.params.id;
    try {
      const Paiment = await models.paiment.findOne({
        where: { idpaiment: PaimentId },
      });
      if (!Paiment) {
        return res.status(404).send({ message: "Paiment not found" });
      }

      res.status(200).send(Paiment);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
  getPaimentByUser: async (req, res) => {
    const CIN = req.params.id;
    try {
      const Paiment = await models.paiment.findAll({
        where: { UserCIN: CIN, status: false },
        include : [models.frais]
       
      });
      if (!Paiment) {
        return res.status(404).send({ message: "No paiment for this user" });
      }

      res.status(200).json(Paiment);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  payee: async (req, res) => {
    const paimentId = req.params.id;
    const newData = req.body;
    try {
      newData.datepaiment = new Date();
      const Paiment = await models.paiment.findOne({
        where: { idpaiment: paimentId },
        include: [models.frais],
      });
      if (!Paiment) {
        return res.status(404).json({ message: "Paiment not found" });
      }
      await Paiment.update(newData, {
        fields: ["datepaiment", "status"],
      });
      const user = await models.User.findByPk(Paiment.UserCIN);

      const updatedPaiment = {
        ...Paiment.toJSON(),
        User: user,
      };
      const caisse = await models.Caisse.findOne({
        order: [["date", "DESC"]],
      });
      const montantFrais = Paiment.frai.montant;

      await models.Caisse.create({
        montant: req.body.status
          ? (caisse?.montant || 0) + montantFrais
          : (caisse?.montant || 0) - montantFrais,
        date: new Date(),
        paimentIdpaiment: Paiment.idpaiment,
      });

      return res
        .status(200)
        .json({ message: "user payee", data: updatedPaiment });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  updatePaiment: async (req, res) => {
    const paimentId = req.params.id;
    const newData = req.body;
    try {
      const Paiment = await models.paiment.findOne({
        where: { idpaiment: paimentId },
      });

      if (!Paiment) {
        return res.status(403).json({ message: "Payment not found" });
      }

      await Paiment.update(newData, {
        fields: ["UserCIN", "fraiNom"],
      });
      const user = await models.User.findByPk(Paiment.UserCIN);

      const updatedPaiment = {
        ...Paiment.toJSON(),
        User: user,
      };
      return res.status(200).json({
        message: "Paiment updated successfully",
        data: updatedPaiment,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  deletePaiment: async (req, res) => {
    const paimentId = req.params.id;
    try {
      const Paiment = await models.paiment.findOne({
        where: { idpaiment: paimentId },
      });
      if (!Paiment) {
        return res.status(404).send({ message: "Payment not found" });
      }
      await Paiment.destroy();

      res.status(200).send({ message: "Payment deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};

module.exports = paimentController;
