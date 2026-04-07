function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <p>{message}</p>
      <button onClick={onClose} aria-label="Close message">
        x
      </button>
    </div>
  );
}

export default Toast;
