import { useState, useEffect } from "react";
import { useNotes } from "../hooks/useNotes";
import Layout from "../components/Layout";
import { format } from "date-fns";
import {
  FiTrash2,
  FiRefreshCw,
  FiFilter,
  FiX,
  FiCalendar,
  FiTag,
  FiSearch,
  FiArchive,
} from "react-icons/fi";

const ArchivePage = () => {
  const {
    notes,
    categories,
    loading,
    filters,
    setFilters,
    resetFilters,
    deleteNote,
    unarchiveNote,
  } = useNotes();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentNote, setCurrentNote] = useState(null);

  // Local filter state for modal
  const [localFilters, setLocalFilters] = useState({
    categoryId: filters.categoryId,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  // Set archived filter on mount
  useEffect(() => {
    // Set to show archived notes when component mounts
    setFilters((prev) => ({ ...prev, isArchived: true }));

    // Cleanup function - reset when component unmounts
    return () => {
      if (resetFilters) {
        resetFilters(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency - we only want this to run on mount/unmount

  // Filter notes by search term
  const filteredNotes = notes.filter((note) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term) ||
      (note.category_name && note.category_name.toLowerCase().includes(term))
    );
  });

  const openDeleteModal = (note) => {
    setCurrentNote(note);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteNote = async () => {
    if (currentNote) {
      await deleteNote(currentNote.id);
      setIsDeleteModalOpen(false);
    }
  };

  const handleUnarchiveNote = async (id) => {
    await unarchiveNote(id);
  };

  // Reset local filters when modal opens
  const openFilterModal = () => {
    setLocalFilters({
      categoryId: filters.categoryId,
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
    setIsFilterModalOpen(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const clearLocalFilters = () => {
    setLocalFilters({
      categoryId: null,
      startDate: null,
      endDate: null,
    });
  };

  const applyFilters = () => {
    setFilters({
      ...localFilters,
      isArchived: true,
    });
    setIsFilterModalOpen(false);
  };

  // Modal component
  const DeleteNoteModal = () => (
    <div className="modal-backdrop">
      <div className="modal glass-card fade-in">
        <div className="modal-header">
          <h2 className="text-xl font-bold">Delete Note</h2>
        </div>

        <div className="modal-content">
          <p className="mb-4">
            Are you sure you want to delete the note "{currentNote?.title}"?
            This action cannot be undone.
          </p>

          <div className="modal-footer">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
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

  const FilterModal = () => (
    <div className="modal-backdrop">
      <div className="modal glass-card fade-in">
        <div className="modal-header">
          <h2 className="text-xl font-bold">Filter Archived Notes</h2>
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
                <label className="text-sm text-lighter" htmlFor="startDate">
                  From
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="glass-input"
                  value={localFilters.startDate || ""}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label className="text-sm text-lighter" htmlFor="endDate">
                  To
                </label>
                <input
                  id="endDate"
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
              onClick={clearLocalFilters}
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
      <div className="archive-page-container">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Archive</h1>
            <p className="page-subtitle">View and manage your archived notes</p>
          </div>

          <div className="page-actions">
            <button onClick={openFilterModal} className="compact-filter-button">
              <FiFilter /> Filters
            </button>
          </div>
        </div>

        <div className="compact-search-container">
          <input
            type="text"
            placeholder="Search archived notes..."
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
            <p className="loading-text">Loading archived notes...</p>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="content-grid">
            {filteredNotes.map((note) => (
              <div key={note.id} className="glass-card note-card fade-in">
                <div className="note-card-content">
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
                    onClick={() => handleUnarchiveNote(note.id)}
                    className="note-card-action"
                  >
                    <FiRefreshCw className="mr-1" /> Restore
                  </button>
                  <button
                    onClick={() => openDeleteModal(note)}
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
              <FiArchive />
            </div>
            <h3 className="empty-state-title">No Archived Notes</h3>
            <p className="empty-state-description">
              {searchTerm
                ? "No archived notes match your search criteria. Try adjusting your search terms."
                : "You don't have any archived notes yet. Notes you archive will appear here."}
            </p>
          </div>
        )}

        {isDeleteModalOpen && <DeleteNoteModal />}
        {isFilterModalOpen && <FilterModal />}
      </div>
    </Layout>
  );
};

export default ArchivePage;
