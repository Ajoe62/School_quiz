// /app.js
// Shared utilities for index.html and results.html

const STORAGE_KEY = 'quizResults';

function loadResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveResults(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function saveAttempt(studentName, attempt) {
  const name = (studentName || '').trim();
  if (!name) return;
  const store = loadResults();

  const prev = store[name];
  if (!prev) {
    store[name] = [attempt];
  } else if (Array.isArray(prev)) {
    store[name] = [...prev, attempt];
  } else if (prev && typeof prev === 'object') {
    store[name] = [prev, attempt]; // legacy normalize
  } else {
    store[name] = [attempt];
  }
  saveResults(store);
}

function getStudentAttempts(studentName) {
  const name = (studentName || '').trim();
  const store = loadResults();
  const val = store[name];
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

function getAllStudents() {
  const store = loadResults();
  return Object.keys(store);
}

function formatDuration(seconds) {
  const s = Math.max(0, Number(seconds) || 0);
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  if (mm === 0) return `${ss} second${ss === 1 ? '' : 's'}`;
  return `${mm}m ${ss}s`;
}

function formatClock(seconds) {
  const s = Math.max(0, Number(seconds) || 0);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
