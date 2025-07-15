const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notes");
const { authenticateToken } = require("../middleware/auth");

//Aplly auth middleware to all routes
router.use(authenticateToken);

//Notes routes
router.get("/", notesController.getNotes);
router.get("/stats", notesController.getNoteStats);
router.get("/:id", notesController.getNoteById);
router.post("/", notesController.createNote);
router.put("/:id", notesController.updatedNote);
router.put("/:id/archive", notesController.archiveNote);
router.put("/:id/unarchive", notesController.unarchiveNote);
router.delete("/:id", notesController.deleteNote);

module.exports = router;
