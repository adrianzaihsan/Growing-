import api from "./api";

const notesService = {
  // Get all notes with optional filters
  getNotes: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.categoryId) params.append("categoryId", filters.categoryId);
      if (filters.isArchived !== undefined)
        params.append("isArchived", filters.isArchived);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const response = await api.get(`/notes?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single note by ID
  getNoteById: async (id) => {
    try {
      const response = await api.get(`/notes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new note
  createNote: async (noteData) => {
    try {
      const response = await api.post("/notes", noteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update note
  updateNote: async (id, noteData) => {
    try {
      const response = await api.put(`/notes/${id}`, noteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Archive note
  archiveNote: async (id) => {
    try {
      const response = await api.put(`/notes/${id}/archive`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Unarchive note
  unarchiveNote: async (id) => {
    try {
      const response = await api.put(`/notes/${id}/unarchive`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete note
  deleteNote: async (id) => {
    try {
      const response = await api.delete(`/notes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get note statistics
  getNoteStats: async () => {
    try {
      const response = await api.get("/notes/stats");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default notesService;
