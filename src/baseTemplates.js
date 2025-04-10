const showdown = require("showdown");
const { readPartial } = require("./data");

const converter = new showdown.Converter({
  noHeaderId: true,
  openLinksInNewWindow: true,
  emoji: true,
});
converter.setFlavor("github");

const htmlTag = (tag) => (props) =>
  `<${tag} ${Object.entries(props)
    .map(([k, v]) => `${k}="${v.replace("<br/>", " - ")}"`)
    .join(" ")} />`;

const htmlTemplate = ({ title, metas, links, gtag, bodyClass, lang = "en" }, body) =>
  `<!DOCTYPE html>
<html lang="${lang}">
  <head>
	<meta charset="utf-8" />
	<title>${title}</title>
	${metas.map(htmlTag("meta")).join("\n")}
	${links.map(htmlTag("link")).join("\n")}
</head>
<body class="${bodyClass}">
	${body}
	${gtag}
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

const renderBaseMd = (_state, md) => {
  const state = { ...baseState, ..._state };
  const { footer } = state;
  return `${md}\n\n${footer}`.trim();
};

const renderBaseHtmlFromMd = (_state, md) => {
  const state = { ...baseState, ..._state };
  const baseHtml = converter.makeHtml(md);
  const html = htmlTemplate(state, baseHtml);
  return html;
};

module.exports = { renderBaseMd, renderBaseHtmlFromMd };
