const fs = require('fs');
const path = require('path');
const dir = 'src/LandingPage/components';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
        let filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Replace next/image
        content = content.replace(/import Image from [\'\"]next\/image[\'\"];?\n/g, '');
        content = content.replace(/<Image/g, '<img');

        // Replace next/link
        content = content.replace(/import Link from [\'\"]next\/link[\'\"];?\n/g, '');
        content = content.replace(/<Link/g, '<a');
        content = content.replace(/<\/Link>/g, '</a>');

        // Remove 'use client'
        content = content.replace(/[\'\"]use client[\'\"];?\n/g, '');

        fs.writeFileSync(filePath, content);
    }
});
console.log('Processed components');
