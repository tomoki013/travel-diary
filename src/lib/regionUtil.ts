import { regionData } from "@/data/region";
import { Region, ContinentData, Country } from "@/types/types";

/**
 * すべてのリージョン（大陸、国、都市）をフラットな配列として取得します。
 * @returns {Region[]} すべてのリージョンを含む配列
 */
const getAllRegions = (): Region[] => {
  const allRegions: Region[] = [];
  regionData.forEach((continent: ContinentData) => {
    // 大陸を追加（国リストは不要なので除外）
    const continentInfo = {
      slug: continent.slug,
      name: continent.name,
    };
    allRegions.push({ ...continentInfo, imageURL: "" });

    continent.countries.forEach((country: Country) => {
      // 国を追加（子都市リストは不要なので除外）
      const countryInfo = {
        slug: country.slug,
        name: country.name,
        imageURL: country.imageURL,
      };
      allRegions.push(countryInfo);

      // 都市を追加
      if (country.children) {
        allRegions.push(...country.children);
      }
    });
  });
  return allRegions;
};

// 事前に全リージョンをキャッシュ
export const allRegions = getAllRegions();

// パフォーマンス向上のため、slugをキーにしたMapを作成
const regionMap = new Map(allRegions.map((region) => [region.slug, region]));

/**
 * slugから単一の地域情報を取得します。
 * @param slug - 取得したい地域のslug
 * @returns {Region | undefined} 見つかった地域情報、なければundefined
 */
export const getRegionBySlug = (slug: string): Region | undefined => {
  return regionMap.get(slug);
};

/**
 * すべての地域のslugを配列として取得します。
 * `generateStaticParams`での利用を想定しています。
 * @returns {string[]} すべての地域のslugの配列
 */
export const getAllRegionSlugs = (): string[] => {
  return allRegions.map((region) => region.slug);
};

/**
 * slugの配列を受け取り、存在する地域オブジェクトのみの配列を返します。
 * @param slugs - 地域slugの配列
 * @returns {Region[]} `Region`オブジェクトの配列（undefinedを含まない）
 */
export const getValidRegionsBySlugs = (slugs: string[]): Region[] => {
  return slugs
    .map((slug) => getRegionBySlug(slug)) // slugをRegion | undefinedに変換
    .filter((region): region is Region => region !== undefined); // undefinedを取り除く
};

/**
 * 指定した slug 自身 + すべての子孫 slug を返します。
 * 例: "malaysia" -> ["malaysia", "kuala-lumpur", "penang", ...]
 * 例: "asia" -> ["asia", "thailand", "bangkok", "malaysia", ...]
 * 地域フィルターで「マレーシア」を選んだとき「クアラルンプール」の記事も含めるために使います。
 */
export const getRegionAndDescendantSlugs = (slug: string): string[] => {
  const slugs: string[] = [slug];

  for (const continent of regionData) {
    if (continent.slug === slug) {
      // 大陸が指定された場合 → 配下の国・都市すべてを返す
      for (const country of continent.countries) {
        slugs.push(country.slug);
        if (country.children) slugs.push(...country.children.map((c) => c.slug));
      }
      return slugs;
    }
    for (const country of continent.countries) {
      if (country.slug === slug) {
        // 国が指定された場合 → 配下の都市すべてを返す
        if (country.children) slugs.push(...country.children.map((c) => c.slug));
        return slugs;
      }
    }
  }

  return slugs; // 都市など末端ノードはそのまま返す
};

/**
 * 指定した slug の祖先リージョン（大陸・国）の日本語名を返します。
 * 例: "kuala-lumpur" -> ["アジア", "マレーシア"]
 * テキスト検索で「マレーシア」と入力したとき、regionIds に "kuala-lumpur" を持つ記事を
 * ヒットさせるために使います。
 */
export const getRegionAncestorNames = (slug: string): string[] => {
  const path = getRegionPath(slug);
  // 末端（自分自身）を除いた祖先の名前だけを返す
  return path.slice(0, -1).map((r) => r.name);
};

/**
 * slugから階層的な地域情報のパス（パンくずリスト用）を取得します。
 * 例: "paris" -> [Europe, France, Paris]
 * @param slug - 現在の地域のslug
 * @returns {Region[]} パンくずリスト用の地域情報の配列
 */
export const getRegionPath = (slug: string): Region[] => {
  const findPath = (targetSlug: string, continents: ContinentData[]): Region[] | null => {
    for (const continent of continents) {
      for (const country of continent.countries) {
        if (country.slug === targetSlug) {
          return [{ slug: continent.slug, name: continent.name, imageURL: "" }, country];
        }
        if (country.children) {
          for (const city of country.children) {
            if (city.slug === targetSlug) {
              return [{ slug: continent.slug, name: continent.name, imageURL: "" }, country, city];
            }
          }
        }
      }
    }
    return null;
  };

  const path = findPath(slug, regionData);
  return path || [];
};
