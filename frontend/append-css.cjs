const fs = require('fs');
const cssToAppend = `
/* ═══════════════════════════════════════════
   CUSTOM LANDING PAGE
   ═══════════════════════════════════════════ */
.landing-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  background-color: var(--bg-app);
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  position: relative;
}

.landing-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2.5rem;
  z-index: 50;
}

.landing-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.landing-brand-logo {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--accent), #E79E86);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: var(--shadow-sm);
}

.landing-nav-actions {
  display: flex;
  gap: 1rem;
}

.landing-hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 6rem 2rem 2rem;
  position: relative;
  z-index: 10;
}

.hero-glow {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(120px);
  z-index: -1;
  pointer-events: none;
}

.hero-glow-1 {
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent-glow);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: rgba(222, 115, 86, 0.1);
  border: 1px solid rgba(222, 115, 86, 0.2);
  color: var(--accent);
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
  color: var(--text-main);
}

.hero-title-gradient {
  background: linear-gradient(135deg, var(--accent), #E79E86);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-muted);
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 3rem;
}

.hero-cta-group {
  display: flex;
  gap: 1rem;
}

.hero-btn {
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  height: auto;
}

.hero-mockup-wrapper {
  margin-top: 5rem;
  width: 100%;
  max-width: 1000px;
  perspective: 1200px;
}

.hero-mockup {
  background: #09090B;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  box-shadow: 0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05);
  overflow: hidden;
  transform: rotateX(5deg) scale(0.95);
  transition: transform 0.5s ease;
}

.hero-mockup:hover {
  transform: rotateX(0deg) scale(1);
}

.mockup-header {
  height: 40px;
  background: #18181B;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  padding: 0 1rem;
  position: relative;
}

.mockup-dots {
  display: flex;
  gap: 6px;
}

.mockup-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3F3F46;
}

.mockup-dots span:nth-child(1) { background: #FF5F56; }
.mockup-dots span:nth-child(2) { background: #FFBD2E; }
.mockup-dots span:nth-child(3) { background: #27C93F; }

.mockup-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
}

.mockup-body {
  height: 500px;
  display: flex;
}

.mockup-sidebar {
  width: 250px;
  border-right: 1px solid rgba(255,255,255,0.05);
  background: var(--bg-panel);
}

.mockup-main {
  flex: 1;
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  flex-direction: column;
}

.mockup-slide {
  height: 200px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: var(--radius-md);
}

.mockup-slide-2 {
  height: 100px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: var(--radius-md);
}

.landing-features {
  padding: 6rem 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.features-header {
  text-align: center;
  margin-bottom: 4rem;
}

.features-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.features-header p {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.feature-card {
  background: var(--bg-panel);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 2rem;
  border-radius: var(--radius-lg);
  transition: all var(--transition-smooth);
}

.feature-card:hover {
  border-color: rgba(222, 115, 86, 0.3);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(222, 115, 86, 0.1);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: var(--text-muted);
  line-height: 1.6;
  font-size: 0.95rem;
}

.landing-footer {
  text-align: center;
  padding: 2rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  color: var(--text-muted);
  font-size: 0.9rem;
}
`;
fs.appendFileSync('src/App.css', '\n' + cssToAppend);
console.log('Appended to App.css');
