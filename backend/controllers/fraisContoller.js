const { models } = require("../models/index");
const storages = require("../libs/handystorage");
const fraisController = {
  getAllfrais: async (req, res, next) => {
    try {
      const Frais = await models.frais.findAll({});

      if (!Frais) {
        return res.status(500).send({ message: "Error retrieving frais" });
      }

      return res.status(200).json(Frais);
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Error reaching the frais, please try again later" });
    }
  },

  createfrais: (req, res) => {
    if (
      req.body.nom == "" ||
      req.body.description == "" ||
      req.body.montant == "" ||
      req.body.categorie == ""
    ) {
      res.status(500).send("please fill all blanks");
    } else {
      models.Categorie.findOne({ where: { NomCat: req.body.categorie } })
        .then((categorie) => {
          if (categorie) {
            models.frais
              .create({
                Nom: req.body.nom,
                description: req.body.description,
                montant: req.body.montant,
                CategorieNomCat: categorie.NomCat,
                NomCat: categorie.NomCat,
              })
              .then((Frais) => {
                res
                  .status(201)
                  .send({ message: "frais created successfully", data: Frais });
              })
              .catch((err) => {
                res.status(500).send({ message: `There was an error: ${err}` });
              });
          } else {
            res.status(404).send("Category not found.");
          }
        })
        .catch((err) => {
          res.status(500).send({ message: `There was an error: ${err}` });
        });
    }
  },
  updateFrais: async (req, res) => {
    const fraisId = req.params.id;
    const newData = req.body;
    try {
      const Frais = await models.frais.findOne({
        where: { Nom: fraisId },
      });

      if (!Frais) {
        return res.status(404).json({ message: "Frais not found" });
      } else {
        const categorie = await models.Categorie.findOne({
          where: { NomCat: req.body.CategorieNomCat },
        });
        if (!categorie) {
          return res.status(404).json({ message: "Categorie not found" });
        } else {
          await Frais.update(newData);
          return res
            .status(200)
            .json({ message: "Frais updated successfully", data: Frais });
        }
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  deleteFrais: async (req, res) => {
    const fraisId = req.params.id;
    try {
      const Frais = await models.frais.findOne({
        where: { nom: fraisId },
      });
      if (!Frais) {
        return res.status(404).send({ message: "Frais not found" });
      }
      await models.paiment.destroy({
        where: { fraiNom: fraisId },
      });
      await Frais.destroy();

      res.status(200).send({ message: "Frais deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};
module.exports = fraisController;
