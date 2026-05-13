const { title: siteName, baseUrl, disqusShortname } = require("./config");

const fs = require("fs/promises");
const path = require("path");
const paths = require("./paths");
const { renderHtmlFromMd } = require("./baseTemplates");
const { readDbFile, readPartial, deepMerge, parseFrontmatter } = require("./utils");

const escapeXml = (str) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const jsString = (value) => JSON.stringify(value).replace(/</g, "\\u003C");

const renderDisqusComments = ({ articleUrl, slug, title }) => {
  if (!disqusShortname) {
    return "";
  }

  const embedUrl = `https://${disqusShortname}.disqus.com/embed.js`;

  return `
<section id="comments" class="comments">
<h2>Comments</h2>
<div id="disqus_thread"></div>
<script>
var disqus_config = function () {
  this.page.url = ${jsString(articleUrl)};
  this.page.identifier = ${jsString(slug)};
  this.page.title = ${jsString(title)};
};
(function() {
  var d = document, s = d.createElement('script');
  s.src = ${jsString(embedUrl)};
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
})();
</script>
<noscript>Please enable JavaScript to view the comments powered by Disqus.</noscript>
</section>`;
};

async function copyAssets() {
  for (const asset of paths.publicAssets) {
    const src = path.join(paths.root, asset);
    const dest = path.join(paths.build, asset);
    await fs.cp(src, dest, { recursive: true });
    console.log(`Copied "${asset}" to build/`);
  }
}

async function copyPressMedia(press) {
  await Promise.all(
    press.map(async (article) => {
      const sourceMediaDir = path.join(paths.root, path.dirname(article.path), "media");
      const destMediaDir = path.join(paths.build, "press", article.slug, "media");

      try {
        await fs.access(sourceMediaDir);
      } catch {
        return;
      }

      await fs.mkdir(path.dirname(destMediaDir), { recursive: true });
      await fs.cp(sourceMediaDir, destMediaDir, { recursive: true });
      console.log(`Copied press media for "${article.slug}"`);
    }),
  );
}

async function cleanBuildDir() {
  await fs.mkdir(paths.build, { recursive: true });
  const entries = await fs.readdir(paths.build);

  await Promise.all(
    entries
      .filter((entry) => entry !== ".gitignore")
      .map((entry) => fs.rm(path.join(paths.build, entry), { recursive: true, force: true })),
  );
}

async function renderPress(article) {
  const { title, coverImage, htmlPath, description, slug } = article;
  const content = await fs.readFile(path.join(paths.root, article.path), "utf-8");
  const { body } = parseFrontmatter(content, article.path);
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
    `${body}\n\n${renderDisqusComments({ articleUrl, slug, title })}`,
  ).replace(/((?:src|href)=["'])(?:\.\/)?media\//g, `$1/press/${slug}/media/`);

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
  )
    .replace(/\.md"/g, '.html"')
    .replace(/<h2[^>]*>(.+)<\/h2>[^<]*?(<ul[^>]*>[^]*?<\/ul>)/gm, (match, title, content) => {
      return `<section id="${title.toLowerCase()}"><h2>${title}</h2>${content}</section>`;
    });
};

async function generateRssFeed() {
  const press = readDbFile("press");
  const description = readPartial("description.md");

  const visibleArticles = press
    .filter((article) => !article.hidden)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  const items = visibleArticles
    .map((article) => {
      const articleUrl = `${baseUrl}${article.htmlPath}`;
      const pubDate = new Date(article.publishedAt).toUTCString();
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <description>${escapeXml(article.description || "")}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${articleUrl}</guid>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(description)}</description>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  await fs.writeFile(path.join(paths.build, "rss.xml"), rss);
  console.log("Generated RSS feed");
}

async function main() {
  await cleanBuildDir();

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

  await generateRssFeed();
  await copyPressMedia(press);
  await copyAssets();
}

main();
