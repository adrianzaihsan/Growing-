// src/contexts/NoteProvider.jsx
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { NoteContext } from "./NoteContext";

const NoteProvider = ({ children }) => {
  const { token, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoryId: null,
    isArchived: false,
    startDate: null,
    endDate: null,
  });

  const fetchNotes = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.categoryId)
        queryParams.append("categoryId", filters.categoryId);
      if (filters.isArchived !== null)
        queryParams.append("isArchived", filters.isArchived);
      if (filters.startDate && filters.endDate) {
        queryParams.append("startDate", filters.startDate);
        queryParams.append("endDate", filters.endDate);
      }

      const res = await axios.get(
        `http://localhost:5001/api/notes?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotes(res.data.notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      if (error.response?.status === 401) {
        console.error("Authentication error - token may be invalid");
      }
    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  const fetchCategories = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5001/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (error.response?.status === 401) {
        console.error("Authentication error - token may be invalid");
      }
    }
  }, [token]);

  const fetchStats = useCallback(async () => {
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5001/api/notes/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 401) {
        console.error("Authentication error - token may be invalid");
      }
    }
  }, [token]);

  const resetFilters = useCallback((isArchived = false) => {
    setFilters({
      categoryId: null,
      isArchived: isArchived,
      startDate: null,
      endDate: null,
    });
  }, []);

  // Separate useEffect for initial load
  useEffect(() => {
    if (token && !authLoading) {
      fetchCategories();
      fetchStats();
    }
  }, [token, authLoading, fetchCategories, fetchStats]);

  // Separate useEffect for notes with filters
  useEffect(() => {
    if (token && !authLoading) {
      fetchNotes();
    }
  }, [token, authLoading, filters, fetchNotes]);

  const createNote = async (noteData) => {
    try {
      const res = await axios.post("http://localhost:5001/api/notes", noteData);

      // Use the note from response if available
      if (res.data.note) {
        setNotes((prevNotes) => [res.data.note, ...prevNotes]);
      } else if (res.data.noteId) {
        // Fallback: fetch the newly created note if only ID is returned
        const newNoteRes = await axios.get(
          `http://localhost:5001/api/notes/${res.data.noteId}`
        );
        if (newNoteRes.data.note) {
          setNotes((prevNotes) => [newNoteRes.data.note, ...prevNotes]);
        }
      }

      await fetchStats();
      return { success: true };
    } catch (error) {
      console.error("Error creating note:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create note",
      };
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      const res = await axios.put(
        `http://localhost:5001/api/notes/${id}`,
        noteData
      );

      // Use the updated note from response if available
      if (res.data.note) {
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === id ? res.data.note : note))
        );
      } else {
        // Fallback: update locally
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === id ? { ...note, ...noteData } : note
          )
        );
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating note:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update note",
      };
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/notes/${id}`);

      // Remove from state instead of refetching
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      await fetchStats();

      return { success: true };
    } catch (error) {
      console.error("Error deleting note:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete note",
      };
    }
  };

  const archiveNote = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/notes/${id}/archive`);

      // Remove from current view if not showing archived
      if (!filters.isArchived) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      }

      await fetchStats();
      return { success: true };
    } catch (error) {
      console.error("Error archiving note:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to archive note",
      };
    }
  };

  const unarchiveNote = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/notes/${id}/unarchive`);

      // Remove from current view if showing archived
      if (filters.isArchived) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      }

      await fetchStats();
      return { success: true };
    } catch (error) {
      console.error("Error unarchiving note:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to unarchive note",
      };
    }
  };

  const createCategory = async (name) => {
    try {
      await axios.post("http://localhost:5001/api/categories", { name });
      await fetchCategories();
      return { success: true };
    } catch (error) {
      console.error("Error creating category:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create category",
      };
    }
  };

  const updateCategory = async (id, name) => {
    try {
      await axios.put(`http://localhost:5001/api/categories/${id}`, { name });
      await fetchCategories();
      return { success: true };
    } catch (error) {
      console.error("Error updating category:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update category",
      };
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/categories/${id}`);
      await fetchCategories();
      return { success: true };
    } catch (error) {
      console.error("Error deleting category:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete category",
      };
    }
  };

  const refreshData = useCallback(() => {
    fetchNotes();
    fetchCategories();
    fetchStats();
  }, [fetchNotes, fetchCategories, fetchStats]);

  const value = {
    notes,
    categories,
    stats,
    loading,
    filters,
    setFilters,
    resetFilters,
    createNote,
    updateNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshData,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};

export default NoteProvider;
