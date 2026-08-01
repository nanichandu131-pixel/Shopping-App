const fs = require('fs');
const s = fs.readFileSync('backend/src/scripts/seed.js', 'utf8');
const lines = s.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
    if (i >= 120 && i <= 145) console.log(String(i + 1).padStart(4, ' '), '|', lines[i]);
}
const target = lines.findIndex(l => l.includes('const basePrice'));
console.log('target line index', target + 1);
if (target >= 0) {
    const line = lines[target];
    for (let i = 0; i < line.length; i++) console.log(i, line.charCodeAt(i), JSON.stringify(line[i]));
}