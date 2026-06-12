const fs = require('fs');

function update(file, replacements) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    fs.writeFileSync(file, content);
}

// 1. Hero.jsx
update('src/LandingPage/components/Hero.jsx', [
    ['export default function Hero() {', 'export default function Hero({ onGetStarted }) {'],
    ['<a href="/app"', '<a href="#" onClick={(e) => { e.preventDefault(); onGetStarted(); }}'],
    ['from Zero to Launched', 'from PPT to Voiceover'],
    ['in Days', 'in Seconds'],
    ['Stop wasting time on boilerplate', 'Stop recording audio manually. Let AI synthesize natural-sounding voiceovers directly from your presentation notes and slides.'],
    ['Start Building Now', 'Get Started for Free'],
    ['text-emerald-500', 'text-orange-500'],
    ['border-emerald-500', 'border-orange-500'],
    ['bg-emerald-500', 'bg-orange-500'],
    ['emerald', 'orange']
]);

// 2. CTA.jsx
update('src/LandingPage/components/CTA.jsx', [
    ['export default function CTA() {', 'export default function CTA({ onGetStarted }) {'],
    ['<a href="/app"', '<a href="#" onClick={(e) => { e.preventDefault(); onGetStarted(); }}'],
    ['Ready to launch your SaaS?', 'Ready to narrate your slides?'],
    ['Stop building the same authentication and billing flows over and over.', 'Turn your PowerPoint files into professional, shareable audio presentations instantly.'],
    ['Get Started Now', 'Start Generating Audio'],
    ['from-emerald-600 to-emerald-400', 'from-orange-600 to-orange-400'],
    ['bg-emerald-500/20', 'bg-orange-500/20'],
    ['emerald', 'orange']
]);

// 3. FloatingNav.jsx
update('src/LandingPage/components/FloatingNav.jsx', [
    ['export default function FloatingNav() {', 'export default function FloatingNav({ onGetStarted }) {'],
    ['<a\n              href="/app"', '<a href="#" onClick={(e) => { e.preventDefault(); onGetStarted(); }}'],
    ['<a href="/app"', '<a href="#" onClick={(e) => { e.preventDefault(); onGetStarted(); }}'],
    ['Get Template', 'Dashboard'],
    ['FastTemplateGen', 'Neural Voice'],
    ['text-emerald-500', 'text-orange-500'],
    ['bg-emerald-600', 'bg-orange-600'],
    ['hover:bg-emerald-700', 'hover:bg-orange-700'],
    ['emerald', 'orange']
]);

// 4. Features.jsx
update('src/LandingPage/components/Features.jsx', [
    ['Everything You Need to Build Fast', 'Everything You Need for Audio Presentations'],
    ['Stop reinventing the wheel. We provide all the standard features out of the box so you can focus on your unique product.', 'Upload, generate, edit, and share. Our pipeline takes your static slides and turns them into engaging audio experiences.'],
    ['emerald', 'orange']
]);

console.log('Copy updated!');
