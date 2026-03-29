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
}

export const SearchInput = ({
  initialValue = "",
  placeholder = "キーワードで検索...",
  onSearch,
  onReset,
}: SearchInputProps) => {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialValue);
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
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-white/80 text-gray-800"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
