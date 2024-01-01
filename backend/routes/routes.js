const express=require('express');
const router = express.Router();
const fraisController= require("../controllers/fraisContoller");
const categoriesController=require("../controllers/categoriesController")
const userController=require("../controllers/userController")
const paimentController =require("../controllers/paimentContoller")
const depenseController=require("../controllers/depenseController")
const caisseController=require("../controllers/caisseController")
const tokenHandlerMiddleware = require("../middleware/tokkenHandler");
const roleHandlerMiddleware = require("../middleware/roleManagement");



//CRUD User
router.get('/me',tokenHandlerMiddleware , roleHandlerMiddleware(['syndic', 'resident']) ,userController.getMe)
router.get("/user",tokenHandlerMiddleware ,roleHandlerMiddleware(['syndic'])  ,userController.getAllUser)
router.get('/getUser/:id',tokenHandlerMiddleware ,roleHandlerMiddleware(['syndic', 'resident']),userController.getUserByID)
router.post('/updateUser/:id',tokenHandlerMiddleware ,roleHandlerMiddleware(['syndic','resident']) ,userController.updateUser)
router.delete('/deleteUser/:id',tokenHandlerMiddleware ,roleHandlerMiddleware(['syndic']) , userController.deleteUser)

//CRUD Frais
router.get("/frais",tokenHandlerMiddleware ,roleHandlerMiddleware(['syndic', 'resident']) ,fraisController.getAllfrais);
router.post("/updateFrais/:id",tokenHandlerMiddleware , roleHandlerMiddleware(['syndic']),fraisController.updateFrais);
router.post("/createFrais", tokenHandlerMiddleware , roleHandlerMiddleware(['syndic']) ,fraisController.createfrais);
router.delete ("/deleteFrais/:id",tokenHandlerMiddleware , roleHandlerMiddleware(['syndic']),fraisController.deleteFrais);

//CRUD Categories
router.get("/categories", tokenHandlerMiddleware ,roleHandlerMiddleware(['syndic', 'resident']) ,categoriesController.getAllCategories);
router.post("/createCategories", tokenHandlerMiddleware,roleHandlerMiddleware(['syndic']),categoriesController.createCategories)
router.get('/getCategorie/:id',tokenHandlerMiddleware, roleHandlerMiddleware(['syndic', 'resident']) ,categoriesController.getCategorieByID)
router.post('/updateCategorie/:id', tokenHandlerMiddleware,roleHandlerMiddleware(['syndic']),categoriesController.updateCategorie)
router.delete('/deleteCategorie/:id',tokenHandlerMiddleware ,roleHandlerMiddleware(['syndic']) , categoriesController.deleteCategorie)

//CRUD Paiment
router.get("/getPaiment", tokenHandlerMiddleware, roleHandlerMiddleware(['syndic', 'resident']) ,paimentController.getAllPaiment);
router.post("/createPaiment",tokenHandlerMiddleware,roleHandlerMiddleware(['syndic', 'resident']) , paimentController.createPaiment)
router.get('/getPaiment/:id', tokenHandlerMiddleware,roleHandlerMiddleware(['syndic', 'resident']) ,paimentController.getPaimentByID)
router.get('/getPaimentByUser/:id', tokenHandlerMiddleware, roleHandlerMiddleware(['syndic', 'resident']) ,paimentController.getPaimentByUser) 
router.post('/updatePaiment/:id', tokenHandlerMiddleware ,  roleHandlerMiddleware(['syndic']),roleHandlerMiddleware(['syndic']), paimentController.updatePaiment)
router.delete('/deletePaiment/:id', tokenHandlerMiddleware, roleHandlerMiddleware(['syndic']), paimentController.deletePaiment)
router.post("/paiment/:id",tokenHandlerMiddleware,  paimentController.payee)


//CRUD Depense
router.get("/depenses", tokenHandlerMiddleware,roleHandlerMiddleware(['syndic', 'resident']), depenseController.getAllDepenses);
router.get("/depense/:id", tokenHandlerMiddleware, roleHandlerMiddleware(['syndic', 'resident']), depenseController.getDepenseByID);
router.post("/updateDepense/:id", tokenHandlerMiddleware, roleHandlerMiddleware(['syndic']), depenseController.updateDepense);
router.post("/createDepense",tokenHandlerMiddleware,roleHandlerMiddleware(['syndic']) ,depenseController.createDepense);
router.delete("/deleteDepense/:id", tokenHandlerMiddleware, roleHandlerMiddleware(['syndic']),depenseController.deleteDepense)

//CRUD CAISSE
router.get("/caisses",tokenHandlerMiddleware,roleHandlerMiddleware(['syndic', 'resident']), caisseController.getCaisse);
router.get("/caisse", tokenHandlerMiddleware,roleHandlerMiddleware(['syndic', 'resident']),caisseController.Caisse);
router.post("/createCaisse",tokenHandlerMiddleware,roleHandlerMiddleware(['syndic']),caisseController.createCaisse);
router.post("/updateCaisse/:id",tokenHandlerMiddleware,roleHandlerMiddleware(['syndic', 'resident']),caisseController.updateCaisse);
router.delete("/deleteCaisse/:id", tokenHandlerMiddleware,roleHandlerMiddleware(['syndic', 'resident']),caisseController.deleteCaisse)


module.exports = router;