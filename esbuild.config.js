const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const { sentryEsbuildPlugin } = require("@sentry/esbuild-plugin");

// Define the root packages directory
const packagesDir = path.join(__dirname, "packages");

// Find all package directories
const packages = fs.readdirSync(packagesDir).filter((dir) => {
  const fullPath = path.join(packagesDir, dir);
  return fs.statSync(fullPath).isDirectory();
});

// Function to get all files recursively in a directory
function getAllFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) =>
    entry.isDirectory()
      ? getAllFiles(path.join(dir, entry.name))
      : path.join(dir, entry.name)
  );
}

// Build each package
packages.forEach((pkg) => {
  const inputDir = path.join(packagesDir, pkg, "src");
  const outputDir = path.join(packagesDir, pkg, "dist");

  // Ensure the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Check if src folder exists
  if (!fs.existsSync(inputDir)) {
    console.warn(`No src directory found for ${pkg}. Skipping...`);
    return;
  }

  // Get all source files (only .js and .ts files)
  const sourceFiles = getAllFiles(inputDir).filter((file) =>
    /\.(js|ts)$/.test(file)
  );

  sourceFiles.forEach((file) => {
    const relativePath = path.relative(inputDir, file); // Relative to src folder
    const outputFile = path.join(outputDir, relativePath); // Target path in dist

    // Ensure target directories exist
    const outputDirPath = path.dirname(outputFile);
    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true });
    }

    // Build the file with esbuild
    esbuild
      .build({
        entryPoints: [file],
        outfile: outputFile,
        platform: "node",
        // Because it is required by Sentry
        bundle: true,
        minify: true,
        sourcemap: false,
        target: "node18",
        legalComments: "none",
        plugins: [
          // Put the Sentry esbuild plugin after all other plugins
          sentryEsbuildPlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: "rd-of",
            project: "fastmicroservices-auth-abstract",
          }),
        ],
        loader: {
          ".html": "file", // Add this line to handle .html files
        },
      })
      .then(() => console.log(`Built: ${pkg}/${relativePath}`))
      .catch((err) => {
        console.error(`Failed to build ${pkg}/${relativePath}`, err);
        process.exit(1);
      });
  });
});
