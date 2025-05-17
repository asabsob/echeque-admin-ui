import { execSync } from 'child_process';

try {
  execSync('npx vite build', { stdio: 'inherit' });
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
