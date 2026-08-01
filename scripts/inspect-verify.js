const fs = require('fs');
const s = fs.readFileSync('scripts/verify-ui.js', 'utf8');
const lines = s.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
    console.log(String(i + 1).padStart(4, ' '), '|', lines[i]);
}
const targetLine = lines.findIndex(l => l.includes("Product details title"));
if (targetLine >= 0) {
    const line = lines[targetLine];
    console.log('--- char codes for line', targetLine + 1);
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        console.log(i, ch.charCodeAt(0), JSON.stringify(ch));
    }
}