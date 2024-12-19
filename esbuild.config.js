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
  const entryPoint = packageJson.main || "index.js"; // Default to index.js if main is not defined

  const entryFile = path.join(inputDir, entryPoint);
  if (!fs.existsSync(entryFile)) {
    console.warn(`No entry file found for ${pkg}. Skipping...`);
    return;
  }

  esbuild
    .build({
      entryPoints: [entryFile],
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
