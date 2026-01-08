const { title: siteName, baseUrl } = require("./config");

const fs = require("fs/promises");
const path = require("path");
const paths = require("./paths");
const { renderHtmlFromMd } = require("./baseTemplates");
const { readDbFile, readPartial, deepMerge } = require("./utils");

async function renderPress(article) {
  const { title, coverImage, htmlPath, description } = article;
  const content = await fs.readFile(path.join(paths.public, article.path), "utf-8");
  const articleUrl = `${baseUrl}${htmlPath}`;
  const absoluteCoverImage = coverImage ? `${baseUrl}${coverImage}` : null;

  const html = renderHtmlFromMd(
    {
      bodyClass: "article",
      title: `${title} | ${siteName}`,
      metas: {
        description: { name: "description", content: description },
        ogTitle: { name: "og:title", content: title },
        ogType: { name: "og:type", content: "article" },
        ogUrl: { name: "og:url", content: articleUrl },
        ogSiteName: { name: "og:site_name", content: siteName },
        ogDescription: { name: "og:description", content: description },
        ...(absoluteCoverImage && { ogImage: { name: "og:image", content: absoluteCoverImage } }),
        twitterCard: { name: "twitter:card", content: coverImage ? "summary_large_image" : "summary" },
        twitterTitle: { name: "twitter:title", content: title },
        twitterDescription: { name: "twitter:description", content: description },
        ...(absoluteCoverImage && { twitterImage: { name: "twitter:image", content: absoluteCoverImage } }),
      },
      links: {
        canonical: { rel: "canonical", href: articleUrl },
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

  const title = siteName;
  const description = readPartial("description.md");

  const html = renderIndexHtml(
    {
      title: title,
      metas: {
        description: { name: "description", content: description },
        ogTitle: { name: "og:title", content: title },
        ogType: { name: "og:type", content: "website" },
        ogUrl: { name: "og:url", content: baseUrl },
        ogSiteName: { name: "og:site_name", content: title },
        ogDescription: { name: "og:description", content: description },
        twitterCard: { name: "twitter:card", content: "summary" },
        twitterTitle: { name: "twitter:title", content: title },
        twitterDescription: { name: "twitter:description", content: description },
      },
      links: {
        canonical: { rel: "canonical", href: baseUrl },
      },
    },
    indexMarkdownContent,
  );
  await fs.writeFile(path.join(paths.build, "index.html"), html);

  const press = readDbFile("press");
  await Promise.all(press.map(renderPress));
}

main();
