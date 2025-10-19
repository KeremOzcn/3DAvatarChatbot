const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Check if newlogo.png exists
const logoPath = path.join(__dirname, '../public/newlogo.png');
const publicPath = path.join(__dirname, '../public');

if (!fs.existsSync(logoPath)) {
  console.error('❌ Error: newlogo.png not found in public folder!');
  console.log('📝 Please add newlogo.png to the public folder first.');
  process.exit(1);
}

console.log('✅ Found newlogo.png');
console.log('📋 Generating favicon files with proper sizes...');

// Define favicon sizes
const faviconSizes = [
  { file: 'favicon-16x16.png', size: 16 },
  { file: 'favicon-32x32.png', size: 32 },
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'android-chrome-192x192.png', size: 192 },
  { file: 'android-chrome-384x384.png', size: 384 },
  { file: 'mstile-150x150.png', size: 150 }
];

let successCount = 0;

// Generate each favicon size
async function generateFavicons() {
  for (const { file, size } of faviconSizes) {
    try {
      const destPath = path.join(publicPath, file);
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(destPath);
      console.log(`✅ Created ${file} (${size}x${size})`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to create ${file}:`, error.message);
    }
  }

  // Generate favicon.ico (32x32 is standard)
  try {
    const icoPath = path.join(publicPath, 'favicon.ico');
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(icoPath);
    console.log(`✅ Created favicon.ico (32x32)`);
    successCount++;
  } catch (error) {
    console.error(`❌ Failed to create favicon.ico:`, error.message);
  }

  console.log(`\n🎉 Done! Created ${successCount}/${faviconSizes.length + 1} favicon files.`);
  console.log('💡 All favicons generated with proper sizes and transparency.');
  console.log('🔄 Restart your dev server (npm run dev) to see changes.');
}

generateFavicons().catch(console.error);
