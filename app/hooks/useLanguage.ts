import { useQuery } from "@tanstack/react-query"

import { languageService } from "../services/languageService"

// Keys for query caching
export const LANGUAGE_KEYS = {
  all: ["languages"] as const,
  lists: () => [...LANGUAGE_KEYS.all, "list"] as const,
}

export const useGetLanguages = () => {
  return useQuery({
    queryKey: LANGUAGE_KEYS.lists(),
    queryFn: languageService.getLanguages,
  })
}
