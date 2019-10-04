const path = require('path');
const sizeOf = require('image-size');

module.exports = exports = function renderer({ Marked, _relativeURL }) {
  Marked.image = (href, title, text) => {
    const { width, height } = sizeOf(path.join(__dirname, href))

    return `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3C/svg%3E" data-src="${href}" alt="${text}" />`;
  };

  return Marked;
};
