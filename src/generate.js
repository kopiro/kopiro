const fs = require("fs");
const path = require("path");
const showdown = require("showdown");
const paths = require("./paths");
const { readDbFile, readMdFile } = require("./data");
const { DevtoList, ProjectsList, GithubList } = require("./mdComponents");

const htmlTag = (tag) => (props) =>
  `<${tag} ${Object.entries(props)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ")} />`;

const htmlTemplate = ({ title, metas, links, lang = "en" }, body) =>
  `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  ${metas.map(htmlTag("meta")).join("\n")}
  ${links.map(htmlTag("link")).join("\n")}
</head>
<body>
${body}
</body>
</html>`;

const renderHtmlApp = (state, markdown) => {
  const converter = new showdown.Converter({
    noHeaderId: true,
    openLinksInNewWindow: true,
    emoji: true,
  });
  converter.setFlavor("github");
  let i = 0;
  const html = converter.makeHtml(markdown).replace(/<h2>/g, () => `${i++ > 0 ? "</section>" : ""}<section><h2>`);
  return htmlTemplate(state, html);
};

const renderMdApp = ({ title, subtitle, description, header, history, github, devto, projects, gpg }) => {
  return `
# ${title}
## ${subtitle}
### ${description.replace(/;/g, "<br/>")}

${header}

## me
${history}

## press
${DevtoList(devto)}

## oss
${GithubList(github)}

## proj
${ProjectsList(projects)}

---

[${gpg}](gpg.txt)
`.trim();
};

const main = async () => {
  const state = {
    title: readMdFile("title"),
    subtitle: readMdFile("subtitle"),
    description: readMdFile("description"),
    header: readMdFile("header"),
    history: readMdFile("history"),
    gpg: readMdFile("gpg"),
    devto: readDbFile("devto"),
    github: readDbFile("github"),
    projects: readDbFile("projects"),
    metas: [
      { name: "author", content: readMdFile("title") },
      { name: "description", content: readMdFile("description") },
      { name: "viewport", content: "width=device-width" },
    ],
    links: [
      { rel: "stylesheet", href: "style.css" },
      { rel: "apple-touch-icon", sizes: "60x60", href: "apple-touch-icon.png" },
      { rel: "icon", sizes: "32x32", type: "image/png", href: "favicon-32x32.png" },
      { rel: "icon", sizes: "16x16", type: "image/png", href: "favicon-16x16.png" },
    ],
  };

  const markdown = await renderMdApp(state);
  fs.writeFileSync(paths.readme, markdown);

  const html = await renderHtmlApp(state, markdown);
  fs.writeFileSync(path.join(paths.public, "index.html"), html);
};

main();
