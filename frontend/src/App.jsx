import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Upload, Play, Loader2, Share2, Settings, User, 
  Grid, Sparkles, PlusCircle, AlertCircle, Clock,
  ChevronLeft, ChevronRight, X, Volume2, Mic,
  FileText, Wand2, Download, Link, Copy
} from 'lucide-react';
import './App.css';
import CustomLandingPage from './CustomLandingPage';

const API_URL = 'http://localhost:8000/api';

function App() {
  const [file, setFile] = useState(null);
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [scripts, setScripts] = useState({});
  const [audioUrls, setAudioUrls] = useState({});
  const [loading, setLoading] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isSynthesizingAll, setIsSynthesizingAll] = useState(false);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTone, setActiveTone] = useState('Professional');
  const [isDragging, setIsDragging] = useState(false);
  
  const [activeTab, setActiveTab] = useState('home');
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
  }, [activeTab]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get('share');
    const projId = params.get('project');
    if (shareId) {
      loadSharedProject(shareId, true);
      setActiveTab('editor');
    } else if (projId) {
      loadSharedProject(projId, false);
      setActiveTab('editor');
    } else {
      setActiveTab('home');
    }
  }, []);

  const loadSharedProject = async (id, isShared) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/share/${id}`);
      const data = JSON.parse(res.data.project_data);
      setSlides(data.slides || []);
      setScripts(data.scripts || {});
      setAudioUrls(data.audioUrls || {});
      setFile({ name: data.fileName || (isShared ? 'Shared Project' : 'Untitled Project') });
      setIsViewOnly(isShared);
      if (!isShared) {
        setProjectId(id);
      }
    } catch (err) {
      console.error('Failed to load project', err);
      setError('Could not load project. The link might be invalid.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await axios.get(`${API_URL}/projects`);
      setHistoryData(res.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const saveProject = async (currentFileName, currentSlides, currentScripts, currentAudio) => {
    try {
        const payload = {
            project_id: projectId,
            project_data: JSON.stringify({
                fileName: currentFileName || 'Untitled Project',
                slides: currentSlides,
                scripts: currentScripts,
                audioUrls: currentAudio
            })
        };
        const res = await axios.post(`${API_URL}/share`, payload);
        if (!projectId) {
            setProjectId(res.data.share_id);
            window.history.replaceState({}, '', `?project=${res.data.share_id}`);
        }
        return res.data.share_id;
    } catch (err) {
        console.error('Save failed', err);
        return null;
    }
  };

  const handleShareProject = async () => {
    if (shareLink) return;
    setIsSharing(true);
    try {
        const share_id = await saveProject(file?.name, slides, scripts, audioUrls);
        if (share_id) {
            setShareLink(`${window.location.origin}?share=${share_id}`);
        } else {
            setError('Failed to generate share link');
        }
    } finally {
        setIsSharing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files?.[0] || e;
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setLoading(true);
    setError(null);
    setSlides([]);
    setScripts({});
    setAudioUrls({});
    setCurrentSlideIndex(0);
    setProjectId(null);
    window.history.replaceState({}, '', window.location.pathname);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await axios.post(`${API_URL}/upload-ppt`, formData);
      setSlides(res.data.slides);
      setLoading(false);
      setActiveTab('editor');
      
      // Auto-save the new project immediately
      await saveProject(selectedFile.name, res.data.slides, {}, {});
      
      generateAllScripts(res.data.slides);
    } catch (err) {
      setError('Failed to parse presentation. Please ensure it is a valid .pptx file.');
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.pptx')) {
      handleFileUpload(droppedFile);
    }
  };

  const generateAllScripts = async (slidesArray) => {
    setIsGeneratingAll(true);
    let accumulatedContext = "";
    for (let i = 0; i < slidesArray.length; i++) {
       const slide = slidesArray[i];
       try {
         const res = await axios.post(`${API_URL}/generate-script`, {
           text: `Slide ${slide.slide_number} Content:\n${slide.text}\nNotes:\n${slide.notes}`,
           previous_context: accumulatedContext
         });
         const script = res.data.ssml;
         setScripts(prev => ({...prev, [i]: script}));
         accumulatedContext += `\n[Slide ${slide.slide_number} Script:]\n${script}\n`;
       } catch (err) {
         console.error("Error generating script for slide", i, err);
       }
    }
    setIsGeneratingAll(false);
  };

  const generateScript = async (slideIndex) => {
    const slide = slides[slideIndex];
    if (!slide) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/generate-script`, {
        text: `Slide ${slide.slide_number} Content:\n${slide.text}\nNotes:\n${slide.notes}`
      });
      setScripts(prev => ({...prev, [slideIndex]: res.data.ssml}));
    } catch (err) {
      setError('Failed to generate script.');
    } finally {
      setLoading(false);
    }
  };

  const synthesizeAudio = async (slideIndex) => {
    const script = scripts[slideIndex];
    if (!script) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/synthesize`, { ssml: script }, { responseType: 'blob' });
      const audioUrl = URL.createObjectURL(res.data);
      setAudioUrls(prev => ({...prev, [slideIndex]: audioUrl}));
    } catch (err) {
      setError('Failed to synthesize audio.');
    } finally {
      setLoading(false);
    }
  };

  const startPresentation = async () => {
    setIsSynthesizingAll(true);
    let newAudioUrls = {...audioUrls};
    for (let i = 0; i < slides.length; i++) {
        if (!newAudioUrls[i] && scripts[i]) {
            try {
                const res = await axios.post(`${API_URL}/synthesize`, { ssml: scripts[i] }, { responseType: 'blob' });
                newAudioUrls[i] = URL.createObjectURL(res.data);
                setAudioUrls(prev => ({...prev, [i]: newAudioUrls[i]}));
            } catch(e) {}
        }
    }
    setIsSynthesizingAll(false);
    setCurrentSlideIndex(0);
    setIsPresenting(true);
  };

  const currentSlide = slides[currentSlideIndex];
  const scriptCount = Object.keys(scripts).length;
  const audioCount = Object.keys(audioUrls).length;

  // Estimate reading time from script word count
  const currentScript = scripts[currentSlideIndex] || '';
  const wordCount = currentScript.split(/\s+/).filter(Boolean).length;
  const readingMins = Math.floor(wordCount / 150);
  const readingSecs = Math.round((wordCount / 150 - readingMins) * 60);

  if (activeTab === 'home') {
    return <CustomLandingPage onGetStarted={() => setActiveTab('history')} />;
  }

  return (
    <div className="app-container">
      {/* ── TOPBAR ── */}
      <header className="topbar">
        {/* Left: Brand + Project */}
        <div className="topbar-left">
          <div className="topbar-brand">
            <span className="brand-text">Neural Voice</span>
          </div>
          {slides.length > 0 && (
            <div className="topbar-breadcrumb">
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-project">{file?.name?.replace('.pptx','') || 'Untitled'}</span>
              <span className="breadcrumb-badge">Draft</span>
            </div>
          )}
        </div>

        {/* Center: Navigation */}
        <nav className="topbar-nav">
          <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <Grid size={13} /> Home
          </button>
          <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <FileText size={13} /> Dashboard
          </button>
          <button className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <Clock size={13} /> History
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="topbar-right">
          {slides.length > 0 && (
            <>
              <button className="topbar-action-btn" title="Download">
                <Download size={15} />
              </button>
              <button className="topbar-action-btn" title="Share" onClick={() => setIsShareModalOpen(true)}>
                <Share2 size={15} />
              </button>
              <button className="topbar-present-btn" onClick={startPresentation} disabled={isSynthesizingAll || isGeneratingAll}>
                {isSynthesizingAll ? <Loader2 size={13} className="spinner" /> : <Play size={13} />}
                Present
              </button>
              <div className="topbar-divider"></div>
            </>
          )}
          <div className="topbar-avatar" title="Profile">
            <span>S</span>
          </div>
        </div>
      </header>

      {/* ── HISTORY VIEW ── */}
      {activeTab === 'history' ? (
         <main className="history-view">
            <div className="history-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                     <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Your Projects</h2>
                     <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Pick up where you left off</p>
                  </div>
                  <label className="btn-primary" style={{ cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                     <PlusCircle size={15} /> New Presentation
                     <input type="file" accept=".pptx" onChange={handleFileUpload} hidden />
                  </label>
               </div>
               
               {historyLoading ? (
                  <div style={{ textAlign: 'center', marginTop: '5rem' }}><Loader2 size={28} className="spinner" color="var(--accent)" /></div>
               ) : historyData.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '8rem', color: 'var(--text-muted)' }}>
                     <FileText size={48} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                     <p style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--text-main)' }}>No projects found</p>
                     <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Upload a .pptx file to get started.</p>
                  </div>
               ) : (
                  <div className="projects-grid">
                     {historyData.map((proj, i) => (
                        <div 
                           key={proj.id} 
                           className="project-card" 
                           style={{ animationDelay: `${i * 0.05}s` }}
                           onClick={() => {
                              window.history.pushState({}, '', `?project=${proj.id}`);
                              loadSharedProject(proj.id, false);
                              setActiveTab('editor');
                           }}
                        >
                           <div className="project-card-thumb">
                              {proj.image_url ? (
                                 <img src={proj.image_url} alt={proj.file_name} />
                              ) : (
                                 <div className="project-card-placeholder"><FileText size={24} /></div>
                              )}
                           </div>
                           <div className="project-card-info">
                              <h3 className="project-title">{proj.file_name.replace('.pptx','')}</h3>
                              <div className="project-meta">
                                 <span>{proj.slide_count} slides</span>
                                 <span>•</span>
                                 <span>{new Date(proj.created_at).toLocaleDateString()}</span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </main>
      ) : (

      /* ── WORKSPACE ── */
      <main className="workspace-layout">
        {!slides.length ? (
          <div 
            className={`upload-view ${isDragging ? 'dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
             <div className="upload-box">
                <div style={{ 
                  width: '64px', height: '64px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem', border: '1px solid #C7D2FE'
                }}>
                  <Upload size={28} color="#4F46E5" />
                </div>
                <h2 style={{ fontSize: '1.4rem', color: '#111827', marginBottom: '0.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                  Upload Presentation
                </h2>
                <p style={{ color: '#9CA3AF', marginBottom: '1.75rem', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  Drag & drop your .pptx file here, or click to browse.
                </p>
                <label className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.6rem 1.8rem' }}>
                   <Upload size={15} /> Browse Files
                   <input type="file" accept=".pptx" onChange={handleFileUpload} hidden />
                </label>
                {loading && (
                  <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader2 className="spinner" size={22} color="#4F46E5" />
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>Processing slides…</span>
                  </div>
                )}
                {error && (
                  <div style={{ color: '#DC2626', marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 500 }}>
                    <AlertCircle size={15} /> {error}
                  </div>
                )}
             </div>
          </div>
        ) : (
          <>
            {/* ── LEFT PANEL ── */}
            <aside className="left-panel">
               {/* Header */}
               <div className="lp-header">
                  <div style={{ flex: 1, minWidth: 0 }}>
                     <div className="lp-file-name">{file?.name?.replace('.pptx','') || 'Project'}</div>
                     <div className="lp-file-meta">{slides.length} slides</div>
                  </div>
               </div>



               {/* Slides List */}
               <div className="lp-slides-header">
                  <span>Slides</span>
                  {isGeneratingAll && <span className="generating-indicator"><Loader2 size={10} className="spinner" /> AI</span>}
               </div>
               
               <div className="thumbnails-container">

                  {slides.map((s, idx) => (
                    <div 
                       key={idx} 
                       className={`slide-item ${currentSlideIndex === idx ? 'active' : ''}`}
                       onClick={() => setCurrentSlideIndex(idx)}
                    >
                       <div className="slide-item-number">{String(s.slide_number).padStart(2, '0')}</div>
                       <div className="slide-item-thumb">
                          {s.image_url ? (
                             <img src={s.image_url} className="thumbnail-img" alt={`Slide ${s.slide_number}`} />
                          ) : (
                             <div className="slide-item-placeholder">
                                <FileText size={14} color="#A5B4FC" />
                             </div>
                          )}
                       </div>
                       <div className="slide-item-badges">
                          <div className={`slide-badge ${scripts[idx] ? 'done' : ''}`} title={scripts[idx] ? 'Script ready' : 'No script'}>
                             <FileText size={10} />
                          </div>
                          <div className={`slide-badge ${audioUrls[idx] ? 'done audio' : ''}`} title={audioUrls[idx] ? 'Audio ready' : 'No audio'}>
                             <Volume2 size={10} />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               {/* Upload New */}
               {!isViewOnly && (
                 <div className="lp-footer">
                    <label className="lp-upload-btn">
                       <Upload size={13} /> New file
                       <input type="file" accept=".pptx" onChange={handleFileUpload} hidden />
                    </label>
                 </div>
               )}
            </aside>

            {/* ── CENTER CANVAS ── */}
            <section className="center-canvas">
               <div className="slide-card" key={currentSlideIndex}>
                  <div className="slide-dots"><span></span><span></span></div>
                  {currentSlide?.image_url ? (
                     <img src={currentSlide.image_url} alt="Current Slide" className="slide-card-img" />
                  ) : (
                     <>
                        <div className="slide-pill">SLIDE {String(currentSlide?.slide_number).padStart(2,'0')}</div>
                        <h1 className="slide-title">
                           {currentSlide?.text?.slice(0, 60) || 'Future Vision &'}
                           <br/>
                           <span className="slide-title-accent">
                             {currentSlide?.text?.slice(60, 120) || 'Systemic Growth'}
                           </span>
                        </h1>
                        <p className="slide-text">
                           {currentSlide?.text?.slice(0, 150) || "How we align architectural precision with creative potential to deliver sophisticated solutions."}
                        </p>
                     </>
                  )}
               </div>

               {/* Bottom Dock */}
               <div className="bottom-dock-pill">
                  <button className="dock-icon-btn" title="Share" onClick={() => setIsShareModalOpen(true)}><Share2 size={15} /></button>
                  <button className="dock-icon-btn" title="Settings"><Settings size={15} /></button>
                  <button className="dock-icon-btn" title="Previous" onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}>
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ color: '#71717A', fontSize: '0.7rem', fontWeight: 600, padding: '0 4px', userSelect: 'none' }}>
                    {currentSlideIndex + 1}/{slides.length}
                  </span>
                  <button className="dock-icon-btn" title="Next" onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}>
                    <ChevronRight size={16} />
                  </button>
                  <button className="dock-play-btn" onClick={startPresentation} title="Present">
                     {isSynthesizingAll ? <Loader2 size={14} className="spinner" /> : <Play size={14} style={{ marginLeft: '2px' }} />}
                  </button>
               </div>
            </section>

            {/* ── RIGHT PANEL ── */}
            <aside className="right-panel">
               {/* Header */}
               <div className="right-panel-header">
                  <div className="rp-header-top">
                     <div className="rp-title">
                        Scripting
                     </div>
                     <div className="rp-slide-indicator">
                        Slide {String(currentSlide?.slide_number).padStart(2, '0')}
                     </div>
                  </div>
                  <div className="rp-subtitle">
                    {isGeneratingAll 
                      ? <span className="generating-indicator"><Loader2 size={10} className="spinner" /> Generating narratives…</span>
                      : scripts[currentSlideIndex] 
                        ? `${wordCount} words • ${readingMins}:${String(readingSecs).padStart(2,'0')} read time`
                        : 'No script generated yet'
                    }
                  </div>
               </div>

               {/* Scrollable Content */}
               <div className="right-panel-content">

                  {/* Script Editor */}
                  <div className="rp-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                     <div className="rp-script-header">
                        <span className="section-label" style={{ marginBottom: 0 }}>Presentation Script</span>
                        {scripts[currentSlideIndex] && (
                           <span className="rp-word-count">{wordCount} words</span>
                        )}
                     </div>
                     <textarea 
                        className="script-box"
                        value={scripts[currentSlideIndex] || ''}
                        onChange={(e) => setScripts(prev => ({...prev, [currentSlideIndex]: e.target.value}))}
                        placeholder={`"Welcome everyone. Today we're looking at the evolution of this project..."`}
                        disabled={isViewOnly}
                     />
                  </div>

                  {/* AI Generate */}
                  {!isViewOnly && (
                    <div className="rp-section">
                       <button className="dashed-btn" onClick={() => generateScript(currentSlideIndex)} disabled={loading}>
                          {loading ? <Loader2 size={15} className="spinner" /> : <Wand2 size={15} />}
                          <span>{scripts[currentSlideIndex] ? 'Regenerate Script' : 'Generate Script'}</span>
                       </button>
                    </div>
                  )}

                  {/* Audio Section */}
                  <div className="rp-section">
                     <span className="section-label">Audio Output</span>
                     <div className="rp-audio-card">
                        {!isViewOnly && (
                          <button 
                            className="rp-synth-btn" 
                            onClick={() => synthesizeAudio(currentSlideIndex)} 
                            disabled={loading || !scripts[currentSlideIndex]}
                          >
                             <div className="rp-synth-text">
                                <span className="rp-synth-title">
                                   {loading ? <Loader2 size={12} className="spinner" style={{marginRight: '6px'}} /> : null}
                                   {audioUrls[currentSlideIndex] ? 'Re-synthesize' : 'Synthesize Audio'}
                                </span>
                                <span className="rp-synth-desc">Generate TTS from script</span>
                             </div>
                          </button>
                        )}
                        {audioUrls[currentSlideIndex] && (
                           <div className="rp-audio-player">
                              <div className="rp-audio-ready">
                                 <div className="rp-audio-dot"></div>
                                 Audio ready
                              </div>
                              <audio controls src={audioUrls[currentSlideIndex]} className="rp-audio-element" />
                           </div>
                        )}
                     </div>
                     {error && (
                        <div className="rp-error">
                           <AlertCircle size={13} /> {error}
                        </div>
                     )}
                  </div>
               </div>

               {/* Footer */}
               <div className="right-panel-footer">
                  <div className="rp-footer-stat">
                     <Volume2 size={12} />
                     <span>{audioUrls[currentSlideIndex] ? 'Audio ready' : 'No audio'}</span>
                  </div>
                  <div className="rp-footer-stat">
                     <Clock size={12} />
                     <span>{readingMins}:{String(readingSecs).padStart(2,'0')}</span>
                  </div>
               </div>
            </aside>
          </>
        )}
      </main>
      )}

      {/* ── PRESENT MODE ── */}
      {isPresenting && (
         <div className="present-mode" onClick={(e) => { if (e.target === e.currentTarget) setIsPresenting(false); }}>
            <button className="close-present-btn" onClick={() => setIsPresenting(false)}>
               <X size={16} /> Exit
            </button>

            <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 10001 }}>
               <button className="dock-icon-btn" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}>
                  <ChevronLeft size={18} color="white" />
               </button>
               <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', padding: '0 0.5rem' }}>
                  {currentSlideIndex + 1} / {slides.length}
               </span>
               <button className="dock-icon-btn" style={{ background: 'rgba(255,255,255,0.1)' }} onClick={() => {
                  if (currentSlideIndex < slides.length - 1) setCurrentSlideIndex(prev => prev + 1);
                  else setIsPresenting(false);
               }}>
                  <ChevronRight size={18} color="white" />
               </button>
            </div>

            {slides[currentSlideIndex]?.image_url ? (
               <img src={slides[currentSlideIndex].image_url} alt="Slide" style={{ maxWidth: '92%', maxHeight: '85%', objectFit: 'contain', borderRadius: '8px' }} />
            ) : (
               <div style={{ color: 'white', textAlign: 'center', maxWidth: '800px', padding: '2rem' }}>
                  <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                    Slide {slides[currentSlideIndex]?.slide_number}
                  </h1>
                  <p style={{ fontSize: '1.3rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>{slides[currentSlideIndex]?.text}</p>
               </div>
            )}
            {audioUrls[currentSlideIndex] && (
               <audio 
                  autoPlay 
                  src={audioUrls[currentSlideIndex]} 
                  onEnded={() => {
                     if (currentSlideIndex < slides.length - 1) setCurrentSlideIndex(prev => prev + 1);
                     else setIsPresenting(false); 
                  }}
               />
            )}
         </div>
      )}
      {/* ── SHARE MODAL ── */}
      {isShareModalOpen && (
        <div className="share-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsShareModalOpen(false); }}>
          <div className="share-modal">
            <div className="share-header">
              <div className="share-title">
                <div className="share-icon-wrap"><Share2 size={18} /></div>
                Share Project
              </div>
              <button className="share-close-btn" onClick={() => setIsShareModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="share-content">
              <p className="share-desc">Anyone with the link can view this presentation and its generated audio.</p>
              
              {!shareLink ? (
                 <button 
                   className="btn-primary" 
                   style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}
                   onClick={handleShareProject}
                   disabled={isSharing || slides.length === 0}
                 >
                   {isSharing ? <Loader2 size={16} className="spinner" /> : <Link size={16} />}
                   Generate Shareable Link
                 </button>
              ) : (
                <div className="share-link-box">
                  <Link size={14} style={{ color: 'var(--text-muted)' }} />
                  <input type="text" readOnly value={shareLink} className="share-input" />
                  <button 
                    className={`share-copy-btn ${isCopied ? 'copied' : ''}`}
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                  >
                    {isCopied ? "Copied!" : <><Copy size={13} /> Copy</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
