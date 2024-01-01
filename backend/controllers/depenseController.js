const { models } = require("../models/index");
const depenseController = {
  getAllDepenses: async (req, res) => {
    try {
      const depenses = await models.depense.findAll();

      if (!depenses) {
        return res.status(403).send({ message: "Error retrieving depense" });
      }

      return res.status(200).json(depenses);
    } catch (error) {
      return res
        .status(500)
        .send({
          message: "Error reaching the depense, please try again later",
        });
    }
  },

  getDepenseByID: async (req, res) => {
    const depenseId = req.params.id;
    try {
      const depense = await models.depense.findOne({
        where: { iddepense: depenseId },
      });
      if (!depense) {
        return res.status(404).json({ message: "Depense not found" });
      }

      res.status(200).json({ depense });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createDepense: async (req, res) => {
    if (
      req.body.montantdep == "" ||
      req.body.description == "" ||
      req.body.categorie == ""
    ) {
      return res.status(500).send("Please fill all blanks");
    }

    try {
      const categorie = await models.Categorie.findOne({
        where: { NomCat: req.body.categorie },
      });

      if (!categorie) {
        return res.status(404).send("Category not found");
      }

      const caisse = await models.Caisse.findOne({
        order: [["date", "DESC"]],
      });
    
      const montantdep = parseFloat(req.body.montantdep);

      const depense = await models.depense.create({
        montantdep: montantdep,
        description: req.body.description,
        CategorieNomCat: categorie.NomCat,
        datedep: new Date(),
      });
      
      await models.Caisse.create({
        montant: caisse?.montant - montantdep|| 0 ,
        date: new Date(),
        depenseIddepense: depense.iddepense,
      });

      return res
        .status(201)
        .send({ message: "Depense created successfully", data: depense });
    } catch (error) {
      console.log("error", error);
      return res
        .status(500)
        .json({
          message: "Error creating depense or updating caisse",
          error: error,
        });
    }
  },

  updateDepense: async (req, res) => {
    const depenseId = req.params.id;
    const newData = req.body;

    try {
      const depense = await models.depense.findOne({
        where: { iddepense: depenseId },
      });

      if (!depense) {
        return res.status(403).json({ message: "Depense not found" });
      } else {
        await depense.update(newData);

        return res.json(depense);
      }
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  },

  deleteDepense: async (req, res) => {
    const depenseId = req.params.id;
    try {
      const depense = await models.depense.findOne({
        where: { iddepense: depenseId },
      });
      if (!depense) {
        return res.status(404).send({ message: "Depense not found" });
      }

      await depense.destroy();

      res.status(200).send({ message: "Depense deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};

module.exports = depenseController;
