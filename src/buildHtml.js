require("./config");

const fs = require("fs/promises");
const path = require("path");
const paths = require("./paths");
const { renderHtmlFromMd } = require("./baseTemplates");
const { readPublicMarkdownDb } = require("./utils");

async function renderArticleHtml(article) {
  const { title, coverImage, content, webPath } = article;

  const html = renderHtmlFromMd(
    {
      bodyClass: "article",
      metas: {
        ogTitle: { name: "og:title", content: title },
        ogType: { name: "og:type", content: "article" },
        // ...(description && { ogDescription: { name: "og:description", content: description } }),
        ...(coverImage && { ogImage: { name: "og:image", content: coverImage } }),
      },
    },
    content,
  );

  const htmlFilePath = path.join(paths.build, webPath);

  await fs.writeFile(htmlFilePath, html);
  console.log(`Generated HTML for "${webPath}"`);
}

const renderIndexHtml = (state, markdownContent) => {
  return renderHtmlFromMd(
    {
      ...state,
      title: "Flavio De Stefano",
      bodyClass: "index",
    },
    markdownContent,
  ).replace(/<h2[^>]*>(.+)<\/h2>[^<]*?(<ul[^>]*>[^]*?<\/ul>)/gm, (match, title, content) => {
    return `<section id="${title.toLowerCase()}"><h2>${title}</h2>${content}</section>`;
  });
};

async function main() {
  const indexMarkdownContent = await fs.readFile(paths.readme, "utf-8");
  const html = renderIndexHtml({}, indexMarkdownContent);
  await fs.writeFile(path.join(paths.build, "index.html"), html);

  const markdownFiles = await readPublicMarkdownDb();
  await Promise.all(markdownFiles.map(renderArticleHtml));
}

main();
