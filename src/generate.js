const fs = require("fs");
const path = require("path");
const showdown = require("showdown");
const paths = require("./paths");
const { readDbFile, readMdFile } = require("./data");
const { DevtoList, ProjectsList, GithubList } = require("./mdComponents");

const htmlTemplate = ({ title, description }, body) =>
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="author" content="${title}" />
  <meta name="description" content="${description}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="style.css" />
  <link rel="apple-touch-icon" sizes="60x60" href="apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
</head>
<body>
${body}
</body>
</html>`;

const renderHtmlApp = (state, markdown) => {
  const converter = new showdown.Converter({
    noHeaderId: true,
  });
  const html = converter.makeHtml(markdown).replace(/<h3>/g, "</section><section><h3>");
  return htmlTemplate(state, html);
};

const renderMdApp = ({ title, description, header, history, github, devto, projects }) => {
  return `
# ${title}
#### kopiro
## ${description.replace(/;/g, "<br/>")}

${header}

### me
${history}

### press
${DevtoList(devto)}

### oss
${GithubList(github)}

### proj
${ProjectsList(projects)}

---

[GPG key: 0xEDE51005D982268E](gpgkey.txt)
`.trim();
};

const main = async () => {
  const [title, description, header, history, devto, github, projects] = await Promise.all([
    readMdFile("title"),
    readMdFile("description"),
    readMdFile("header"),
    readMdFile("history"),
    readDbFile("devto"),
    readDbFile("github"),
    readDbFile("projects"),
  ]);

  const state = { title, description, header, history, devto, github, projects };

  const markdown = await renderMdApp(state);
  fs.writeFileSync(paths.readme, markdown);

  const html = await renderHtmlApp(state, markdown);
  fs.writeFileSync(path.join(paths.public, "index.html"), html);
};

main();
