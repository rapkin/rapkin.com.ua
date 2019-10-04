const path = require('path');
const sizeOf = require('image-size');

module.exports = exports = function renderer({ Marked, _relativeURL }) {
  Marked.image = (href, title, text) => {
    const { width, height } = sizeOf(path.join(__dirname, href))

    return `<div class="lazyload" style="padding-bottom: ${(height / width) *
      100}%" data-bg="url(${href})" title="${text}"><a class="download-link" target="_blank" href="${href}"></a></div>`;
  };

  return Marked;
};
