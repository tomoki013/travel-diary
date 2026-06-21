"use client";

import { Button } from "@/components/ui/button";

interface FilterChipOption {
  slug: string;
  title: string;
}

interface FilterChipGroupProps {
  title: string;
  options: FilterChipOption[];
  /** 選択中の値。複数選択のときは配列、単一選択のときは文字列 or null。 */
  selected: string | string[] | null;
  onToggle: (value: string) => void;
}

/**
 * 絞り込みのチップ群（カテゴリ / 実用ラベル / タグ / 記事タイプで共通利用）。
 */
export const FilterChipGroup = ({ title, options, selected, onToggle }: FilterChipGroupProps) => {
  const isSelected = (slug: string) =>
    Array.isArray(selected) ? selected.includes(slug) : selected === slug;

  return (
    <div>
      <h3 className="font-heading mb-2 text-sm font-semibold">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
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
