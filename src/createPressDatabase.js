require("./config");

const fs = require("fs");
const path = require("path");
const paths = require("./paths");
const { walkMarkdowns } = require("./utils");

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

function createPressDatabase() {
  const filePath = path.join(paths.db, "press.json");

  // Read existing press.json if it exists
  let existingData = [];
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    existingData = JSON.parse(content);
  } catch {
    // File doesn't exist or is invalid, start fresh
  }

  // Create a map of existing entries by slug for easy lookup
  const existingBySlug = new Map(existingData.map((e) => [e.slug, e]));

  const press = listMarkdownFromPublicFolder();

  // Track which slugs we've processed from markdown files
  const processedSlugs = new Set();
  let addedCount = 0;
  const updatedData = [];

  // Process markdown files, merging with existing data
  for (const { path, htmlPath, slug, publishedAt, title, coverImage } of press) {
    processedSlugs.add(slug);
    const existing = existingBySlug.get(slug);

    if (existing) {
      // Keep existing entry exactly as-is, don't change any fields
      updatedData.push(existing);
    } else {
      updatedData.push({
        slug,
        title,
        path,
        coverImage,
        publishedAt,
        htmlPath,
      });
      addedCount++;
    }
  }

  // Also preserve entries from the database that don't have markdown files
  for (const existing of existingData) {
    if (!processedSlugs.has(existing.slug)) {
      updatedData.push(existing);
    }
  }

  // Sort by publishedAt date (oldest first, newest at the end)
  updatedData.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));

  fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
  console.log(`Press database generated in ${filePath} (${updatedData.length} entries, ${addedCount} new)`);

  return press;
}

createPressDatabase();
