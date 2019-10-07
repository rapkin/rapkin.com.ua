const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const glob = require("glob");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

const images = path.join(__dirname, "assets/img/*.{jpg,jpeg,png}");
let outputDir = path.join(__dirname, "assets/optimized-img/");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const toSize = b => {
  const kb = b / 1024;
  if (kb < 1024) return kb.toFixed(1) + "Kb";
  return (kb / 1024).toFixed(1) + "Mb";
};

const resizeImages = () =>
  new Promise((resolve, reject) => {
    glob(images, async (err, files) => {
      const resized = await Promise.all(
        files.map(async inputFile => {
          const optimizedFile = path.join(outputDir, path.basename(inputFile));

          await sharp(inputFile)
            .resize({ width: 960, withoutEnlargement: true })
            .toFile(optimizedFile);
          return optimizedFile;
        })
      );
      resolve(resized.filter(f => f));
    });
  });

const optimize = async () => {
  const toOptimize = await resizeImages();
  const files = await imagemin(toOptimize, {
    destination: outputDir,
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8]
      })
    ]
  });
  console.table(
    files.map(f => ({ file: f.destinationPath, size: toSize(f.data.length) }))
  );
};

optimize();
