const { models } = require("../models/index");
const caisseController = {
  getCaisse: async (req, res, next) => {
    try {
      const caisse = await models.Caisse.findOne({
        order: [["date", "DESC"]],
      });

      if (!caisse) {
        return res.status(500).json("Error retrieving Caisse");
      }

      return res.status(200).json(caisse);
    } catch (error) {
      console.log("error", error);
      return res
        .status(500)
        .json("Error reaching the Caisse, please try again later");
    }
  },
  Caisse: async (req, res, next) => {
    try {
      const caisse = await models.Caisse.findOne({
        order: [["date", "DESC"]],
      });

      const paiements = await models.paiment.findAll({
        where: { status: true },
        include: [models.frais],
      });

      const montantsFrais = paiements.map((paiement) => paiement.frai.montant);
      const totalMontantsFrais = montantsFrais.reduce(
        (total, montant) => total + montant,
        0
      );

      const depenses = await models.depense.findAll();
      const totalMontantsDepenses = depenses.reduce(
        (total, depense) => total + depense.montantdep,
        0
      );

      if (!caisse) {
        return res.status(500).json("Error retrieving Caisse");
      }

      const nouveauMontantCaisse = totalMontantsFrais - totalMontantsDepenses;

      await caisse.update({ montant: nouveauMontantCaisse });

      return res.status(200).json(caisse);
    } catch (error) {
      console.log("error", error);
      return res
        .status(500)
        .json("Error reaching the Caisse, please try again later");
    }
  },

  createCaisse: (req, res) => {
    if (req.body.montant == "") {
      res.status(500).send({ message: "please fill all blanks" });
    } else {
      models.Caisse.create({
        montant: req.body.montant,
        date: new Date(),
      })
        .then((caisse) => {
          res
            .status(201)
            .send({ message: "Caisse created successfully", data: caisse });
        })
        .catch((err) =>
          res.status(500).send({ message: "Caisse already exist" })
        )
        .catch((err) => {
          res.status(500).json({ message: "there was an error:" + err });
        });
    }
  },
  updateCaisse: async (req, res) => {
    const caisseId = req.params.id;
    const newData = req.body;
    newData.date = new Date();
    try {
      const caisse = await models.Caisse.findOne({
        where: { id: caisseId },
      });

      if (!caisse) {
        return res.status(403).json({ message: "Caisse not found" });
      } else {
        await caisse.update(newData);
        return res
          .status(200)
          .json({ message: " Caisse updated successfully", data: caisse });
      }
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  deleteCaisse: async (req, res) => {
    const caisseId = req.params.id;
    try {
      const caisse = await models.Caisse.findOne({
        where: { id: caisseId },
      });
      if (!caisse) {
        return res.status(404).send({ message: "Caisse  not found" });
      }

      await caisse.destroy();

      res.status(200).send({ message: "Caisse  deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};
module.exports = caisseController;
