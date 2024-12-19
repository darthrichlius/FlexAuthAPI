const esbuild = require("esbuild");
const { nodeExternalsPlugin } = require("esbuild-node-externals");
const fs = require("fs");
const path = require("path");

// Define the packages directory
const packagesDir = path.join(__dirname, "packages");

// Find all package directories
const packages = fs.readdirSync(packagesDir).filter((dir) => {
  const fullPath = path.join(packagesDir, dir);
  return fs.statSync(fullPath).isDirectory();
});

// Build each package
packages.forEach((pkg) => {
  const inputDir = path.join(packagesDir, pkg);
  const outputDir = path.join(inputDir, "dist"); // Output in package's dist folder

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Load the package.json file to detect entry points
  const packageJsonPath = path.join(inputDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.warn(`No package.json found for ${pkg}. Skipping...`);
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  // Collect entry points from both main and exports (if present)
  let entryPoints = [];

  if (packageJson.main) {
    entryPoints.push(path.join(inputDir, packageJson.main)); // Default main entry point
  }

  if (packageJson.exports) {
    // Add entry points from the `exports` field
    if (typeof packageJson.exports === "object") {
      // For complex export objects, we want to check the conditions
      Object.keys(packageJson.exports).forEach((key) => {
        const exportPath = packageJson.exports[key];
        if (typeof exportPath === "string") {
          entryPoints.push(path.join(inputDir, exportPath)); // Handle simple exports
        } else if (exportPath.import) {
          entryPoints.push(path.join(inputDir, exportPath.import)); // Handle import condition
        }
      });
    } else if (typeof packageJson.exports === "string") {
      // Handle simple string export (for example, exports: "./index.js")
      entryPoints.push(path.join(inputDir, packageJson.exports));
    }
  }

  if (entryPoints.length === 0) {
    console.warn(`No entry points found for ${pkg}. Skipping...`);
    return;
  }

  esbuild
    .build({
      entryPoints: entryPoints,
      bundle: true, // Must bundle to use external
      platform: "node",
      minify: true,
      sourcemap: false,
      target: "node18",
      legalComments: "none",
      outdir: outputDir,
      external: [
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.peerDependencies || {}),
      ],
      plugins: [nodeExternalsPlugin()], // Exclude node_modules and workspace dependencies
      logLevel: "info",
    })
    .then(() => console.log(`Build completed for package: ${pkg}`))
    .catch((err) => {
      console.error(`Failed to build package: ${pkg}`, err);
      process.exit(1);
    });
});
