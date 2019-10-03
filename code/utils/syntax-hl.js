import _ from "lodash";
import hljs from "highlight.js";

export const highlightSyntax = html => {
  const r = /<code class="language-(.+?)">((.|\n)+?)(<\/code>)/gm;
  const toReplace = [];
  let m;
  do {
    m = r.exec(html);
    if (m) {
      const [str, lang, code] = m;
      toReplace.push([str, lang, code]);
    }
  } while (m);
  for (let [str, lang, code] of toReplace) {
    code = hljs.highlight(lang, _.unescape(code)).value;
    html = html.replace(
      str,
      `<code data-lang="${lang}" class="hljs">${code}</code>`
    );
  }
  return html;
};

export default body => {
  body.props.dangerouslySetInnerHTML.__html = highlightSyntax(
    body.props.dangerouslySetInnerHTML.__html
  );
  return body;
};
