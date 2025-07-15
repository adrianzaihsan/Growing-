const db = require("../config/db");

class Category {
  static async findAll(userId) {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM categories WHERE user_id IS NULL OR user_id = ? ORDER BY name",
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async create(name, userId) {
    try {
      const [result] = await db.execute(
        "INSERT INTO categories (name, user_id) VALUES (?, ?",
        [name, userId]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, name, userId) {
    try {
      const [result] = await db.execute(
        "UPDATE categories SET name = ? WHERE id = ? AND user_id = ?",
        [name, id, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id, userId) {
    try {
      const [result] = await db.execute(
        "DELETE FROM categories WHERE id = ? AND user_id = ?",
        [id, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Category;
