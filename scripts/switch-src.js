const fs = require('fs');
const path = require('path');

// Get the action argument
const action = process.argv[2];

// Validate action
if (action && action !== 'dist-to-src' && action !== 'src-restore') {
  console.error("Invalid argument. Please use 'dist-to-src', 'src-restore' or no argument at all.");
  process.exit(1);
}

// Get all package directories
const packagesDir = path.join(__dirname, '..', 'packages');
const packages = fs.readdirSync(packagesDir).filter(pkg => fs.statSync(path.join(packagesDir, pkg)).isDirectory());

packages.forEach(pkg => {
  const pkgDir = path.join(packagesDir, pkg);
  const srcDir = path.join(pkgDir, 'src');
  const backupSrcDir = path.join(pkgDir, 'src.bak');
  const distDir = path.join(pkgDir, 'dist');

  if (action === 'dist-to-src') {
    // Rename 'src' to 'src.bak' and 'dist' to 'src'
    if (fs.existsSync(srcDir)) {
      const backupDir = path.join(pkgDir, 'src.bak');
      if (!fs.existsSync(backupDir)) {
        fs.renameSync(srcDir, backupDir);
        console.log(`Renamed 'src' to 'src.bak' in ${pkg}`);
      } else {
        console.log(`'src.bak' already exists in ${pkg}. Skipping renaming.`);
      }
    }

    if (fs.existsSync(distDir)) {
      if (!fs.existsSync(srcDir)) {
        fs.renameSync(distDir, srcDir);
        console.log(`Renamed 'dist' to 'src' in ${pkg}`);
      } else {
        console.log(`'src' already exists in ${pkg}. Skipping renaming.`);
      }
    }
  } else if (action === 'src-restore') {
    // Rename 'src.bak' back to 'src'
    if (fs.existsSync(backupSrcDir)) {
      if (!fs.existsSync(srcDir)) {
        fs.renameSync(backupSrcDir, srcDir);
        console.log(`Renamed 'src.bak' to 'src' in ${pkg}`);
      } else {
        console.log(`'src' already exists in ${pkg}. Skipping renaming.`);
      }
    } else {
      console.log(`'src.bak' does not exist in ${pkg}. Skipping.`);
    }
  } else {
    console.log('No action taken. Please provide a valid argument.');
  }
});
