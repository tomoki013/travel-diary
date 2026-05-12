const fs = require("fs");
const path = require("path");

const imageDirectory = path.join(process.cwd(), "public/images");

async function generateIndex() {
  console.log("Starting image index generation...");
  try {
    const countryDirectories = fs
      .readdirSync(imageDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const country of countryDirectories) {
      const countryPath = path.join(imageDirectory, country);
      const metadataPath = path.join(countryPath, "metadata.json");
      const indexPath = path.join(countryPath, "index.json");

      if (!fs.existsSync(metadataPath)) {
        console.warn(`⚠️ Warning: metadata.json not found in ${countryPath}. Skipping.`);
        continue;
      }

      const metadataContent = fs.readFileSync(metadataPath, "utf-8");
      const metadata = JSON.parse(metadataContent);

      if (!Array.isArray(metadata)) {
        console.error(`❌ Error: metadata.json in ${countryPath} is not a JSON array. Skipping.`);
        continue;
      }

      const newIndex = {};
      const imageFiles = fs.readdirSync(countryPath);
      const imageFileSet = new Set(imageFiles);

      for (const photo of metadata) {
        if (!photo.fileName) {
          console.warn(`⚠️ Warning: Item in ${metadataPath} is missing 'fileName'. Skipping.`);
          continue;
        }

        if (imageFileSet.has(photo.fileName)) {
          // The original index.json did not have fileName in the value object.
          const { fileName, ...rest } = photo;
          newIndex[fileName] = {
            ...rest,
            // Per instructions, add the `url` property.
            // photo.ts will ignore this and generate its own `path` property,
            // but we follow the instructions to add it here.
            url: `/images/${country}/${fileName}`,
          };
        } else {
          console.warn(
            `⚠️ Warning: Image file '${photo.fileName}' listed in ${metadataPath} not found in ${countryPath}.`,
          );
        }
      }

      fs.writeFileSync(indexPath, JSON.stringify(newIndex, null, 2));
      console.log(`✅ Successfully generated index.json for ${country}`);
    }
    console.log("Image index generation complete.");
  } catch (error) {
    console.error("❌ An error occurred during index generation:", error);
    process.exit(1);
  }
}

generateIndex();
