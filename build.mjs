import { execSync } from 'child_process';

try {
  console.log('Running Vite build via npx...');
  execSync('npx vite build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
