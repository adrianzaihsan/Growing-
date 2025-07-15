const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories");
const { authenticateToken } = require("../middleware/auth");

//Apply auth middleware to all routes
router.use(authenticateToken);

//Categories routes
router.get("/", categoriesController.getCategories);
router.post("/", categoriesController.createCategory);
router.put("/:id", categoriesController.updateCategory);
router.delete("/:id", categoriesController.deleteCategory);

module.exports = router;
