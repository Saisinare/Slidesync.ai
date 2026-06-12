
import { PlayCircle, UploadCloud, Radio, Share2, Sparkles, Wand2 } from 'lucide-react';
import './App.css';

export default function CustomLandingPage({ onGetStarted }) {
  return (
    <div className="landing-wrapper">
      {/* ── TOP NAV ── */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <div className="landing-brand-logo">
             <Wand2 size={16} />
          </div>
          <span className="brand-text">Neural Voice</span>
        </div>
        <div className="landing-nav-actions">
          <button className="btn-secondary" onClick={onGetStarted}>Dashboard</button>
          <button className="btn-primary" onClick={onGetStarted}>Get Started <PlayCircle size={14} /></button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <main className="landing-hero">
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={12} className="hero-badge-icon" />
            <span>Now with advanced AI voice cloning</span>
          </div>
          
          <h1 className="hero-title">
            Transform Presentations into<br/>
            <span className="hero-title-gradient">Professional Audio.</span>
          </h1>
          
          <p className="hero-subtitle">
            Stop recording manual voiceovers. Upload your PowerPoint slides, 
            and let our AI synthesize natural-sounding audio from your speaker notes instantly.
          </p>
          
          <div className="hero-cta-group">
            <button className="btn-primary hero-btn" onClick={onGetStarted}>
              Start Generating for Free
            </button>
          </div>
        </div>

        {/* ── APP PREVIEW MOCKUP ── */}
        <div className="hero-mockup-wrapper">
           <div className="hero-mockup">
             <div className="mockup-header">
                <div className="mockup-dots">
                   <span></span><span></span><span></span>
                </div>
                <div className="mockup-title">editor - Neural Voice</div>
             </div>
             <div className="mockup-body">
                <div className="mockup-sidebar"></div>
                <div className="mockup-main">
                   <div className="mockup-slide"></div>
                   <div className="mockup-slide-2"></div>
                </div>
             </div>
           </div>
        </div>
      </main>

      {/* ── FEATURES SECTION ── */}
      <section className="landing-features">
         <div className="features-header">
            <h2>Everything you need for perfect audio</h2>
            <p>Our pipeline handles the heavy lifting so you can focus on the content.</p>
         </div>
         
         <div className="features-grid">
            <div className="feature-card">
               <div className="feature-icon-wrapper"><UploadCloud size={20} /></div>
               <h3>Upload .pptx</h3>
               <p>Simply drag and drop your PowerPoint file. We automatically extract slides and speaker notes.</p>
            </div>
            <div className="feature-card">
               <div className="feature-icon-wrapper"><Radio size={20} /></div>
               <h3>AI Synthesis</h3>
               <p>Choose from dozens of ultra-realistic voices and tones to narrate your presentation perfectly.</p>
            </div>
            <div className="feature-card">
               <div className="feature-icon-wrapper"><Share2 size={20} /></div>
               <h3>Share Instantly</h3>
               <p>Generate a secure, view-only link to share your interactive audio presentation with the world.</p>
            </div>
         </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Neural Voice. Built with AI.</p>
      </footer>
    </div>
  );
}
