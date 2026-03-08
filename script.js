// =====================
// LUMINARY — Mood & Emotional Wellness
// =====================

// Data storage
const STORAGE_KEYS = {
  moods: 'luminary_moods',
  journals: 'luminary_journals',
  theme: 'luminary_theme'
};

const MOOD_EMOJIS = {
  joy: '😊',
  calm: '😌',
  sad: '😢',
  anxious: '😰',
  energetic: '⚡',
  tired: '😴',
  grateful: '🙏',
  frustrated: '😤'
};

const MOOD_LABELS = {
  joy: 'Joy',
  calm: 'Calm',
  sad: 'Sad',
  anxious: 'Anxious',
  energetic: 'Energetic',
  tired: 'Tired',
  grateful: 'Grateful',
  frustrated: 'Frustrated'
};

// ===================== INIT =====================
function getMoods() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.moods) || '[]');
  } catch { return []; }
}

function getJournals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.journals) || '[]');
  } catch { return []; }
}

function saveMoods(moods) {
  localStorage.setItem(STORAGE_KEYS.moods, JSON.stringify(moods));
}

function saveJournals(journals) {
  localStorage.setItem(STORAGE_KEYS.journals, JSON.stringify(journals));
}

// ===================== SECTION NAVIGATION =====================
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add('active');
    document.querySelectorAll('.animate-in').forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = `animateIn 0.6s ease ${el.style.getPropertyValue('--delay') || '0s'} forwards`;
    });
  }
  document.getElementById('mobileMenu')?.classList.remove('open');
  document.getElementById('hamburgerBtn')?.classList.remove('active');
}

document.querySelectorAll('[data-section]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const section = el.getAttribute('data-section');
    if (section) showSection(section);
  });
});

// ===================== DARK MODE =====================
const themeBtn = document.getElementById('themeBtn');
const themeIcon = themeBtn?.querySelector('.theme-icon');

function setTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
}

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark'));
  });
}

const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
if (savedTheme === 'dark') setTheme(true);

// ===================== HAMBURGER =====================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  mobileMenu?.classList.remove('open');
  hamburgerBtn?.classList.remove('active');
}

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('active');
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  document.getElementById('mobileBackdrop')?.addEventListener('click', closeMobileMenu);
}

// ===================== ACCOUNT DROPDOWN =====================
const accountBtn = document.getElementById('accountBtn');
const accountDropdown = document.getElementById('accountDropdown');

if (accountBtn && accountDropdown) {
  accountBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    accountDropdown.classList.toggle('open');
  });
  document.addEventListener('click', () => accountDropdown.classList.remove('open'));
}

// ===================== LOG MOOD =====================
const intensitySlider = document.getElementById('intensitySlider');
const intensityValue = document.getElementById('intensityValue');
const submitMoodBtn = document.getElementById('submitMoodBtn');

if (intensitySlider && intensityValue) {
  intensitySlider.addEventListener('input', () => {
    intensityValue.textContent = intensitySlider.value;
  });
}

if (submitMoodBtn) {
  submitMoodBtn.addEventListener('click', () => {
    const selected = document.querySelector('input[name="mood"]:checked');
    if (!selected) {
      showToast('Please select a mood');
      return;
    }
    const mood = {
      id: Date.now(),
      type: selected.value,
      intensity: parseInt(document.getElementById('intensitySlider').value, 10),
      notes: document.getElementById('moodNotes').value.trim(),
      date: new Date().toISOString()
    };
    const moods = getMoods();
    moods.unshift(mood);
    saveMoods(moods);
    document.getElementById('moodNotes').value = '';
    selected.checked = false;
    document.getElementById('intensitySlider').value = 5;
    intensityValue.textContent = '5';
    showToast('Mood logged! ✨');
    updateDashboard();
    updateAnalytics();
  });
}

// ===================== JOURNAL =====================
const submitJournalBtn = document.getElementById('submitJournalBtn');

