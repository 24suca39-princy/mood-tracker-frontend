import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiMoon, FiPlus, FiSearch, FiSun } from 'react-icons/fi';
import {
  createHabit,
  deleteHabit,
  filterByMood,
  getAllHabits,
  getStats,
  updateHabit,
} from '../services/api';
import HabitCard from '../components/HabitCard';
import HabitFormModal from '../components/HabitFormModal';
import LoadingSpinner from '../components/LoadingSpinner';
import StatsPanel from '../components/StatsPanel';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';
import Pagination from '../components/Pagination';
import { ITEMS_PER_PAGE, MOOD_OPTIONS } from '../utils/constants';
import { normalizeStats } from '../utils/formatters';

function HabitDashboard() {
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState({ totalHabits: 0, moodDistribution: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [selectedMood, setSelectedMood] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => {
      setToast({ message: '', type: 'success' });
    }, 2500);
  };

  const loadHabits = useCallback(async (mood = 'ALL') => {
    setIsLoading(true);
    setError('');

    try {
      const response =
        mood && mood !== 'ALL' ? await filterByMood(mood) : await getAllHabits();
      setHabits(response.data || []);
      return response.data || [];
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to load habits.');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadStats = useCallback(async (habitList = []) => {
    try {
      const response = await getStats();
      setStats(normalizeStats(response.data, habitList));
    } catch {
      setStats(normalizeStats(null, habitList));
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const list = await loadHabits('ALL');
      await loadStats(list);
    };

    initialize();
  }, [loadHabits, loadStats]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedMood]);

  const visibleHabits = useMemo(() => {
    return habits.filter((habit) =>
      habit.name?.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [habits, searchTerm]);

  const totalPages = Math.ceil(visibleHabits.length / ITEMS_PER_PAGE);
  const paginatedHabits = visibleHabits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleMoodChange = async (mood) => {
    setSelectedMood(mood);
    const list = await loadHabits(mood);
    await loadStats(list);
  };

  const handleCreateOrUpdate = async (formData) => {
    setIsSaving(true);
    setError('');

    try {
      if (editingHabit?.id) {
        await updateHabit(editingHabit.id, formData);
        showToast('Habit updated successfully.');
      } else {
        await createHabit(formData);
        showToast('Habit created successfully.');
      }

      const list = await loadHabits(selectedMood);
      await loadStats(list);
      setIsModalOpen(false);
      setEditingHabit(null);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to save habit.');
      showToast('Unable to save habit.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this habit entry?'
    );
    if (!shouldDelete) return;

    try {
      await deleteHabit(id);
      showToast('Habit deleted.');
      const list = await loadHabits(selectedMood);
      await loadStats(list);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to delete habit.');
      showToast('Delete failed.', 'error');
    }
  };

  const openCreateModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  return (
    <main className={`page-shell ${isDarkMode ? 'theme-dark' : ''}`}>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <section className="hero card">
        <div>
          <h1>Micro Habit Tracker</h1>
          <p>Track tiny wins, tag your mood, and discover your weekly patterns.</p>
        </div>

        <div className="hero-actions">
          <button className="btn-ghost" onClick={() => setIsDarkMode((prev) => !prev)}>
            {isDarkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
            {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>
          <button className="btn-primary" onClick={openCreateModal}>
            <FiPlus size={16} /> Add Habit
          </button>
        </div>
      </section>

      <section className="controls card">
        <div className="search-field">
          <FiSearch size={16} />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search habits by name"
          />
        </div>

        <select
          value={selectedMood}
          onChange={(event) => handleMoodChange(event.target.value)}
        >
          <option value="ALL">All moods</option>
          {MOOD_OPTIONS.map((mood) => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>
      </section>

      {error && <p className="error-banner">{error}</p>}

      <div className="grid-layout">
        <section className="list-panel card">
          <div className="section-head">
            <h2>Habit Entries</h2>
            <span>{visibleHabits.length} items</span>
          </div>

          {isLoading ? (
            <LoadingSpinner label="Loading habits..." />
          ) : paginatedHabits.length ? (
            <>
              <div className="habit-grid">
                {paginatedHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <EmptyState
              title="No habits yet"
              subtitle="Start by adding your first micro habit and mood note."
            />
          )}
        </section>

        <StatsPanel stats={stats} />
      </div>

      <HabitFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        editingHabit={editingHabit}
        isSaving={isSaving}
      />
    </main>
  );
}

export default HabitDashboard;
