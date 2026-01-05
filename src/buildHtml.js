require("./config");

const fs = require("fs/promises");
const path = require("path");
const paths = require("./paths");
const { renderHtmlFromMd } = require("./baseTemplates");
const { readDbFile, readPartial, deepMerge } = require("./utils");

async function renderPress(article) {
  const { title, coverImage, htmlPath } = article;
  const content = await fs.readFile(path.join(paths.public, article.path), "utf-8");

  const html = renderHtmlFromMd(
    {
      bodyClass: "article",
      title,
      metas: {
        ogTitle: { name: "og:title", content: title },
        ogType: { name: "og:type", content: "article" },
        ...(coverImage && { ogImage: { name: "og:image", content: coverImage } }),
      },
    },
    content,
  );

  const htmlFilePath = path.join(paths.build, htmlPath);
  await fs.mkdir(path.dirname(htmlFilePath), { recursive: true });
  await fs.writeFile(htmlFilePath, html);
  console.log(`Generated HTML for "${htmlFilePath}"`);
}

const renderIndexHtml = (state, markdownContent) => {
  return renderHtmlFromMd(
    deepMerge(state, {
      bodyClass: "index",
    }),
    markdownContent,
  ).replace(/<h2[^>]*>(.+)<\/h2>[^<]*?(<ul[^>]*>[^]*?<\/ul>)/gm, (match, title, content) => {
    return `<section id="${title.toLowerCase()}"><h2>${title}</h2>${content}</section>`;
  });
};

async function main() {
  await fs.mkdir(paths.build, { recursive: true });

  const indexMarkdownContent = await fs.readFile(paths.readme, "utf-8");

  const title = readPartial("title.md");
  const description = readPartial("description.md");

  const html = renderIndexHtml(
    {
      title: title,
      metas: {
        description: { name: "description", content: description },
      },
    },
    indexMarkdownContent,
  );
  await fs.writeFile(path.join(paths.build, "index.html"), html);

  const press = readDbFile("press");
  await Promise.all(press.map(renderPress));
}

main();
