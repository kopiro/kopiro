require("./config");

const fs = require("fs/promises");
const path = require("path");
const paths = require("./paths");

const listMarkdownFromPublicFolder = () => {
  const mdFiles = walkMarkdowns();

  return mdFiles.map((file) => {
    const baseName = path.basename(file);
    const htmlPath = "/" + file.replace(/\.md$/, ".html");

    const absolutePath = path.join(paths.public, file);
    const content = fs.readFileSync(absolutePath, "utf-8").trim();

    const title = content.match(/^# (.+)$/m)?.[1];
    const coverImage = content.match(/^![^ ]+ (.+)$/m)?.[1];
    const slug = baseName.replace(/\.md$/, "");
    const creationTimestamp = fs.statSync(absolutePath).birthtime;

    return {
      path: "/" + file,
      htmlPath,
      slug,
      publishedAt: creationTimestamp,
      title,
      coverImage,
    };
  });
};

async function createPressDatabase() {
  const filePath = path.join(paths.db, "press.json");

  // Read existing press.json if it exists
  let existingData = [];
  try {
    const content = await fs.readFile(filePath, "utf-8");
    existingData = JSON.parse(content);
  } catch {
    // File doesn't exist or is invalid, start fresh
  }

  const existingSlugs = new Set(existingData.map((e) => e.slug));

  const press = listMarkdownFromPublicFolder();

  // Only add new entries (based on slug)
  let addedCount = 0;
  for (const { relativePath, path, slug, publishedAt, title, coverImage } of press) {
    if (!existingSlugs.has(slug)) {
      existingData.push({
        slug,
        title,
        path: path,
        relativePath,
        coverImage,
        publishedAt,
      });
      addedCount++;
    }
  }

  await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
  console.log(`Press database generated in ${filePath} (${existingData.length} entries, ${addedCount} new)`);

  return press;
}

module.exports = { createPressDatabase };
