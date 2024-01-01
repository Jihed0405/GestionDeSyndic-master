const { models } = require("../models/index");
const storages = require("../libs/handystorage");
const handle = require("../libs/promiseHandler");
const categoriesController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await models.Categorie.findAll({
        include: [models.frais, models.depense],
      });

      if (!categories) {
        return res.status(500).json({ message: "Error retrieving categories" });
      }
      return res.status(200).json(categories);
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Error reaching the categories, please try again later",
        });
    }
  },

  createCategories: (req, res) => {
    if (req.body.NomCat == "" || req.body.description == "") {
      res.status(500).send({ message: "please fill all blanks" });
    } else {
      models.Categorie.create({
        NomCat: req.body.NomCat,
        description: req.body.description,
      })
        .then((categorie) => {
          res
            .status(201)
            .send({
              message: "Category created successfully",
              data: categorie,
            });
        })
        .catch((err) =>
          res.status(500).send({ message: "Category already exist" })
        )
        .catch((err) => {
          res.status(500).json({ message: "there was an error:" + err });
        });
    }
  },
  getCategorieByID: async (req, res) => {
    const CategorieId = req.params.id;
    try {
      const categorie = await models.Categorie.findOne({
        where: { NomCat: CategorieId },
      });
      if (!categorie) {
        return res.status(404).send({ message: "Categorie not found" });
      }

      res.status(200).send({ categorie });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  updateCategorie: async (req, res) => {
    const categorieId = req.params.id;
    const newData = req.body;
    if (newData.NomCat == "" || newData.description == "") {
      return res.status(403).json({ message: "Field can not be empty" });
    }
    try {
      let categorie = await models.Categorie.findOne({
        where: { idCategorie: categorieId },
      });

      if (!categorie) {
        return res.status(404).json({ message: "Categorie not found" });
      }
      categorie = await categorie.update(newData);
      return res.json({ message: "Categorie updated successfully", categorie });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  },

  deleteCategorie: async (req, res) => {
    const categorieId = req.params.id;
    try {
      const categorie = await models.Categorie.findOne({
        where: { NomCat: categorieId },
      });
      if (!categorie) {
        return res.status(404).send({ message: "Categorie not found" });
      }
      const fraisToDelete = await models.frais.findAll({
        where: { CategorieNomCat: categorieId }
      });
      for (const fraisItem of fraisToDelete) {
        await models.paiment.destroy({
          where: { fraiNom: fraisItem.Nom }
        })
        await fraisItem.destroy();
      }
      await models.depense.destroy({
        where: { CategorieNomCat: categorieId },
      });

      await categorie.destroy();

      res.status(200).send({ message: "Categorie deleted successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};

module.exports = categoriesController;
