// One-time migration script: transforms post frontmatter to the new schema.
// Safe to run multiple times (idempotent: skips files that already have publishedAt).
const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");
const matter = require("gray-matter");
const yaml = require("js-yaml");

const DIRECTORIES = [
  path.join(process.cwd(), "posts"),
  path.join(process.cwd(), "draft-posts"),
];

function migrateData(data) {
  // Already migrated — has publishedAt and no legacy dates field
  if (data.publishedAt && !data.dates) {
    return null;
  }

  const out = {};

  // --- slug (keep if explicit) ---
  if (data.slug !== undefined) out.slug = data.slug;

  // --- title ---
  if (data.title !== undefined) out.title = data.title;

  // --- description ---
  if (data.description !== undefined) out.description = data.description;

  // --- excerpt ---
  if (data.excerpt !== undefined) out.excerpt = data.excerpt;

  // --- publishedAt (from dates[0]) ---
  const datesArr = Array.isArray(data.dates)
    ? data.dates
    : typeof data.dates === "string" && data.dates.trim()
      ? [data.dates]
      : [];
  const primaryDate = datesArr[0] || undefined;

  if (primaryDate) {
    out.publishedAt = primaryDate;
  } else if (data.publishedAt) {
    out.publishedAt = data.publishedAt;
  } else {
    out.publishedAt = "1970-01-01"; // fallback; should not happen
  }

  // --- updatedAt ---
  if (data.updatedAt !== undefined) out.updatedAt = data.updatedAt;

  // --- travelDates (from dates) ---
  if (data.travelDates !== undefined) {
    out.travelDates = data.travelDates;
  } else if (primaryDate) {
    out.travelDates = { start: primaryDate };
  }

  // --- category ---
  if (data.category !== undefined) out.category = data.category;

  // --- tags ---
  if (data.tags !== undefined) out.tags = data.tags;

  // --- heroImage (from image) ---
  if (data.heroImage !== undefined) {
    out.heroImage = data.heroImage;
  } else if (data.image !== undefined) {
    out.heroImage = data.image;
  }

  // --- heroAlt ---
  if (data.heroAlt !== undefined) out.heroAlt = data.heroAlt;

  // --- regionIds (from location) ---
  if (data.regionIds !== undefined) {
    out.regionIds = data.regionIds;
  } else if (data.location !== undefined) {
    out.regionIds = Array.isArray(data.location) ? data.location : [data.location];
  }

  // --- author ---
  if (data.author !== undefined) out.author = data.author;

  // --- series (string → { slug }) ---
  if (data.series !== undefined) {
    if (typeof data.series === "string") {
      out.series = { slug: data.series };
    } else if (data.series && typeof data.series === "object") {
      out.series = data.series; // already object form
    }
  }

  // --- journeyId (from journey) ---
  if (data.journeyId !== undefined) {
    out.journeyId = data.journeyId;
  } else if (data.journey !== undefined) {
    out.journeyId = data.journey;
  }

  // --- costReport (from budget + costs) ---
  if (data.costReport !== undefined) {
    out.costReport = data.costReport;
  } else if (data.budget !== undefined || data.costs !== undefined) {
    const costReport = {};
    if (data.budget !== undefined) {
      costReport.budget = { amount: data.budget, currency: "JPY" };
    }
    if (data.costs !== undefined) {
      costReport.costs = { currency: "JPY", items: data.costs };
    }
    out.costReport = costReport;
  }

  // --- promotionPrograms (from isPromotion + promotionPG) ---
  if (data.promotionPrograms !== undefined) {
    out.promotionPrograms = data.promotionPrograms;
  } else if (data.promotionPG !== undefined && data.promotionPG.length > 0) {
    out.promotionPrograms = data.promotionPG;
  } else if (data.isPromotion === true) {
    out.promotionPrograms = [];
  }

  // --- travelTopics (keep as-is) ---
  if (data.travelTopics !== undefined) out.travelTopics = data.travelTopics;

  // --- draft ---
  if (data.draft !== undefined) out.draft = data.draft;

  // Fields intentionally dropped: dates, image, location, budget, costs,
  // isPromotion, promotionPG, journey, id, revenueCategory, content

  return out;
}

async function migrateFile(filePath) {
  const raw = await fsp.readFile(filePath, "utf8");
  const parsed = matter(raw);

  const newData = migrateData(parsed.data);
  if (newData === null) {
    return false; // already migrated
  }

  const frontmatter = yaml.dump(newData, {
    lineWidth: -1,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  });

  // Ensure content starts with a newline after ---
  const content = parsed.content.startsWith("\n") ? parsed.content : "\n" + parsed.content;
  const newRaw = `---\n${frontmatter}---\n${content}`;

  await fsp.writeFile(filePath, newRaw, "utf8");
  return true;
}

async function main() {
  console.log("Migrating frontmatter schema...\n");

  let totalMigrated = 0;
  let totalSkipped = 0;
  const errors = [];

  for (const dir of DIRECTORIES) {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      continue;
    }

    const entries = await fsp.readdir(dir, { withFileTypes: true });
    const mdFiles = entries
      .filter((e) => e.isFile() && /\.(md|mdx)$/.test(e.name))
      .map((e) => path.join(dir, e.name));

    console.log(`Processing ${path.relative(process.cwd(), dir)}/ (${mdFiles.length} files)...`);

    for (const filePath of mdFiles) {
      try {
        const migrated = await migrateFile(filePath);
        const name = path.basename(filePath);
        if (migrated) {
          console.log(`  ✓ ${name}`);
          totalMigrated++;
        } else {
          totalSkipped++;
        }
      } catch (err) {
        errors.push({ filePath, err });
        console.error(`  ✗ ${path.basename(filePath)}: ${err.message}`);
      }
    }
    console.log("");
  }

  console.log(`Migration complete:`);
  console.log(`  Migrated : ${totalMigrated}`);
  console.log(`  Skipped  : ${totalSkipped} (already up to date)`);
  if (errors.length > 0) {
    console.error(`  Errors   : ${errors.length}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
