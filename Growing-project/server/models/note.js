const db = require("../config/db");

class Note {
  static async findAll(userId, filters = {}) {
    try {
      let query = `
            SELECT n.*, c.name as category_name FROM notes n
            LEFT JOIN categories c ON n.category_id = c.id WHERE n.user_id = ?`;

      const queryParams = [userId];

      //Add filters
      if (filters.categoryId) {
        query += " AND n.category_id = ?";
        queryParams.push(filters.categoryId);
      }

      if (filters.isArchived !== undefined) {
        query += " AND n.is_archived = ?";
        queryParams.push(filters.isArchived);
      }

      if (filters.startDate && filters.endDate) {
        query += " AND n.created_at BETWEEN ? AND ?";
        queryParams.push(filters.startDate, filters.endDate);
      }

      query += " ORDER BY n.created_at DESC";

      const [rows] = await db.execute(query, queryParams);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id, userId) {
    try {
      const [rows] = await db.execute(
        `SELECT n.*, c.name as category_name FROM notes n
                LEFT JOIN categories c ON n.category_id = c.id WHERE n.id = ? AND n.user_id = ?`,
        [id, userId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(noteData) {
    try {
      const { title, content, userId, categoryId } = noteData;

      const [result] = await db.execute(
        "INSERT INTO notes (title, content, user_id, category_id) VALUES (?, ?, ?, ?)",
        [title, content, userId, categoryId]
      );

      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userId, noteData) {
    try {
      const { title, content, categoryId } = noteData;

      const [result] = await db.execute(
        "UPDATE notes SET title = ?, content = ?, category_id = ? WHERE id = ? AND user_id = ?",
        [title, content, categoryId, id, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async updateArchiveStatus(id, userId, isArchived) {
    try {
      const [result] = await db.execute(
        "UPDATE notes SET is_archived = ? WHERE id = ? AND user_id = ?",
        [isArchived, id, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id, userId) {
    try {
      const [result] = await db.execute(
        "DELETE FROM notes WHERE id = ? AND user_id = ?",
        [id, userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getStats(userId) {
    try {
      //Get count by category
      const [categoryStats] = await db.execute(
        `SELECT c.name, COUNT(n.id) as count FROM notes n
                JOIN categories c ON n.category_id = c.id WHERE n.user_id = ?
                GROUP BY n.category_id`,
        [userId]
      );

      //Get count by month for the current year
      const [monthlyStats] = await db.execute(
        `SELECT MONTH(created_at) as month, COUNT(id) as count FROM notes
                WHERE user_id = ? AND YEAR(created_at) = YEAR(CURRENT_DATE())
                GROUP BY MONTH(created_at) ORDER BY month`,
        [userId]
      );

      //Get total counts
      const [totalStats] = await db.execute(
        `SELECT
                COUNT(id) as total_notes,
                SUM(CASE WHEN is_archived = 1 THEN 1 ELSE 0 END) as archived_notes,
                COUNT(DISTINCT DATE(created_at)) as active_days FROM notes
                WHERE user_id = ?`,
        [userId]
      );

      return {
        categoryStats,
        monthlyStats,
        totalStats: totalStats[0],
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Note;
