// build.mjs
import { exec } from 'child_process';

exec('vite build', (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Build failed: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`⚠️ stderr: ${stderr}`);
  }
  console.log(`✅ stdout: ${stdout}`);
});
