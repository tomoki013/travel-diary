import { useState, useEffect, useCallback, KeyboardEventHandler } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "./useDebounce";
import { SEARCH_CONFIG } from "@/constants/searchConfig";
import {
  EMPTY_FILTER,
  FilterValue,
  countActiveFilters,
  normalizeFilterValue,
} from "@/data/searchFilters";

type Suggestion = {
  title: string;
  slug: string;
};

type SearchApiResponse = {
  suggestions: Suggestion[];
  total: number;
};

interface UseSearchOverlayProps {
  onClose: () => void;
}

/** filter から /api/search 用のクエリ文字列を組み立てる（q は別途付与）。 */
const buildFilterParams = (params: URLSearchParams, filter: FilterValue) => {
  const normalized = normalizeFilterValue(filter);
  if (normalized.category !== "all") {
    params.append("category", normalized.category);
  }
  if (normalized.topic !== "all") {
    params.append("topic", normalized.topic);
  }
  if (normalized.lens !== "all") {
    params.append("lens", normalized.lens);
  }
  if (normalized.tags.length > 0) {
    params.append("tags", normalized.tags.join(","));
  }
  return normalized;
};

export function useSearchOverlay({ onClose }: UseSearchOverlayProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterValue>(EMPTY_FILTER);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_CONFIG.DEBOUNCE_DELAY);

  const hasActiveFilter = countActiveFilters(filter) > 0;

  const fetchSuggestions = useCallback(async (query: string, currentFilter: FilterValue) => {
    const activeFilter = countActiveFilters(currentFilter) > 0;

    if (query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH && !activeFilter) {
      setSuggestions([]);
      setTotalResults(null);
      return;
    }

    setIsLoading(true);
    setTotalResults(null);

    try {
      const params = new URLSearchParams();
      if (query) {
        params.append("q", query);
      }
      buildFilterParams(params, currentFilter);

      const response = await fetch(`/api/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: SearchApiResponse = await response.json();
      setSuggestions(data.suggestions);
      setTotalResults(data.total);
    } catch (error) {
      console.error("検索候補の取得に失敗しました:", error);
      setSuggestions([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH || hasActiveFilter) {
      const frameId = window.requestAnimationFrame(() => {
        void fetchSuggestions(debouncedSearchTerm, filter);
      });

      return () => window.cancelAnimationFrame(frameId);
    } else {
      const frameId = window.requestAnimationFrame(() => {
        setSuggestions([]);
        setTotalResults(null);
      });

      return () => window.cancelAnimationFrame(frameId);
    }
  }, [debouncedSearchTerm, filter, hasActiveFilter, fetchSuggestions]);

  const executeSearch = useCallback(() => {
    const trimmedSearchTerm = searchTerm.trim();
    const normalized = normalizeFilterValue(filter);

    if (!trimmedSearchTerm && countActiveFilters(normalized) === 0) {
      onClose();
      return;
    }

    const searchParams = new URLSearchParams();
    if (trimmedSearchTerm) {
      searchParams.append("search", trimmedSearchTerm);
    }
    buildFilterParams(searchParams, normalized);

    router.push(`/posts?${searchParams.toString()}`);
    onClose();
  }, [searchTerm, filter, router, onClose]);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.key === "Enter") {
        executeSearch();
      }
    },
    [executeSearch],
  );

  const applyFilter = useCallback((next: FilterValue) => {
    setFilter(normalizeFilterValue(next));
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filter,
    applyFilter,
    activeFilterCount: countActiveFilters(filter),
    suggestions,
    totalResults,
    isLoading,
    executeSearch,
    handleKeyDown,
  };
}
