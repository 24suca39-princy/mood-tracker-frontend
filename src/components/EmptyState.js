import { FiInbox } from 'react-icons/fi';

function EmptyState({ title, subtitle }) {
  return (
    <div className="empty-state">
      <FiInbox size={36} />
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
}

export default EmptyState;
