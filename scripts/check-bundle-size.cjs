const fs = require('node:fs');
const path = require('node:path');

const outputDirectory = path.resolve(process.argv[2] || 'dist-ci');
const maximumBundleBytes = 5 * 1024 * 1024;

const files = [];
const visit = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(absolutePath);
    else files.push(absolutePath);
  }
};

if (!fs.existsSync(outputDirectory)) {
  throw new Error(`Bundle output does not exist: ${outputDirectory}`);
}

visit(outputDirectory);
const bundles = files.filter((file) => /\.(hbc|js)$/.test(file));
if (bundles.length === 0) {
  throw new Error(`No JavaScript or Hermes bundle was found in ${outputDirectory}`);
}

const oversized = bundles
  .map((file) => ({ file, bytes: fs.statSync(file).size }))
  .filter(({ bytes }) => bytes > maximumBundleBytes);

if (oversized.length > 0) {
  const details = oversized
    .map(({ file, bytes }) => `${path.relative(outputDirectory, file)}: ${(bytes / 1024 / 1024).toFixed(2)} MB`)
    .join(', ');
  throw new Error(`Android bundle exceeds the 5 MB budget: ${details}`);
}

const largest = bundles
  .map((file) => ({ file, bytes: fs.statSync(file).size }))
  .sort((left, right) => right.bytes - left.bytes)[0];
console.log(
  `Android bundle budget passed: ${path.relative(outputDirectory, largest.file)} `
  + `is ${(largest.bytes / 1024 / 1024).toFixed(2)} MB.`,
);
