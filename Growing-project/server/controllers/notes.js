const Note = require("../models/note");

exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { categoryId, isArchived, startDate, endDate } = req.query;

    //Prepare filters
    const filters = {};

    if (categoryId) filters.categoryId = parseInt(categoryId);
    if (isArchived !== undefined) filters.isArchived = isArchived === "true";
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const notes = await Note.findAll(userId, filters);
    res.json({ notes });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findById(id, userId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ note });
  } catch (error) {
    console.error("Get note error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    const userId = req.user.id;

    const noteId = await Note.create({
      title,
      content,
      userId,
      categoryId: categoryId || null,
    });

    // Return the created note
    const newNote = await Note.findById(noteId, userId);

    res.status(201).json({
      message: "Note created successfully",
      noteId,
      note: newNote,
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updatedNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryId } = req.body;
    const userId = req.user.id;

    const success = await Note.update(id, userId, {
      title,
      content,
      categoryId: categoryId || null,
    });

    if (!success) {
      return res
        .status(404)
        .json({ message: "Note not found or not authorized" });
    }

    // Return the updated note
    const updatedNote = await Note.findById(id, userId);

    res.json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.archiveNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const success = await Note.updateArchiveStatus(id, userId, true);

    if (!success) {
      return res
        .status(404)
        .json({ message: "Note not found or not authorized" });
    }

    res.json({ message: "Note archived successfully" });
  } catch (error) {
    console.error("Archive note error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.unarchiveNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const success = await Note.updateArchiveStatus(id, userId, false);

    if (!success) {
      return res
        .status(404)
        .json({ message: "Note not found or not authorized" });
    }

    res.json({ message: "Note unarchived successfully" });
  } catch (error) {
    console.error("Unarchive note error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const success = await Note.delete(id, userId);

    if (!success) {
      return res
        .status(404)
        .json({ message: "Note not found or not authorized" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getNoteStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Note.getStats(userId);
    res.json({ stats });
  } catch (error) {
    console.error("Get note stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
