const fs = require("fs");
const path = require("path");
const showdown = require("showdown");
const paths = require("./paths");
const { readDbFile } = require("./data");
const { DevtoList, ProjectsList, MediumList, GithubList } = require("./mdComponents");

function htmlTemplate(body) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Flavio De Stefano - aka @kopiro</title>
  <meta name="author" content="Flavio De Stefano" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="style.css" />
  <link rel="apple-touch-icon" sizes="60x60" href="apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
</head>
<body>
${body}
</body>
</html>
`.trim();
}

async function renderMdApp() {
  const [header, story, medium, devto, github, projects] = await Promise.all([
    fs.readFileSync(path.join(paths.md, "header.md"), "utf-8"),
    fs.readFileSync(path.join(paths.md, "story.md"), "utf-8"),
    readDbFile("medium"),
    readDbFile("devto"),
    readDbFile("github"),
    readDbFile("projects"),
  ]);

  return `
${header}
${story}

### OSS Projects
${GithubList(github)}

### Articles
${DevtoList(devto)}
${MediumList(medium)}

### Projects
${ProjectsList(projects)}

[GPG key: 0xEDE51005D982268E](gpgkey.txt)
`.trim();
}

async function renderHtmlApp(markdown) {
  const converter = new showdown.Converter({
    noHeaderId: true,
  });
  const html = converter.makeHtml(markdown);
  return htmlTemplate(html);
}

async function main() {
  const markdown = await renderMdApp();
  fs.writeFileSync(paths.readme, markdown);

  const html = await renderHtmlApp(markdown);
  fs.writeFileSync(path.join(paths.public, "index.html"), html);
}

main();
