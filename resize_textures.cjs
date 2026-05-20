const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function processImages() {
  const folders = ['Concrete044D_4K-PNG', 'Ground054_4K-PNG'];
  for (const folder of folders) {
    const dir = path.join(__dirname, 'public', 'textures', folder);
    const files = glob.sync(`${dir}/*.png`);
    
    for (const file of files) {
      const filename = path.basename(file, '.png');
      const outPath = path.join(dir, `${filename}_2K.jpg`);
      
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
}

processImages().catch(console.error);
