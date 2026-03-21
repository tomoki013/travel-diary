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
      if (
        query.length < SEARCH_CONFIG.MIN_QUERY_LENGTH &&
        !category &&
        !topic
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
        if (category) {
          params.append("category", category);
        }
        if (topic) {
          params.append("topic", topic);
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
    if (
      debouncedSearchTerm.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH ||
      selectedCategory ||
      selectedTopic
    ) {
      fetchSuggestions(debouncedSearchTerm, selectedCategory, selectedTopic);
    } else {
      setSuggestions([]);
      setTotalResults(null);
    }
  }, [debouncedSearchTerm, selectedCategory, selectedTopic, fetchSuggestions]);

  const executeSearch = useCallback(() => {
    const trimmedSearchTerm = searchTerm.trim();

    if (!trimmedSearchTerm && !selectedCategory && !selectedTopic) {
      onClose();
      return;
    }

    const searchParams = new URLSearchParams();
    if (trimmedSearchTerm) {
      searchParams.append("search", trimmedSearchTerm);
    }
    if (selectedCategory) {
      searchParams.append("category", selectedCategory);
    }
    if (selectedTopic) {
      searchParams.append("topic", selectedTopic);
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
    setSelectedCategory((prev) => (prev === category ? null : category));
  }, []);

  const toggleTopic = useCallback((topic: TravelTopic) => {
    setSelectedTopic((prev) => (prev === topic ? null : topic));
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
