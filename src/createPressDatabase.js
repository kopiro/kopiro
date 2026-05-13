require("./config");

const fs = require("fs");
const path = require("path");
const paths = require("./paths");
const { parseFrontmatter, walkMarkdowns } = require("./utils");

function resolvePublicAssetPath(markdownFile, assetPath) {
  if (!assetPath || /^(?:[a-z]+:)?\/\//i.test(assetPath) || assetPath.startsWith("/")) {
    return assetPath;
  }

  return `/${path.posix.normalize(path.posix.join(path.posix.dirname(markdownFile), assetPath))}`;
}

const listMarkdownFromPublicFolder = () => {
  const mdFiles = walkMarkdowns();

  return mdFiles.map((file) => {
    const baseName = path.basename(file);
    const slug = baseName === "index.md" ? path.basename(path.dirname(file)) : baseName.replace(/\.md$/, "");
    const htmlPath = `/press/${slug}/index.html`;

    const absolutePath = path.join(paths.root, file);
    const content = fs.readFileSync(absolutePath, "utf-8");
    const { attributes } = parseFrontmatter(content, file);

    for (const key of ["title", "publishedAt", "description"]) {
      if (typeof attributes[key] !== "string" || !attributes[key].trim()) {
        throw new Error(`Missing required frontmatter field "${key}" in ${file}`);
      }
    }

    if (Number.isNaN(new Date(attributes.publishedAt).getTime())) {
      throw new Error(`Invalid publishedAt frontmatter value in ${file}: ${attributes.publishedAt}`);
    }

    const coverImage =
      typeof attributes.coverImage === "string" && attributes.coverImage.trim()
        ? resolvePublicAssetPath(file, attributes.coverImage)
        : undefined;

    const article = {
      path: "/" + file,
      htmlPath,
      slug,
      title: attributes.title,
      coverImage,
      description: attributes.description,
      publishedAt: attributes.publishedAt,
    };

    if (attributes.hidden === true) {
      article.hidden = true;
    }

    return article;
  });
};

function createPressDatabase() {
  const filePath = path.join(paths.db, "press.json");
  const press = listMarkdownFromPublicFolder();

  // Sort by publishedAt date (oldest first, newest at the end)
  press.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));

  fs.writeFileSync(filePath, JSON.stringify(press, null, 2) + "\n");
  console.log(`Press database generated in ${filePath} (${press.length} entries)`);

  return press;
}

createPressDatabase();
