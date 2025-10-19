const sharp = require('sharp');
const path = require('path');

const logoPath = path.join(__dirname, '../public/newlogo.png');
const outputPath = path.join(__dirname, '../public/newlogo_enlarged.png');

async function enlargeLogo() {
  try {
    // Read the original image
    const image = sharp(logoPath);
    const metadata = await image.metadata();
    
    console.log(`📏 Original size: ${metadata.width}x${metadata.height}`);
    
    // Trim transparent edges and add minimal padding
    await image
      .trim()
      .extend({
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(outputPath);
    
    const newMetadata = await sharp(outputPath).metadata();
    console.log(`✅ Enlarged logo created: ${newMetadata.width}x${newMetadata.height}`);
    console.log(`📁 Saved as: newlogo_enlarged.png`);
    console.log(`\n💡 To use this version:`);
    console.log(`   1. Rename newlogo.png to newlogo_backup.png`);
    console.log(`   2. Rename newlogo_enlarged.png to newlogo.png`);
    console.log(`   3. Run: npm run generate:favicon`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

enlargeLogo();
