import { ApiResponse } from "./baseService"
import { apiClient } from "./instance"

// Types
export interface CreateProjectParams {
  name: string
  environmentId: string
}

// API functions
export const applicationService = {
  // Create a new project (application type)
  createProject: async (params: CreateProjectParams): Promise<boolean> => {
    const { data } = await apiClient.post<ApiResponse<boolean>>(
      "/ApplicationTypes/create",
      params
    )
    return data.data
  },
}
