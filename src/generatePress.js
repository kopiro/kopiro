/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

require("./config");

const fs = require("fs/promises");
const path = require("path");
const paths = require("./paths");
const { renderBaseHtmlFromMd, renderBaseMd } = require("./baseTemplates");
const { readDbFile, getDateHumanFormat } = require("./utils");

async function renderArticle(article) {
  await fs.writeFile(path.join(paths.root, "press", `${article.slug}.json`), JSON.stringify(article, null, 2));

  const actualMarkdown = renderBaseMd(
    {},
    `
# ${article.title}

#### Published on ${getDateHumanFormat(article.published_at)}

${article.cover_image ? `![${article.title}](${article.cover_image})` : ""}

${article.body_markdown}
`,
  );
  await fs.writeFile(path.join(paths.root, "press", `${article.slug}.md`), actualMarkdown);

  const html = renderBaseHtmlFromMd(
    {
      title: article.title,
      bodyClass: "press",
      metas: {
        ogTitle: { name: "og:title", content: article.title },
        ogDescription: { name: "og:description", content: article.description },
        ...(article.cover_image && { ogImage: { name: "og:image", content: article.cover_image } }),
        ogType: { name: "og:type", content: "article" },
      },
    },
    actualMarkdown,
  );
  await fs.writeFile(path.join(paths.root, "press", `${article.slug}.html`), html);
  console.log(`Generated files for "${article.slug}"`);
}

async function fetchDevToArticles() {
  try {
    // Fetch dev.to articles
    const articles = await fetch(`https://dev.to/api/articles?username=${process.env.DEVTO_USERNAME}`);
    const articlesJson = await articles.json();

    console.log(`Fetched ${articlesJson.length} articles`);

    // Generate HTML files for each article
    for (const { id } of articlesJson) {
      const articleResp = await fetch(`https://dev.to/api/articles/${id}`);
      const articleJson = await articleResp.json();
      await renderArticle(articleJson);
    }

    console.log("All articles have been processed successfully!");
  } catch (error) {
    console.error("Error in main process:", error);
  }
}

async function fetchDocs() {
  const docs = await readDbFile("docs");
  console.log(`Fetched ${docs.length} docs`);

  for (const article of docs) {
    const bodyMarkdownResp = await fetch(article.markdown_url);
    article.body_markdown = await bodyMarkdownResp.text();
    // Replace first # with nothing
    article.body_markdown = article.body_markdown.replace(/#.+\n/, "");

    await renderArticle(article);
  }
}

async function main() {
  await fetchDocs();
  await fetchDevToArticles();
}

main();
