import { apiClient } from "./instance"

// Types
export interface Environment {
  id: string
  name: string
  applicationTypes: ApplicationType[]
}

export interface ApplicationType {
  id: string
  name: string
}

export interface CreateEnvironmentParams {
  name: string
}

interface ApiResponse<T> {
  data: T
}

// API functions
export const environmentService = {
  // Get all environments
  getEnvironments: async (): Promise<Environment[]> => {
    const { data } =
      await apiClient.get<ApiResponse<Environment[]>>("/Environments/list")
    return data.data
  },

  // Create a new environment
  createEnvironment: async (
    params: CreateEnvironmentParams
  ): Promise<boolean> => {
    const { data } = await apiClient.post<ApiResponse<boolean>>(
      "/Environments/create",
      params
    )
    return data.data
  },
}
