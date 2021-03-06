const fs = require("fs")
const path = require("path")
const util = require('util')
const sharp = require("sharp")
const glob = require("glob")
const imagemin = require("imagemin")
const imageminJpegtran = require("imagemin-jpegtran")
const imageminPngquant = require("imagemin-pngquant")

const exists = util.promisify(fs.exists)

const images = path.join(__dirname, "assets/img/*.{jpg,jpeg,png}")
let outputDir = path.join(__dirname, "assets/optimized-img/")

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

const toSize = b => {
  const kb = b / 1024
  if (kb < 1024) return kb.toFixed(1) + "Kb"
  return (kb / 1024).toFixed(1) + "Mb"
}

const resizeImages = () =>
  new Promise((resolve, reject) => {
    glob(images, async (err, files) => {
      const resized = []
      for (const inputFile of files) {
        const optimizedFile = path.join(outputDir, path.basename(inputFile))
        const previewFile = path.join(outputDir, 'preview_' + path.basename(inputFile))
        const [existsOptimized, existsPreview] = await Promise.all([exists(optimizedFile), exists(previewFile)])

        if (existsPreview && existsOptimized) continue
        console.log('handle image', inputFile)

        const transformed = []

        if (!existsOptimized) {
          console.log('generate', inputFile)
          await sharp(inputFile)
            .resize({ width: 960, height: 2000, fit: sharp.fit.inside, withoutEnlargement: true })
            .toFile(optimizedFile)
          transformed.push(optimizedFile)
          console.log('done', inputFile)
        }

        if (!existsPreview) {
          console.log('generate preview', inputFile)
          await sharp(inputFile)
            .resize({
              width: 200,
              height: 200,
              fit: sharp.fit.cover
            })
            .toFile(previewFile)
          transformed.push(previewFile)
          console.log('done preview', inputFile)
        }

        resized.push(transformed)
      }
      resolve(resized.flat().filter(f => f))
    })
  })

const optimize = async () => {
  try {
    const toOptimize = await resizeImages()
    const files = await imagemin(toOptimize, {
      destination: outputDir,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    })
    console.table(
      files.map(f => ({ file: f.destinationPath, size: toSize(f.data.length) }))
    )
  } catch (e) {
    console.error('Failed to build images', e)
  }
}

optimize()
