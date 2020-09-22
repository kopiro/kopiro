const fs = require("fs");
const path = require("path");
const showdown = require("showdown");
const paths = require("./paths");
const { readDbFile, readMdFile } = require("./data");
const { DevtoList, ProjectsList, MediumList, GithubList } = require("./mdComponents");

const htmlTemplate = ({ title, description }, body) =>
  `
<!DOCTYPE html>
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
</html>
`.trim();

const renderHtmlApp = (state, markdown) => {
  const converter = new showdown.Converter({
    noHeaderId: true,
  });
  const html = converter.makeHtml(markdown);
  return htmlTemplate(state, html);
};

const renderMdApp = ({ title, description, story, github, devto, medium, projects }) => {
  return `
# ${title}
## ${description}

${story}

### Press
${DevtoList(devto)}
${MediumList(medium)}

### OSS Projects
${GithubList(github)}

### Projects
${ProjectsList(projects)}

[GPG key: 0xEDE51005D982268E](gpgkey.txt)
`.trim();
};

const main = async () => {
  const [title, description, story, medium, devto, github, projects] = await Promise.all([
    readMdFile("title"),
    readMdFile("description"),
    readMdFile("story"),
    readDbFile("medium"),
    readDbFile("devto"),
    readDbFile("github"),
    readDbFile("projects"),
  ]);

  const state = { title, description, story, medium, devto, github, projects };

  const markdown = await renderMdApp(state);
  fs.writeFileSync(paths.readme, markdown);

  const html = await renderHtmlApp(state, markdown);
  fs.writeFileSync(path.join(paths.public, "index.html"), html);
};

main();