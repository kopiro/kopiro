require("./config");

const fs = require("fs");
const path = require("path");
const paths = require("./paths");
const { walkMarkdowns } = require("./utils");

const MAX_DESCRIPTION_LENGTH = 160;

/**
 * Extracts the first meaningful paragraph from markdown content.
 * Skips: headings, images, empty lines, embeds.
 */
function extractFirstParagraph(markdown) {
  const lines = markdown.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) continue;
    if (trimmed.startsWith("![")) continue;
    if (trimmed.startsWith("{%")) continue;
    if (/^[-*_]{3,}$/.test(trimmed)) continue;

    // Clean up markdown formatting
    let description = trimmed
      .replace(/^\*["'](.*)["']\*$/, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/_([^_]+)_/g, "$1");

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      description = description.substring(0, MAX_DESCRIPTION_LENGTH - 3).trim() + "...";
    }

    return description;
  }

  return null;
}

const listMarkdownFromPublicFolder = () => {
  const mdFiles = walkMarkdowns();

  return mdFiles.map((file) => {
    const baseName = path.basename(file);
    const htmlPath = "/" + file.replace(/\.md$/, ".html");

    const absolutePath = path.join(paths.root, file);
    const content = fs.readFileSync(absolutePath, "utf-8").trim();

    const title = content.match(/^# (.+)$/m)?.[1];
    const coverImage = content.match(/^!\[.*?\]\((.+?)\)$/m)?.[1];
    const description = extractFirstParagraph(content) || title;
    const slug = baseName.replace(/\.md$/, "");
    const creationTimestamp = fs.statSync(absolutePath).birthtime;

    return {
      path: "/" + file,
      htmlPath,
      slug,
      publishedAt: creationTimestamp,
      title,
      coverImage,
      description,
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
  for (const { path, htmlPath, slug, publishedAt, title, coverImage, description } of press) {
    processedSlugs.add(slug);
    const existing = existingBySlug.get(slug);

    if (existing) {
      // Always overwrite title, description and coverImage from markdown
      updatedData.push({
        ...existing,
        title,
        coverImage,
        description,
      });
    } else {
      updatedData.push({
        slug,
        title,
        path,
        coverImage,
        description,
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
