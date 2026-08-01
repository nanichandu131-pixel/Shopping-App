import fs from 'fs';
import path from 'path';

const root = path.resolve(new URL(
    import.meta.url).pathname, '..', '..');
const frontendDist = path.join(root, 'frontend', 'dist');
const target = path.join(root, 'backend', 'frontend-dist');

async function copyDir(src, dest) {
    await fs.promises.rm(dest, { recursive: true, force: true });
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) await copyDir(srcPath, destPath);
        else await fs.promises.copyFile(srcPath, destPath);
    }
}

async function main() {
    try {
        const exists = await fs.promises.stat(frontendDist).then(() => true).catch(() => false);
        if (!exists) {
            console.error('Frontend dist not found. Run `npm run build --workspace frontend` first.');
            process.exit(2);
        }
        console.log('Embedding frontend/dist into backend/frontend-dist...');
        await copyDir(frontendDist, target);
        console.log('Done. You can now build the backend image which will include the frontend.');
    } catch (err) {
        console.error('Failed to embed frontend:', err);
        process.exit(1);
    }
}

main();