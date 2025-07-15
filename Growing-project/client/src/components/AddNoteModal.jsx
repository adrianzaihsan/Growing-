import React, { memo } from "react";
import { FiX } from "react-icons/fi";

const AddNoteModal = memo(
  ({ isOpen, onClose, onSubmit, formData, onInputChange, categories }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit();
    };

    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal glass-card fade-in">
          <div className="modal-header">
            <h2 className="text-xl font-bold">Add New Note</h2>
            <button
              type="button"
              onClick={onClose}
              className="mobile-menu-button"
            >
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-content">
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
                value={formData.title}
                onChange={onInputChange}
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
                value={formData.categoryId}
                onChange={onInputChange}
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
                value={formData.content}
                onChange={onInputChange}
                placeholder="Write your note here..."
                style={{ minHeight: "200px", resize: "vertical" }}
                autoComplete="off"
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={onClose}
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
  }
);

AddNoteModal.displayName = "AddNoteModal";

export default AddNoteModal;
