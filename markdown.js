const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size");

module.exports = exports = function renderer({ Marked, _relativeURL }) {
  Marked.image = (href, title, text) => {
    const { width, height } = sizeOf(path.join(__dirname, href));
    let optHref = href
    if (href[0] === '/') {
      optHref = href.replace('/img/', '/optimized-img/')
      if (!fs.existsSync(path.join(__dirname, optHref))) optHref = href
    }

    return `<div class="lazyload" style="padding-bottom: ${(height / width) *
      100}%" data-bg="url(${optHref})" title="${text}"><a data-no-swup target="_blank" class="download-link" title="Open full image" href="${href}"></a></div>`;
  };

  Marked.link = (href, title, text) => {
    const target = href.match(/^https?:/i)
      ? 'target="_blank" rel="noopener"'
      : "";
    title = title ? `title="${title}"` : "";
    return `<a href="${href}" ${target} ${title}>${text}</a>`;
  };

  return Marked;
};
