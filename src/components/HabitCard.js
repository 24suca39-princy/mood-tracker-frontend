import { FiEdit2, FiTrash2, FiCalendar, FiTag } from 'react-icons/fi';
import { formatDate } from '../utils/formatters';

function HabitCard({ habit, onEdit, onDelete }) {
  return (
    <article className="habit-card">
      <header>
        <h3>{habit.name}</h3>
        <span className={`mood-badge mood-${(habit.mood || '').toLowerCase()}`}>
          <FiTag size={14} /> {habit.mood}
        </span>
      </header>

      <p className="habit-date">
        <FiCalendar size={14} /> {formatDate(habit.date)}
      </p>

      <p className="habit-note">{habit.note || 'No note added.'}</p>

      <div className="card-actions">
        <button className="btn-secondary" onClick={() => onEdit(habit)}>
          <FiEdit2 size={14} /> Edit
        </button>
        <button className="btn-danger" onClick={() => onDelete(habit.id)}>
          <FiTrash2 size={14} /> Delete
        </button>
      </div>
    </article>
  );
}

export default HabitCard;
