const showdown = require("showdown");
const { readPartial } = require("./data");

const converter = new showdown.Converter({
  noHeaderId: true,
  openLinksInNewWindow: true,
  emoji: true,
});
converter.setFlavor("github");

const escapeHtml = (str) => str.replace(/[<>"']/g, encodeURIComponent);

const htmlTag = (tag) => (props) =>
  `<${tag} ${Object.entries(props)
    .map(([k, v]) => `${k}="${escapeHtml(v).replace("<br/>", " - ")}"`)
    .join(" ")} />`;

const htmlTemplate = ({ title, metas, links, bodyClass, lang = "en" }, body) =>
  `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<title>${title}</title>
${metas.map(htmlTag("meta")).join("\n")}
${links.map(htmlTag("link")).join("\n")}
</head>
<body class="${bodyClass}">
${readPartial("menu.html")}
${body}
${readPartial("gtag.html")}
</body>
</html>`;

const baseState = {
  metas: [
    { name: "author", content: readPartial("title.md") },
    { name: "viewport", content: "width=device-width" },
  ],
  links: [{ rel: "stylesheet", href: `/style.css` }],
  gtag: readPartial("gtag.html"),
  footer: readPartial("footer.md"),
};

const deepMerge = (a, b) => {
  const result = { ...a };
  Object.keys(b).forEach((key) => {
    if (Array.isArray(b[key])) {
      result[key] = [...(a[key] || []), ...b[key]];
    } else if (typeof b[key] === "object" && b[key] !== null) {
      result[key] = deepMerge(a[key], b[key]);
    } else {
      result[key] = b[key];
    }
  });
  return result;
};

const renderBaseMd = (_state, md) => {
  const state = deepMerge(baseState, _state || {});
  const { footer } = state;
  return `${md}\n\n${footer}`.trim();
};

const renderBaseHtmlFromMd = (_state, md) => {
  const state = deepMerge(baseState, _state || {});
  const baseHtml = converter.makeHtml(md);
  const html = htmlTemplate(state, baseHtml);
  return html.replace(/\.md/g, ".html");
};

module.exports = { renderBaseMd, renderBaseHtmlFromMd };
