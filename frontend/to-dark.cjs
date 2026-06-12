const fs = require('fs');

let css = fs.readFileSync('src/App.css', 'utf8');

// Color mapping for dark theme
const replacements = [
  // CSS Variables
  ['--bg-topbar: #18181B;', '--bg-topbar: #000000;'],
  ['--bg-app: #F4F5F7;', '--bg-app: #09090B;'],
  ['--bg-panel: #FFFFFF;', '--bg-panel: #18181B;'],
  ['--bg-panel-right: #FFFFFF;', '--bg-panel-right: #18181B;'],
  ['--border-light: #E2E4E9;', '--border-light: #27272A;'],
  ['--text-main: #111827;', '--text-main: #F4F5F7;'],
  ['--text-muted: #6B7280;', '--text-muted: #A1A1AA;'],
  
  // Specific backgrounds and gradients
  ['background-color: #EDEEF2;', 'background-color: #09090B;'],
  ['#D4D5DA', '#27272A'], // dot grid
  ['background: #ffffff;', 'background: #18181B;'],
  ['background-color: #ffffff;', 'background-color: #18181B;'],
  ['background: #F9FAFB;', 'background: #121214;'],
  ['background-color: #F9FAFB;', 'background-color: #121214;'],
  ['background: #FAFBFC;', 'background: #121214;'],
  ['background: linear-gradient(180deg, #FAFBFF 0%, #FFFFFF 100%);', 'background: linear-gradient(180deg, #1A1A1F 0%, #18181B 100%);'],
  
  // Slide card and upload box
  ['background: #F8F9FB;', 'background: #121214;'],
  
  // Text colors for slide title
  ['color: #111827;', 'color: #F4F5F7;'],
  ['color: #374151;', 'color: #D4D4D8;'],
  
  // Light purple elements
  ['background: linear-gradient(145deg, #EEF2FF, #E0E7FF);', 'background: linear-gradient(145deg, #3730A3, #312E81);'],
  ['background: linear-gradient(135deg, #EEF2FF, #E0E7FF);', 'background: linear-gradient(135deg, #3730A3, #312E81);'],
  ['border-color: #A5B4FC;', 'border-color: #4F46E5;'],
  ['border: 1px solid #C7D2FE;', 'border: 1px solid #4338CA;'],
  ['border: 2px dashed #C7D2FE;', 'border: 2px dashed #4338CA;'],
  ['background: var(--accent-light);', 'background: rgba(79, 70, 229, 0.15);'],
  ['background: #F3F4F6;', 'background: #27272A;'],
  ['background: linear-gradient(145deg, #F3F4F6, #E5E7EB);', 'background: linear-gradient(145deg, #27272A, #3F3F46);'],
  ['border: 1px solid #E5E7EB;', 'border: 1px solid #3F3F46;'],
  ['background: #E5E7EB;', 'background: #3F3F46;'],
  ['background-color: #D1D5DB;', 'background-color: #3F3F46;'],
  ['background: #D1D5DB;', 'background: #3F3F46;'],
  ['border: 1px dashed #D1D5DB;', 'border: 1px dashed #3F3F46;'],
  
  // Topbar tweak
  ['background: linear-gradient(180deg, #1A1A1F 0%, #18181B 100%);', 'background: linear-gradient(180deg, #09090B 0%, #000000 100%);'],
  
  // History view
  ['background: #ffffff;', 'background: #18181B;'],
  
  // Placeholder colors
  ['color: #C4C9D2;', 'color: #52525B;'],
  
  // Remove shadows that don't look good on dark
  ['box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);', 'box-shadow: none;'],
];

for (const [search, replace] of replacements) {
  css = css.split(search).join(replace);
}

fs.writeFileSync('src/App.css', css, 'utf8');
console.log('App.css converted to dark theme');
