require("./config");

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const paths = require("./paths");
const { readPublicMarkdownDb } = require("./utils");

const MEDIA_DIR = path.join(paths.public, "media");

// Ensure media directory exists
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

// Extract all image URLs from markdown content
function extractImageUrls(content) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    const [fullMatch, altText, url] = match;
    // Skip local images (already downloaded or relative paths)
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      continue;
    }
    images.push({ fullMatch, altText, url });
  }

  return images;
}

// Generate a filename from URL
function generateFilename(url) {
  // Create a hash of the URL for uniqueness
  const hash = crypto.createHash("md5").update(url).digest("hex").slice(0, 8);

  // Try to extract original extension from URL
  let ext = ".jpg"; // default
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const urlExt = path.extname(pathname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(urlExt)) {
      ext = urlExt;
    }
  } catch {
    // Keep default extension
  }

  return `${hash}${ext}`;
}

// Download an image and save it locally
async function downloadImage(url, filename) {
  const filePath = path.join(MEDIA_DIR, filename);

  // Skip if already downloaded
  if (fs.existsSync(filePath)) {
    console.log(`  ⏭️  Already exists: ${filename}`);
    return true;
  }

  try {
    console.log(`  ⬇️  Downloading: ${url.slice(0, 60)}...`);
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ImageDownloader/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    console.log(`  ✅ Saved: ${filename}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to download ${url}: ${error.message}`);
    return false;
  }
}

// Process a single markdown file
async function processMarkdownFile(mdFile) {
  console.log(`\n📄 Processing: ${mdFile.relativePath}`);

  const images = extractImageUrls(mdFile.content);

  if (images.length === 0) {
    console.log("  No external images found");
    return { processed: 0, replaced: 0 };
  }

  console.log(`  Found ${images.length} external image(s)`);

  let updatedContent = mdFile.content;
  let replacedCount = 0;

  for (const image of images) {
    const filename = generateFilename(image.url);
    const success = await downloadImage(image.url, filename);

    if (success) {
      // Replace URL with local path
      const localPath = `/media/${filename}`;
      const newMarkdown = `![${image.altText}](${localPath})`;
      updatedContent = updatedContent.replace(image.fullMatch, newMarkdown);
      replacedCount++;
    }
  }

  // Write updated content back to file
  if (replacedCount > 0) {
    fs.writeFileSync(mdFile.absolutePath, updatedContent);
    console.log(`  📝 Updated markdown with ${replacedCount} local image(s)`);
  }

  return { processed: images.length, replaced: replacedCount };
}

async function main() {
  console.log("🖼️  Image Downloader for Markdown Files");
  console.log("========================================\n");

  const mdFiles = readPublicMarkdownDb();
  console.log(`Found ${mdFiles.length} markdown file(s)`);

  let totalProcessed = 0;
  let totalReplaced = 0;

  for (const mdFile of mdFiles) {
    const { processed, replaced } = await processMarkdownFile(mdFile);
    totalProcessed += processed;
    totalReplaced += replaced;
  }

  console.log("\n========================================");
  console.log(`✨ Done! Processed ${totalProcessed} images, replaced ${totalReplaced} URLs`);
}

main().catch(console.error);

