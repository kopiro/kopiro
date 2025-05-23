require("./config");

const fs = require("fs/promises");
const path = require("path");
const paths = require("./paths");
const { readDbFile, readPartial } = require("./utils");
const { PressList, ProjectsList, GithubList } = require("./mdComponents");
const { renderBaseHtmlFromMd, renderBaseMd } = require("./baseTemplates");

const renderIndexHtml = (state, markdown) => {
  return renderBaseHtmlFromMd(
    {
      ...state,
      bodyClass: "index",
    },
    markdown,
  ).replace(/<h2[^>]*>(.+)<\/h2>[^<]*?(<ul[^>]*>[^]*?<\/ul>)/gm, (match, title, content) => {
    return `<section id="${title.toLowerCase()}"><h2>${title}</h2>${content}</section>`;
  });
};

const renderIndexMd = (state) => {
  const { title, description, work, github, press, projects, apps } = state;
  return renderBaseMd(
    state,
    `# ${title}

${description}

## work

${work}

## apps

${ProjectsList(apps)}

## proj

${ProjectsList(projects)}

## oss

${GithubList(github)}

## press

${PressList(press)}
`,
  );
};

async function main() {
  const state = {
    title: readPartial("title.md"),
    description: readPartial("description.md"),
    work: readPartial("work.md"),
    press: [...readDbFile("devto"), ...readDbFile("docs")],
    github: readDbFile("github"),
    projects: readDbFile("projects"),
    apps: readDbFile("apps"),
  };

  const markdown = renderIndexMd(state);
  await fs.writeFile(paths.readme, markdown);
  await fs.writeFile(path.join(paths.root, "index.md"), markdown);

  const html = renderIndexHtml(state, markdown);
  await fs.writeFile(path.join(paths.root, "index.html"), html);
}

main();
