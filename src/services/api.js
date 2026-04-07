import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // ✅ FIXED
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ CLEAN ENDPOINTS
export const getAllHabits = () => api.get('/habits');

export const getHabitById = (id) => api.get(`/habits/${id}`);

export const createHabit = (data) => api.post('/habits', data);

export const updateHabit = (id, data) => api.put(`/habits/${id}`, data);

export const deleteHabit = (id) => api.delete(`/habits/${id}`);

export const filterByMood = (mood) =>
  api.get('/habits/filter', { params: { mood } });

export const getStats = () => api.get('/habits/stats');

export default api;