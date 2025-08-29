/*
  Pixley Arcade Web Portal Script

  This script powers the simple tabbed navigation and the fake leaderboard
  switching on the Pixley Arcade website. Tabs correspond to sections
  defined in index.html, and clicking a tab or button will swap the
  visible content accordingly. Leaderboard data is stubbed with sample
  entries, which you can replace with real values once your backend
  is wired up.
*/

// Tab and section elements
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('main section');
const lbChips = document.querySelectorAll('.chip');
const lbList = document.getElementById('lb-list');

function setActiveTab(name) {
  tabs.forEach((t) => {
    t.classList.toggle('active', t.dataset.tab === name);
  });
  sections.forEach((s) => {
    s.classList.toggle('active', s.id === name);
  });
}

// Attach click handlers to tabs
tabs.forEach((t) => {
  t.addEventListener('click', () => setActiveTab(t.dataset.tab));
});

// Attach click handlers to hero buttons (data-tab-jump)
document.querySelectorAll('[data-tab-jump]').forEach((btn) => {
  btn.addEventListener('click', () => setActiveTab(btn.dataset.tabJump));
});

// Sample leaderboard data
const sampleBoards = {
  blockdrop: [
    { u: 'ZeroBuildZack', s: '98,450' },
    { u: 'ArcadeAngel', s: '87,220' },
    { u: 'NeonNinja', s: '79,600' },
  ],
  flappypix: [
    { u: 'WingMaster', s: '142' },
    { u: 'PipeDodger', s: '117' },
    { u: 'TapTitan', s: '103' },
  ],
  '2048': [
    { u: 'TileLord', s: '64,192' },
    { u: 'MergeMage', s: '48,096' },
    { u: 'SlideSage', s: '32,768' },
  ],
  snake: [
    { u: 'BiteByte', s: '2,304' },
    { u: 'CoilKing', s: '1,920' },
    { u: 'AppleEater', s: '1,664' },
  ],
};

// Leaderboard chip click handler
lbChips.forEach((ch) => {
  ch.addEventListener('click', () => {
    lbChips.forEach((c) => c.classList.remove('active'));
    ch.classList.add('active');
    const key = ch.dataset.lb;
    const data = sampleBoards[key] || [];
    lbList.innerHTML = data
      .map((row, i) => {
        return `\n        <div class="lb-item">\n          <div class="left">\n            <div class="rank">${i + 1}</div>\n            <div class="user">${row.u}</div>\n          </div>\n          <div class="score">${row.s}</div>\n        </div>\n      `;
      })
      .join('');
  });
});

// Initialize the first leaderboard on page load
if (lbChips.length > 0) {
  lbChips[0].click();
}
