const fs = require("fs");
const path = require("path");
const showdown = require("showdown");
const paths = require("./paths");
const { readDbFile, readMdFile } = require("./data");
const { DevtoList, ProjectsList, AppList, GithubList } = require("./mdComponents");

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
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-20NDLVTCNE"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-20NDLVTCNE');
  </script>
</body>
</html>`;

const renderHtmlApp = (state, markdown) => {
  const converter = new showdown.Converter({
    noHeaderId: true,
    openLinksInNewWindow: true,
    emoji: true,
  });
  converter.setFlavor("github");

  const html = converter
    .makeHtml(markdown)
    .replace(/<h2[^>]*>(.+)<\/h2>[^<]*?(\<ul[^>]*\>[^]*?\<\/ul\>)/gm, (match, title, content) => {
      return `<section id="${title.toLowerCase()}"><h2>${title}</h2>${content}</section>`;
    })
    .replace(/ - /g, `<br/>`);

  return htmlTemplate(state, html);
};

const renderMdApp = ({ title, description, header, work, github, devto, projects, apps, gpg }) => {
  return `
# ${title}
### ${description}

## work

${work}

## apps

${ProjectsList(apps)}

## proj

${ProjectsList(projects)}

## oss

${GithubList(github)}

## press

${DevtoList(devto)}

${gpg}
`.trim();
};

const main = async () => {
  const state = {
    title: readMdFile("title"),
    description: readMdFile("description"),
    work: readMdFile("work"),
    gpg: readMdFile("gpg"),
    devto: readDbFile("devto"),
    github: readDbFile("github"),
    projects: readDbFile("projects"),
    apps: readDbFile("apps"),
    metas: [
      { name: "author", content: readMdFile("title") },
      { name: "viewport", content: "width=device-width" },
    ],
    links: [{ rel: "stylesheet", href: `style.css?t=${Date.now()}` }],
  };

  const markdown = renderMdApp(state);
  const html = renderHtmlApp(state, markdown);

  fs.writeFileSync(paths.readme, markdown);

  fs.writeFileSync(path.join(paths.public, "index.md"), markdown);
  fs.writeFileSync(path.join(paths.public, "index.html"), html);
};

main();
