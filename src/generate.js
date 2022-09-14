const fs = require("fs");
const path = require("path");
const showdown = require("showdown");
const paths = require("./paths");
const { readDbFile, readMdFile } = require("./data");
const { DevtoList, ProjectsList, GithubList } = require("./mdComponents");

const htmlTag = (tag) => (props) =>
  `<${tag} ${Object.entries(props)
    .map(([k, v]) => `${k}="${v.replace("<br/>", " - ")}"`)
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

const renderMdApp = ({ title, description, header, work, github, devto, projects, gpg }) => {
  return `
# ${title}
### ${description}

${header}

## work
${work}

## oss
${GithubList(github)}

## press
${DevtoList(devto)}

## proj
${ProjectsList(projects)}

---

${gpg}
`.trim();
};

const main = async () => {
  const state = {
    title: readMdFile("title"),
    description: readMdFile("description"),
    header: readMdFile("header"),
    work: readMdFile("work"),
    gpg: readMdFile("gpg"),
    devto: readDbFile("devto"),
    github: readDbFile("github"),
    projects: readDbFile("projects"),
    metas: [
      { name: "author", content: readMdFile("title") },
      { name: "description", content: readMdFile("description") },
      { name: "viewport", content: "width=device-width" },
    ],
    links: [{ rel: "stylesheet", href: `style.css?t=${Date.now()}` }],
  };

  const markdown = renderMdApp(state);
  const html = renderHtmlApp(state, markdown);

  fs.writeFileSync(paths.readme, markdown);
  fs.writeFileSync(path.join(paths.public, "index.html"), html);
};

main();
