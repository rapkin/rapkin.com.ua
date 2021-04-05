const getImagePath = require('./code/utils/get-image-path')
const sizeOf = require("image-size");
const path = require('path')

module.exports = exports = function renderer({ Marked, _relativeURL }) {
  Marked.image = (href, title, text) => {
    const { width, height } = sizeOf(path.join(__dirname, href));

    return `<div class="lazyload" style="padding-bottom: ${(height / width) *
      100}%" data-bg="url(${getImagePath(href)})" title="${text}"><a data-no-swup target="_blank" class="download-link" title="Open full image" href="${href}"></a></div>`;
  };

  Marked.link = (href, title, text) => {
    const target = href.match(/^https?:/i)
      ? 'target="_blank" rel="noopener noreferrer"'
      : "";
    title = title ? `title="${title}"` : "";
    return `<a href="${href}" ${target} ${title}>${text}</a>`;
  };

  return Marked;
};
