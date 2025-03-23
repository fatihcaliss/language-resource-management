import { ApiResponse } from "./baseService"
import { apiClient } from "./instance"

// Types
export interface Language {
  id: string
  name: string
  code: string
}

// API functions
export const languageService = {
  // Get all languages
  getLanguages: async (): Promise<Language[]> => {
    const { data } =
      await apiClient.get<ApiResponse<Language[]>>("/Languages/list")
    return data.data
  },
}
