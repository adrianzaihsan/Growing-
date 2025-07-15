import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useNotes } from "../hooks/useNotes";
import Layout from "../components/Layout";
import { format } from "date-fns";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiArchive,
  FiFilter,
  FiX,
  FiCalendar,
  FiTag,
  FiSearch,
  FiBookOpen,
} from "react-icons/fi";

const NotesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedNoteId = searchParams.get("id");

  const {
    notes,
    categories,
    loading,
    filters,
    setFilters,
    resetFilters,
    createNote,
    updateNote,
    deleteNote,
    archiveNote,
  } = useNotes();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Form states - separated to prevent interference
  const [addFormData, setAddFormData] = useState({
    title: "",
    content: "",
    categoryId: "",
  });

  const [editFormData, setEditFormData] = useState({
    id: null,
    title: "",
    content: "",
    categoryId: "",
  });

  const [deleteNoteData, setDeleteNoteData] = useState(null);

  // Local filter state for modal
  const [localFilters, setLocalFilters] = useState({
    categoryId: filters.categoryId,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  // Reset filters on mount to show non-archived notes
  useEffect(() => {
    if (resetFilters) {
      resetFilters(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoized filtered notes to prevent recalculation
  const filteredNotes = useMemo(() => {
    if (!searchTerm) return notes;

    const term = searchTerm.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term) ||
        (note.category_name && note.category_name.toLowerCase().includes(term))
    );
  }, [notes, searchTerm]);

  // Set current note when selectedNoteId changes
  useEffect(() => {
    if (selectedNoteId && !isEditModalOpen) {
      const note = notes.find((n) => n.id === parseInt(selectedNoteId));
      if (note) {
        setEditFormData({
          id: note.id,
          title: note.title,
          content: note.content,
          categoryId: note.category_id || "",
        });
        setIsEditModalOpen(true);
      }
    }
  }, [selectedNoteId, notes, isEditModalOpen]);

  // Reset URL params when edit modal closes
  useEffect(() => {
    if (!isEditModalOpen && selectedNoteId) {
      setSearchParams({});
    }
  }, [isEditModalOpen, selectedNoteId, setSearchParams]);

  // Handlers
  const handleAddInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleEditInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const openAddModal = useCallback(() => {
    setAddFormData({ title: "", content: "", categoryId: "" });
    setIsAddModalOpen(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false);
    setAddFormData({ title: "", content: "", categoryId: "" });
  }, []);

  const openEditModal = useCallback((note) => {
    setEditFormData({
      id: note.id,
      title: note.title,
      content: note.content,
      categoryId: note.category_id || "",
    });
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditFormData({ id: null, title: "", content: "", categoryId: "" });
  }, []);

  const openDeleteModal = useCallback((note) => {
    setDeleteNoteData(note);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeleteNoteData(null);
  }, []);

  // Reset local filters when modal opens
  const openFilterModal = () => {
    setLocalFilters({
      categoryId: filters.categoryId,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
    setIsFilterModalOpen(true);
  };

  const handleAddNote = useCallback(async () => {
    const result = await createNote({
      title: addFormData.title,
      content: addFormData.content,
      categoryId: addFormData.categoryId || null,
    });

    if (result.success) {
      closeAddModal();
    }
  }, [addFormData, createNote, closeAddModal]);

  const handleUpdateNote = useCallback(
    async (e) => {
      e.preventDefault();

      const result = await updateNote(editFormData.id, {
        title: editFormData.title,
        content: editFormData.content,
        categoryId: editFormData.categoryId || null,
      });

      if (result.success) {
        closeEditModal();
      }
    },
    [editFormData, updateNote, closeEditModal]
  );

  const handleDeleteNote = useCallback(async () => {
    if (!deleteNoteData) return;

    const result = await deleteNote(deleteNoteData.id);

    if (result.success) {
      closeDeleteModal();
    }
  }, [deleteNoteData, deleteNote, closeDeleteModal]);

  const handleArchiveNote = useCallback(
    async (id) => {
      await archiveNote(id);
    },
    [archiveNote]
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const clearFilters = () => {
    setLocalFilters({
      categoryId: null,
      startDate: null,
      endDate: null,
    });
    // Also reset the actual filters
    if (resetFilters) {
      resetFilters(false); // false = non-archived for Notes page
    }
  };

  const applyFilters = () => {
    setFilters({
      ...localFilters,
      isArchived: false, // Always false for Notes page
    });
    setIsFilterModalOpen(false);
  };

  // Add Modal Component
  const AddNoteModal = () => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
      }
    };

    return (
      <div className="modal-backdrop" onClick={closeAddModal}>
        <div
          className="modal glass-card fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2 className="text-xl font-bold">Add New Note</h2>
            <button
              type="button"
              onClick={closeAddModal}
              className="mobile-menu-button"
            >
              <FiX />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddNote();
            }}
            className="modal-content"
            onKeyDown={handleKeyDown}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="add-note-title">
                Title
              </label>
              <input
                id="add-note-title"
                name="title"
                type="text"
                required
                className="glass-input"
                value={addFormData.title}
                onChange={handleAddInputChange}
                placeholder="Note title"
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-note-category">
                Category
              </label>
              <select
                id="add-note-category"
                name="categoryId"
                className="glass-input"
                value={addFormData.categoryId}
                onChange={handleAddInputChange}
              >
                <option value="">-- Select Category --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="add-note-content">
                Content
              </label>
              <textarea
                id="add-note-content"
                name="content"
                required
                className="glass-input"
                value={addFormData.content}
                onChange={handleAddInputChange}
                placeholder="Write your note here..."
                style={{ minHeight: "200px", resize: "vertical" }}
                autoComplete="off"
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={closeAddModal}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="liquid-button">
                Save Note
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Edit Modal Component
  const EditNoteModal = () => (
    <div className="modal-backdrop" onClick={closeEditModal}>
      <div
        className="modal glass-card fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="text-xl font-bold">Edit Note</h2>
          <button
            type="button"
            onClick={closeEditModal}
            className="mobile-menu-button"
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleUpdateNote} className="modal-content">
          <div className="form-group">
            <label className="form-label" htmlFor="edit-note-title">
              Title
            </label>
            <input
              id="edit-note-title"
              name="title"
              type="text"
              required
              className="glass-input"
              value={editFormData.title}
              onChange={handleEditInputChange}
              placeholder="Note title"
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-note-category">
              Category
            </label>
            <select
              id="edit-note-category"
              name="categoryId"
              className="glass-input"
              value={editFormData.categoryId}
              onChange={handleEditInputChange}
            >
              <option value="">-- Select Category --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-note-content">
              Content
            </label>
            <textarea
              id="edit-note-content"
              name="content"
              required
              className="glass-input"
              value={editFormData.content}
              onChange={handleEditInputChange}
              placeholder="Write your note here..."
              style={{ minHeight: "200px", resize: "vertical" }}
              autoComplete="off"
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={closeEditModal}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="liquid-button">
              Update Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Delete Modal Component
  const DeleteNoteModal = () => (
    <div className="modal-backdrop">
      <div className="modal glass-card fade-in">
        <div className="modal-header">
          <h2 className="text-xl font-bold">Delete Note</h2>
        </div>

        <div className="modal-content">
          <p className="mb-4">
            Are you sure you want to delete the note "{deleteNoteData?.title}"?
            This action cannot be undone.
          </p>

          <div className="modal-footer">
            <button
              type="button"
              onClick={closeDeleteModal}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteNote}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Filter Modal Component
  const FilterModal = () => (
    <div className="modal-backdrop">
      <div className="modal glass-card fade-in">
        <div className="modal-header">
          <h2 className="text-xl font-bold">Filter Notes</h2>
          <button
            onClick={() => setIsFilterModalOpen(false)}
            className="mobile-menu-button"
          >
            <FiX />
          </button>
        </div>

        <div className="modal-content">
          <div className="form-group">
            <label className="form-label" htmlFor="filter-category">
              Category
            </label>
            <select
              id="filter-category"
              name="categoryId"
              className="glass-input"
              value={localFilters.categoryId || ""}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date Range</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label
                  className="text-sm text-lighter"
                  htmlFor="filter-start-date"
                >
                  From
                </label>
                <input
                  id="filter-start-date"
                  name="startDate"
                  type="date"
                  className="glass-input"
                  value={localFilters.startDate || ""}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label
                  className="text-sm text-lighter"
                  htmlFor="filter-end-date"
                >
                  To
                </label>
                <input
                  id="filter-end-date"
                  name="endDate"
                  type="date"
                  className="glass-input"
                  value={localFilters.endDate || ""}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={clearFilters}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="liquid-button"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="notes-page-container">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">My Notes</h1>
            <p className="page-subtitle">
              Manage and organize your learning notes
            </p>
          </div>

          <div className="page-actions">
            <button onClick={openFilterModal} className="compact-filter-button">
              <FiFilter /> Filters
            </button>
            <button onClick={openAddModal} className="empty-state-button">
              <FiPlus /> Add Note
            </button>
          </div>
        </div>

        {/* Compact Search */}
        <div className="compact-search-container">
          <input
            type="text"
            placeholder="Search notes..."
            className="compact-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="compact-search-icon" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="compact-search-clear"
            >
              <FiX />
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner-large"></div>
            <p className="loading-text">Loading notes...</p>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="content-grid">
            {filteredNotes.map((note) => (
              <div key={note.id} className="glass-card note-card fade-in">
                <div
                  className="note-card-content"
                  onClick={() => openEditModal(note)}
                >
                  <h3 className="note-card-title">{note.title}</h3>
                  <p className="note-card-text">{note.content}</p>
                  <div className="note-card-footer">
                    <span className="flex items-center">
                      <FiTag className="mr-1" />
                      {note.category_name || "Uncategorized"}
                    </span>
                    <span className="flex items-center">
                      <FiCalendar className="mr-1" />
                      {format(new Date(note.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>

                <div className="note-card-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(note);
                    }}
                    className="note-card-action"
                  >
                    <FiEdit2 className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchiveNote(note.id);
                    }}
                    className="note-card-action"
                  >
                    <FiArchive className="mr-1" /> Archive
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(note);
                    }}
                    className="note-card-action delete"
                  >
                    <FiTrash2 className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state fade-in">
            <div className="empty-state-icon">
              <FiBookOpen />
            </div>
            <h3 className="empty-state-title">No Notes Found</h3>
            <p className="empty-state-description">
              {searchTerm
                ? "No notes match your search criteria. Try adjusting your search terms."
                : "You haven't created any notes yet. Start building your knowledge base!"}
            </p>
            <button onClick={openAddModal} className="empty-state-button">
              <FiPlus /> Create Your First Note
            </button>
          </div>
        )}

        {isAddModalOpen && <AddNoteModal />}
        {isEditModalOpen && <EditNoteModal />}
        {isDeleteModalOpen && <DeleteNoteModal />}
        {isFilterModalOpen && <FilterModal />}
      </div>
    </Layout>
  );
};

export default NotesPage;
