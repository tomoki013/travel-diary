"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

interface SearchInputProps {
  initialValue?: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  onReset: () => void;
  /** 入力できる最大文字数 */
  maxLength?: number;
}

export const SearchInput = ({
  initialValue = "",
  placeholder = "キーワードで検索...",
  onSearch,
  onReset,
  maxLength,
}: SearchInputProps) => {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setQuery(initialValue);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [initialValue]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
    inputRef.current?.blur(); // Add this line
  };

  const handleReset = () => {
    setQuery("");
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-grow">
        <Input
          ref={inputRef} // Add this line
          type="search"
          placeholder={placeholder}
          value={query}
          maxLength={maxLength}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-white/80 pl-10 text-gray-800"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" variant="default">
          検索
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          リセット
        </Button>
      </div>
    </form>
  );
};
