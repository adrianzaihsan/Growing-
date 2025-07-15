const Category = require("../models/category");

exports.getCategories = async (req, res) => {
  try {
    const userId = req.user.id;

    const categories = await Category.findAll(userId);
    res.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const categoryId = await Category.create(name, userId);

    res.status(201).json({
      message: "Category created successfully",
      categoryId,
    });
  } catch (error) {
    console.error("Create categroy error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const success = await Category.update(id, name, userId);

    if (!success) {
      return res
        .status(404)
        .json({ message: "Category not found or not authorized" });
    }

    res.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const success = await Category.delete(id, userId);

    if (!success) {
      return res
        .status(404)
        .json({ message: "Category not found or not authorized" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
