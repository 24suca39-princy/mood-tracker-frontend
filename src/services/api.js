import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const tryMoodEndpoints = async (mood) => {
  const candidates = [
    () => api.get('/habits/filter', { params: { mood } }),
    () => api.get(`/habits/mood/${encodeURIComponent(mood)}`),
    () => api.get('/habits', { params: { mood } }),
  ];

  let lastError;

  for (const requestFn of candidates) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

export const getAllHabits = () => api.get('/habits');
export const getHabitById = (id) => api.get(`/habits/${id}`);
export const createHabit = (data) => api.post('/habits', data);
export const updateHabit = (id, data) => api.put(`/habits/${id}`, data);
export const deleteHabit = (id) => api.delete(`/habits/${id}`);
export const filterByMood = (mood) => tryMoodEndpoints(mood);
export const getStats = () => api.get('/habits/stats');

export default api;
