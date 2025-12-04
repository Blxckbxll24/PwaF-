// Script opcional para optimizar imágenes grandes
// Instalar sharp: npm install --save-dev sharp

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const publicDir = path.join(__dirname, '../public')
const largeImages = [
  'Desktop_3.png',
  'W4 - GR W15 Blueprint.jpg',
  'Singapore GP 2025 Desktop Wallpaper 4.jpg'
]

async function optimizeImages() {
  for (const imageName of largeImages) {
    const inputPath = path.join(publicDir, imageName)
    const outputPath = path.join(publicDir, `optimized-${imageName}`)
    
    if (fs.existsSync(inputPath)) {
      try {
        await sharp(inputPath)
          .resize(1920, 1080, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .jpeg({ 
            quality: 85,
            progressive: true 
          })
          .toFile(outputPath.replace(/\.(png|jpg|jpeg)$/i, '.jpg'))
        
        console.log(`Optimizada: ${imageName}`)
      } catch (error) {
        console.error(`Error optimizando ${imageName}:`, error)
      }
    }
  }
}

optimizeImages()