if (submitJournalBtn) {
  submitJournalBtn.addEventListener('click', () => {
    const title = document.getElementById('journalTitle').value.trim();
    const content = document.getElementById('journalContent').value.trim();
    const mood = document.getElementById('journalMood').value;
    if (!title || !content) {
      showToast('Please add a title and content');
      return;
    }
    const entry = {
      id: Date.now(),
      title,
      content,
      mood: mood || null,
      date: new Date().toISOString()
    };
    const journals = getJournals();
    journals.unshift(entry);
    saveJournals(journals);
    document.getElementById('journalTitle').value = '';
    document.getElementById('journalContent').value = '';
    document.getElementById('journalMood').value = '';
    showToast('Journal entry saved 📔');
    renderJournalEntries();
    updateDashboard();
    updateAnalytics();
  });
}

function renderJournalEntries() {
  const container = document.getElementById('journalEntries');
  if (!container) return;
  const journals = getJournals();
  if (journals.length === 0) {
    container.innerHTML = '<p class="empty-state">No journal entries yet.</p>';
    return;
  }
  container.innerHTML = journals.slice(0, 10).map(j => `
    <div class="journal-entry">
      <h5>${escapeHtml(j.title)}</h5>
      <div class="entry-meta">${formatDate(j.date)}${j.mood ? ` · ${MOOD_EMOJIS[j.mood] || ''} ${MOOD_LABELS[j.mood] || j.mood}` : ''}</div>
      <p class="entry-preview">${escapeHtml(j.content.slice(0, 120))}${j.content.length > 120 ? '...' : ''}</p>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000) return 'Today';
  if (diff < 172800000) return 'Yesterday';
  return d.toLocaleDateString();
}

// ===================== DASHBOARD =====================
function updateDashboard() {
  const moods = getMoods();
  const journals = getJournals();

  document.getElementById('moodCount').textContent = moods.length;
  document.getElementById('journalCount').textContent = journals.length;

  const streak = calculateStreak(moods);
  document.getElementById('streakCount').textContent = streak;

  const activityList = document.getElementById('recentActivity');
  if (!activityList) return;

  const activities = [];
  moods.slice(0, 5).forEach(m => {
    activities.push({
      type: 'mood',
      emoji: MOOD_EMOJIS[m.type] || '💭',
      text: `Logged ${MOOD_LABELS[m.type] || m.type} (${m.intensity}/10)`,
      date: m.date
    });
  });
  journals.slice(0, 3).forEach(j => {
    activities.push({
      type: 'journal',
      emoji: '📔',
      text: j.title,
      date: j.date
    });
  });
  activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  activities.splice(5);

  if (activities.length === 0) {
    activityList.innerHTML = '<p class="empty-state">No activity yet. Log your first mood to get started!</p>';
    return;
  }
  activityList.innerHTML = activities.map(a => `
    <div class="activity-item">
      <span class="activity-emoji">${a.emoji}</span>
      <span>${escapeHtml(a.text)} · ${formatDate(a.date)}</span>
    </div>
  `).join('');
}

function calculateStreak(moods) {
  if (moods.length === 0) return 0;
  const dates = [...new Set(moods.map(m => new Date(m.date).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  const today = new Date().toDateString();
  if (dates[0] !== today) return 0;
  for (let i = 0; i < dates.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    if (dates[i] === expected.toDateString()) streak++;
    else break;
  }
  return streak;
}

// ===================== ANALYTICS =====================
function updateAnalytics() {
  const moods = getMoods();
  const journals = getJournals();

  const counts = {};
  Object.keys(MOOD_EMOJIS).forEach(k => { counts[k] = 0; });
  moods.forEach(m => { counts[m.type] = (counts[m.type] || 0) + 1; });
  const maxCount = Math.max(1, ...Object.values(counts));

  const chartBars = document.getElementById('moodChartBars');
  if (chartBars) {
    chartBars.innerHTML = Object.entries(counts).map(([type, count]) => `
      <div class="chart-bar" style="height: ${(count / maxCount) * 140}px">
        <span>${MOOD_EMOJIS[type]} ${count}</span>
      </div>
    `).join('');
  }

  const avgIntensity = moods.length ? moods.reduce((s, m) => s + m.intensity, 0) / moods.length : 0;
  const sentimentScore = document.getElementById('sentimentScore');
  const sentimentDesc = document.getElementById('sentimentDesc');
  if (sentimentScore) sentimentScore.textContent = moods.length ? (avgIntensity / 10 * 100).toFixed(0) + '%' : '—';
  if (sentimentDesc) {
    if (moods.length === 0) sentimentDesc.textContent = 'Log moods and journal entries to see sentiment analysis.';
    else if (avgIntensity >= 7) sentimentDesc.textContent = 'Your recent entries show positive emotional patterns. Keep nurturing those good moments!';
    else if (avgIntensity >= 4) sentimentDesc.textContent = 'Mixed emotional landscape. Consider journaling to explore what\'s on your mind.';
    else sentimentDesc.textContent = 'Lower intensity lately. Remember, it\'s okay to have difficult days. Reach out if you need support.';
  }

  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayMoods = moods.filter(m => new Date(m.date).toDateString() === d.toDateString());
    const avg = dayMoods.length ? dayMoods.reduce((s, m) => s + m.intensity, 0) / dayMoods.length : 0;
    last7.push({ date: d, avg, label: i === 0 ? 'Today' : d.toLocaleDateString('en', { weekday: 'short' }) });
  }
  const maxAvg = Math.max(1, ...last7.map(x => x.avg));

  const trendChart = document.getElementById('trendChart');
  if (trendChart) {
    trendChart.innerHTML = last7.map(({ date, avg, label }) => `
      <div class="trend-day">
        <div class="trend-bar" style="height: ${(avg / 10) * 160}px"></div>
        <span class="trend-label">${label}</span>
      </div>
    `).join('');
  }
}

// ===================== EXPORT REPORTS =====================
function exportSummary() {
  const moods = getMoods();
  const journals = getJournals();
  const streak = calculateStreak(moods);
  const content = `
LUMINARY WELLNESS SUMMARY
Generated: ${new Date().toLocaleString()}

OVERVIEW
- Total moods logged: ${moods.length}
- Journal entries: ${journals.length}
- Current streak: ${streak} days

RECENT MOODS (last 5)
${moods.slice(0, 5).map(m => `- ${MOOD_LABELS[m.type]} (${m.intensity}/10) - ${new Date(m.date).toLocaleString()}`).join('\n') || 'None'}

---
Luminary — Your emotional wellness companion
  `.trim();
  downloadFile(content, 'luminary-summary.txt', 'text/plain');
  showToast('Summary exported!');
}

function exportWeekly() {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const moods = getMoods().filter(m => new Date(m.date) >= weekAgo);
  const journals = getJournals().filter(j => new Date(j.date) >= weekAgo);
  const content = `
LUMINARY WEEKLY REPORT
${new Date().toLocaleDateString()} - Last 7 days

MOODS: ${moods.length}
${moods.map(m => `- ${MOOD_LABELS[m.type]} (${m.intensity}/10) - ${new Date(m.date).toLocaleString()}`).join('\n') || 'None'}

JOURNAL ENTRIES: ${journals.length}
${journals.map(j => `- ${j.title} (${new Date(j.date).toLocaleString()})`).join('\n') || 'None'}

---
Luminary
  `.trim();
  downloadFile(content, 'luminary-weekly.txt', 'text/plain');
  showToast('Weekly report exported!');
}

function exportJson() {
  const data = {
    exportDate: new Date().toISOString(),
    moods: getMoods(),
    journals: getJournals()
  };
  downloadFile(JSON.stringify(data, null, 2), 'luminary-export.json', 'application/json');
  showToast('Full data exported!');
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

document.getElementById('exportSummaryBtn')?.addEventListener('click', exportSummary);
document.getElementById('exportWeeklyBtn')?.addEventListener('click', exportWeekly);
document.getElementById('exportJsonBtn')?.addEventListener('click', exportJson);

// ===================== TOAST =====================
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ===================== ANIMATIONS ON SCROLL =====================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

// ===================== INITIAL RENDER =====================
updateDashboard();
renderJournalEntries();
updateAnalytics();
