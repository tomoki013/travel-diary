"use client";

import { Button } from "@/components/ui/button";

interface FilterChipOption {
  slug: string;
  title: string;
}

interface FilterChipGroupProps {
  title: string;
  /** 見出し下に表示する短い説明（任意） */
  description?: string;
  options: FilterChipOption[];
  /** 選択中の値。複数選択のときは配列、単一選択のときは文字列 or null。 */
  selected: string | string[] | null;
  onToggle: (value: string) => void;
}

/**
 * 絞り込みのチップ群（カテゴリ / 実用ラベル / タグ / 記事タイプで共通利用）。
 */
export const FilterChipGroup = ({
  title,
  description,
  options,
  selected,
  onToggle,
}: FilterChipGroupProps) => {
  const isSelected = (slug: string) =>
    Array.isArray(selected) ? selected.includes(slug) : selected === slug;

  const selectedCount = Array.isArray(selected) ? selected.length : selected ? 1 : 0;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h3 className="font-heading text-sm font-semibold">{title}</h3>
        {selectedCount > 0 && (
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
            {selectedCount}件選択中
          </span>
        )}
      </div>
      {description && (
        <p className="text-muted-foreground mb-2.5 text-xs leading-relaxed">{description}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.slug}
            variant={isSelected(option.slug) ? "default" : "outline"}
            onClick={() => onToggle(option.slug)}
            size="sm"
            type="button"
          >
            {option.title}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterChipGroup;
