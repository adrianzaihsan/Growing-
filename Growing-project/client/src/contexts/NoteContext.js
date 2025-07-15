// src/contexts/NoteContext.js
import { createContext } from "react";

export const NoteContext = createContext({
  notes: [],
  categories: [],
  stats: null,
  loading: true,
  filters: {},
  setFilters: () => {},
  resetFilters: () => {}, // <-- Tambahkan ini
  createNote: () => Promise.resolve({ success: false }),
  updateNote: () => Promise.resolve({ success: false }),
  deleteNote: () => Promise.resolve({ success: false }),
  archiveNote: () => Promise.resolve({ success: false }),
  unarchiveNote: () => Promise.resolve({ success: false }),
  createCategory: () => Promise.resolve({ success: false }),
  updateCategory: () => Promise.resolve({ success: false }),
  deleteCategory: () => Promise.resolve({ success: false }),
  refreshData: () => {},
});
