const { title } = require("./config");

const fs = require("fs/promises");
const paths = require("./paths");
const { readDbFile, readPartial } = require("./utils");
const { PressList, ProjectsList, GithubList } = require("./mdComponents");
const { renderMd } = require("./baseTemplates");

const renderIndexMd = (state) => {
  const { title, description, github, press, projects, apps } = state;
  return renderMd(
    state,
    `# ${title}
  
### ${description}
  
## apps
  
${ProjectsList(apps)}
  
## blog
  
${PressList(press)}

## websites
  
${ProjectsList(projects)}
  
## opensource
  
${GithubList(github)}
  
  `,
  );
};

async function renderIndex() {
  const state = {
    title,
    description: readPartial("description.md"),
    press: readDbFile("press"),
    github: readDbFile("github"),
    projects: readDbFile("projects"),
    apps: readDbFile("apps"),
  };

  const markdown = renderIndexMd(state);
  await fs.writeFile(paths.readme, markdown);

  console.log(`Index markdown file generated in ${paths.readme}`);
}

async function main() {
  await renderIndex();
}

main();
