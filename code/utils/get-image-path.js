const fs = require("fs");
const path = require("path");

module.exports = (original, withDomain = false) => {
    if (!original) return null
    const domain = withDomain ? 'https://rapkin.com.ua' : ''
    let opt = original
    if (original[0] === "/") {
      opt = original.replace("/img/", "/optimized-img/");
      if (!fs.existsSync(path.join(__dirname, '../..', opt))) opt = original;
    }
    return domain + opt
}
