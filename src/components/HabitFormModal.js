import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { MOOD_OPTIONS } from '../utils/constants';

const getInitialForm = (habit) => ({
  name: habit?.name || '',
  date: habit?.date ? habit.date.slice(0, 10) : '',
  mood: habit?.mood || MOOD_OPTIONS[0],
  note: habit?.note || '',
});

function HabitFormModal({ isOpen, onClose, onSubmit, editingHabit, isSaving }) {
  const [formData, setFormData] = useState(getInitialForm(editingHabit));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(getInitialForm(editingHabit));
    setErrors({});
  }, [editingHabit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = 'Habit name is required.';
    if (!formData.date) nextErrors.date = 'Date is required.';
    if (!formData.mood) nextErrors.mood = 'Mood is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    await onSubmit(formData);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-head">
          <h2>{editingHabit ? 'Edit Habit' : 'Add New Habit'}</h2>
          <button onClick={onClose} aria-label="Close modal" className="icon-btn">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="habit-form">
          <label>
            Habit Name
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Read 10 pages"
            />
            {errors.name && <small className="error-text">{errors.name}</small>}
          </label>

          <label>
            Date
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
            {errors.date && <small className="error-text">{errors.date}</small>}
          </label>

          <label>
            Mood
            <select name="mood" value={formData.mood} onChange={handleChange}>
              {MOOD_OPTIONS.map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
            {errors.mood && <small className="error-text">{errors.mood}</small>}
          </label>

          <label>
            Note
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              placeholder="Quick reflection about today's progress"
            />
          </label>

          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingHabit ? 'Update Habit' : 'Save Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HabitFormModal;
