const fs = require('fs');
const path = require('path');
const sharp = require("sharp");
const glob = require("glob");

let outputDir = path.join(__dirname, "assets/optimized-img/")

const toSize = (b) => {
  const kb = Math.round(b / 1024)
  if (kb < 1024) return kb + 'Kb'
  return Math.round(kb / 1024) + 'Mb'
}

glob(path.join(__dirname, "assets/img/*.{jpg,jpeg,png}"), (err, files) =>
  if (!f) files.forEach(inputFile =>
    sharp(inputFile)
      .resize({ width: 960, withoutEnlargement: true })
      .jpeg({ progressive: true, quality: 50, force: false })
      .png({
        progressive: true,
        quality: 50,
        adaptiveFiltering: true,
        palette: true,
        colors: 64,
        force: false
      })
      .toFile(path.join(outputDir, path.basename(inputFile)))
      .then(function(newFileInfo) {
        console.log("Success", inputFile, toSize(newFileInfo.size));
      })
      .catch(function(err) {
        console.error(err);
      })
  )
);
