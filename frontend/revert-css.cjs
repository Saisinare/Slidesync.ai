const fs = require('fs');
const path = 'src/App.css';
let css = fs.readFileSync(path, 'utf-8');

// Revert main CSS variables
css = css.replace(/--accent: #6BBF59;/gi, '--accent: #DE7356;');
css = css.replace(/--accent-hover: #5CA64C;/gi, '--accent-hover: #C8634A;');
css = css.replace(/--accent-light: #F0F9ED;/gi, '--accent-light: #FCEEEA;');
css = css.replace(/--accent-glow: rgba\(107, 191, 89, 0.15\);/g, '--accent-glow: rgba(222, 115, 86, 0.15);');

// Replace hardcoded gradients and shadows
css = css.replace(/#6BBF59/gi, '#DE7356');
css = css.replace(/#84D172/gi, '#E79E86');
css = css.replace(/#5CA64C/gi, '#C8634A');
css = css.replace(/rgba\(107, 191, 89,/g, 'rgba(222, 115, 86,');

fs.writeFileSync(path, css);
console.log('Colors reverted to orange theme!');
