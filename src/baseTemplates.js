const showdown = require("showdown");
const { readPartial } = require("./utils");

const converter = new showdown.Converter({
  openLinksInNewWindow: true,
  emoji: true,
});
converter.setFlavor("github");

const escapeHtml = (str) => str.replace(/[<>"']/g, encodeURIComponent);

const htmlTag = (tag) => (props) =>
  `<${tag} ${Object.entries(props)
    .map(([k, v]) => `${k}="${escapeHtml(v).replace("<br/>", " - ")}"`)
    .join(" ")} />`;

const htmlTemplate = ({ title, metas, bodyClass, lang = "en" }, body) =>
  `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<link rel="stylesheet" href="/style.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css" />
<script src="/script.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
${Object.values(metas)
  .map(({ name, content }) => htmlTag("meta")({ name, content }))
  .join("\n")}
</head>
<body class="${bodyClass}">
${readPartial("header.html")}
<div id="content">
${body}
</div>
${readPartial("footer.html")}
</body>
</html>`;

const baseState = {
  metas: {
    author: { name: "author", content: readPartial("title.md") },
    viewport: { name: "viewport", content: "width=device-width" },
    ogImage: { name: "og:image", content: "/img/avatar.jpg" },
  },
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

const renderMd = (_state, markdownContent) => {
  return markdownContent.trim();
};

const renderHtmlFromMd = (_state, markdownContent) => {
  const state = deepMerge(baseState, _state || {});

  // For each {% embed %} tag, replace it with the content of the file
  const embeds = markdownContent.match(/{% embed (.*?) %}/g);
  if (embeds) {
    embeds.forEach((embed) => {
      const file = embed.replace(/{% embed (.*?) %}/, "$1");
      if (file.startsWith("https://gist.github.com")) {
        // Replace with https://gist.github.com/kopiro/7b77b2a6d3dfc2c5359ff0f25667747b.js
        markdownContent = markdownContent.replace(embed, `<script src="${file}.js"></script>`);
      }
    });
  }

  const html = converter.makeHtml(markdownContent);
  return htmlTemplate(state, html);
};

module.exports = { renderMd, renderHtmlFromMd };
