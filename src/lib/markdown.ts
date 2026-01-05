import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post } from "@/types/types";
import { ensureStringArray } from "@/lib/utils";

const postsDirectory = path.join(process.cwd(), "posts");

type PostMetadata = Omit<Post, "content">;

function getPostSubdirectories(): string[] {
  const allItems = fs.readdirSync(postsDirectory);

  const configFiles = allItems.filter(
    (name) => name === "travel-diary.config.json"
  );

  const directories = new Set<string>();

  for (const configFile of configFiles) {
    const configPath = path.join(postsDirectory, configFile);

    if (fs.statSync(configPath).isDirectory()) continue;

    const fileContents = fs.readFileSync(configPath, "utf8");
    try {
      const config = JSON.parse(fileContents);
      if (Array.isArray(config.directories)) {
        config.directories.forEach((dir: string) => directories.add(dir));
      }
    } catch (e) {
      console.error(`Error parsing ${configFile}:`, e);
    }
  }
  return Array.from(directories);
}

export function getRawPostsData(): PostMetadata[] {
  // 1. 設定ファイルから読み込むべきサブディレクトリのリストを取得
  const subdirectories = getPostSubdirectories();
  let allPostsData: PostMetadata[] = [];

  // 2. 各サブディレクトリをループ
  for (const dir of subdirectories) {
    const currentPostDir = path.join(postsDirectory, dir);

    // 3. ディレクトリが存在するかチェック
    if (
      !fs.existsSync(currentPostDir) ||
      !fs.statSync(currentPostDir).isDirectory()
    ) {
      console.warn(
        `Directory ${currentPostDir} specified in config does not exist. Skipping.`
      );
      continue;
    }

    // 4. サブディレクトリ内の .md/.mdx ファイルを読み込む
    const fileNames = fs
      .readdirSync(currentPostDir)
      .filter(
        (fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx")
      );

    // 5. 各ファイルのメタデータを処理
    const postsInData = fileNames.map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "").toLowerCase();
      const fullPath = path.join(currentPostDir, fileName);

      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        dates: ensureStringArray(data.dates),
        category: data.category,
        tags: ensureStringArray(data.tags),
        excerpt: data.excerpt,
        image: data.image,
        location: ensureStringArray(data.location),
        author: data.author,
        budget: data.budget,
        costs: data.costs,
        series: data.series,
        isPromotion: data.isPromotion,
        promotionPG: data.promotionPG,
      } as PostMetadata;
    });

    // 6. 結果を結合
    allPostsData = allPostsData.concat(postsInData);
  }

  return allPostsData;
}
