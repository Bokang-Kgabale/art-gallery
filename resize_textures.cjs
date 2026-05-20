const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function processImages() {
  const dir = path.join(__dirname, 'public');
  // Match any png file that has 4K-PNG in its name
  const files = glob.sync(`${dir}/**/*4K-PNG*.png`);
  
  for (const file of files) {
    const filename = path.basename(file, '.png');
    // Skip if it already ends in _2K
    if (filename.endsWith('_2K')) continue;

    const outPath = path.join(path.dirname(file), `${filename}_2K.jpg`);
    
    // Skip if the jpg already exists
    if (fs.existsSync(outPath)) {
      console.log(`Skipping ${filename}, already exists.`);
      continue;
    }

    console.log(`Processing ${filename}...`);
    try {
      await sharp(file)
        .resize(2048, 2048, { fit: 'inside' })
        .jpeg({ quality: 80 })
        .toFile(outPath);
      console.log(`Created ${outPath}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

processImages().catch(console.error);
