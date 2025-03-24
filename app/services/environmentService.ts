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

export interface UpdateEnvironmentParams {
  id: string
  name: string
}

export interface DeleteEnvironmentParams {
  id: string
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
  postCreateEnvironment: async (
    params: CreateEnvironmentParams
  ): Promise<boolean> => {
    const { data } = await apiClient.post<ApiResponse<boolean>>(
      "/Environments/create",
      params
    )
    return data.data
  },

  // Update an environment
  putUpdateEnvironment: async (
    params: UpdateEnvironmentParams
  ): Promise<boolean> => {
    const { data } = await apiClient.put<ApiResponse<boolean>>(
      "/Environments/update",
      params
    )
    return data.data
  },

  // Delete an environment
  deleteEnvironment: async (
    params: DeleteEnvironmentParams
  ): Promise<boolean> => {
    const { data } = await apiClient.delete<ApiResponse<boolean>>(
      `/Environments/delete?Id=${params.id}`
    )
    return data.data
  },
}
