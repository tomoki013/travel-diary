import { useState, useEffect, useCallback, KeyboardEventHandler } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "./useDebounce";
import { SEARCH_CONFIG } from "@/constants/searchConfig";
import { TravelTopic } from "@/types/types";

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

const normalizeFilters = (
  category: string | null,
  topic: TravelTopic | null,
): { category: string | null; topic: TravelTopic | null } => {
  let nextCategory = category;
  const nextTopic = topic;

  if (nextTopic) {
    nextCategory = "tourism";
  }

  return {
    category: nextCategory,
    topic: nextTopic,
  };
};

export function useSearchOverlay({ onClose }: UseSearchOverlayProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TravelTopic | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(
    searchTerm,
    SEARCH_CONFIG.DEBOUNCE_DELAY,
  );

  const fetchSuggestions = useCallback(
    async (query: string, category: string | null, topic: TravelTopic | null) => {
      const normalized = normalizeFilters(category, topic);

      if (
        query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH &&
        !normalized.category &&
        !normalized.topic
      ) {
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
        if (normalized.category) {
          params.append("category", normalized.category);
        }
        if (normalized.topic) {
          params.append("topic", normalized.topic);
        }

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
    },
    [],
  );

  useEffect(() => {
    const normalized = normalizeFilters(selectedCategory, selectedTopic);

    if (
      debouncedSearchTerm.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH ||
      normalized.category ||
      normalized.topic
    ) {
      fetchSuggestions(debouncedSearchTerm, normalized.category, normalized.topic);
    } else {
      setSuggestions([]);
      setTotalResults(null);
    }
  }, [debouncedSearchTerm, selectedCategory, selectedTopic, fetchSuggestions]);

  const executeSearch = useCallback(() => {
    const trimmedSearchTerm = searchTerm.trim();
    const normalized = normalizeFilters(selectedCategory, selectedTopic);

    if (!trimmedSearchTerm && !normalized.category && !normalized.topic) {
      onClose();
      return;
    }

    const searchParams = new URLSearchParams();
    if (trimmedSearchTerm) {
      searchParams.append("search", trimmedSearchTerm);
    }
    if (normalized.category) {
      searchParams.append("category", normalized.category);
    }
    if (normalized.topic) {
      searchParams.append("topic", normalized.topic);
    }

    router.push(`/posts?${searchParams.toString()}`);
    onClose();
  }, [searchTerm, selectedCategory, selectedTopic, router, onClose]);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.key === "Enter") {
        executeSearch();
      }
    },
    [executeSearch],
  );

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategory((prev) => {
      const nextCategory = prev === category ? null : category;
      setSelectedTopic((currentTopic) => {
        if (nextCategory && nextCategory !== "tourism") {
          return null;
        }

        const normalized = normalizeFilters(nextCategory, currentTopic);
        return normalized.topic;
      });
      return nextCategory;
    });
  }, []);

  const toggleTopic = useCallback((topic: TravelTopic) => {
    setSelectedTopic((prev) => {
      const nextTopic = prev === topic ? null : topic;
      setSelectedCategory((currentCategory) => {
        const normalized = normalizeFilters(currentCategory, nextTopic);
        return normalized.category;
      });
      return nextTopic;
    });
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    selectedTopic,
    toggleCategory,
    toggleTopic,
    suggestions,
    totalResults,
    isLoading,
    executeSearch,
    handleKeyDown,
  };
}
