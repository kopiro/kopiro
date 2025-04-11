/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

require("./config");

const fs = require("fs/promises");
const path = require("path");
const paths = require("./paths");
const { renderBaseHtmlFromMd, renderBaseMd } = require("./baseTemplates");

async function main() {
  try {
    // Fetch articles
    const articles = await fetch(`https://dev.to/api/articles?username=${process.env.DEVTO_USERNAME}`);
    const articlesJson = await articles.json();

    console.log(`Fetched ${articlesJson.length} articles`);

    // Generate HTML files for each article
    for (const { id } of articlesJson) {
      const articleResp = await fetch(`https://dev.to/api/articles/${id}`);
      const articleJson = await articleResp.json();

      const { title, body_markdown: markdown, slug } = articleJson;

      await fs.writeFile(path.join(paths.root, "press", `${slug}.json`), JSON.stringify(articleJson, null, 2));

      const actualMarkdown = renderBaseMd(
        {},
        `
# ${title}

#### Published on ${new Date(articleJson.published_at).toLocaleDateString()}

${articleJson.cover_image ? `![${title}](${articleJson.cover_image})` : ""}

${markdown}
`,
      );
      await fs.writeFile(path.join(paths.root, "press", `${slug}.md`), actualMarkdown);

      const html = renderBaseHtmlFromMd(
        {
          title,
          bodyClass: "press",
          metas: [
            { name: "og:title", content: articleJson.title },
            { name: "og:description", content: articleJson.description },
            articleJson.cover_image ? { name: "og:image", content: articleJson.cover_image } : null,
            { name: "og:type", content: `article` },
          ].filter(Boolean),
        },
        actualMarkdown,
      );
      await fs.writeFile(path.join(paths.root, "press", `${slug}.html`), html);
      console.log(`Generated files for "${title}"`);
    }

    console.log("All articles have been processed successfully!");
  } catch (error) {
    console.error("Error in main process:", error);
  }
}

main();
