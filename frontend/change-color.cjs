const fs = require('fs');

let css = fs.readFileSync('src/App.css', 'utf-8');

const replacements = {
  '#4F46E5': '#DE7356',
  '#4338CA': '#C8634A',
  '#EEF2FF': '#FCEEEA',
  'rgba(79, 70, 229': 'rgba(222, 115, 86',
  '#6366F1': '#E2876D',
  '#7C3AED': '#E79E86',
  '#A78BFA': '#F0C0B0',
  'rgba(99, 102, 241': 'rgba(226, 135, 109',
  'rgba(167, 139, 250': 'rgba(240, 192, 176',
  '#3730A3': '#A65640',
  '#312E81': '#8D4936',
  '#A5B4FC': '#F0C0B0',
  '#C7D2FE': '#F6DED6',
  '#818CF8': '#E69F8B',
  'rgba(124, 58, 237': 'rgba(231, 158, 134'
};

for (const [key, value] of Object.entries(replacements)) {
  css = css.split(key).join(value);
  // Also handle case-insensitive for hex
  if (key.startsWith('#')) {
    css = css.split(key.toLowerCase()).join(value);
  }
}

fs.writeFileSync('src/App.css', css);
console.log('App.css updated with #DE7356 accent color!');
