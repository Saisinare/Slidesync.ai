const fs = require('fs');
const path = 'src/App.css';
let content = fs.readFileSync(path, 'utf8');

const cutIndex = content.indexOf('.share-copy-btn.copied {');
if (cutIndex !== -1) {
    const startOfGoodEnd = content.indexOf('}', cutIndex) + 1;
    content = content.substring(0, startOfGoodEnd);
}

const cssToAppend = `
/* ═══════════════════════════════════════════
   PROJECTS DASHBOARD
   ═══════════════════════════════════════════ */
.history-view {
  flex: 1;
  overflow-y: auto;
  position: relative;
  z-index: 10;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background: var(--bg-panel);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-smooth);
  animation: floatUp 0.4s ease backwards;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.project-card-thumb {
  width: 100%;
  aspect-ratio: 16/9;
  background: #09090B;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.project-card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-card-placeholder {
  color: var(--text-muted);
  opacity: 0.5;
}

.project-card-info {
  padding: 1.25rem;
}

.project-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}
`;

fs.writeFileSync(path, content + '\n' + cssToAppend);
console.log('App.css cleaned and fixed!');
