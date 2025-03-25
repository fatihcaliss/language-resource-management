import { ApiResponse } from "./baseService"
import { ApplicationType } from "./environmentService"
import { apiClient } from "./instance"

// Types
export interface CreateProjectParams {
  name: string
  environmentId: string
}

export interface UpdateProjectParams {
  id: string
  name: string
}

export interface DeleteProjectParams {
  id: string
}

// API functions
export const applicationService = {
  // Get all projects (application types)
  getProjects: async (): Promise<ApplicationType[]> => {
    const { data } = await apiClient.get<ApiResponse<ApplicationType[]>>(
      "/ApplicationTypes/list"
    )
    return data.data
  },

  // Create a new project (application type)
  createProject: async (params: CreateProjectParams): Promise<boolean> => {
    const { data } = await apiClient.post<ApiResponse<boolean>>(
      "/ApplicationTypes/create",
      params
    )
    return data.data
  },

  // Update a project (application type)
  putUpdateProject: async (params: UpdateProjectParams): Promise<boolean> => {
    const { data } = await apiClient.put<ApiResponse<boolean>>(
      "/ApplicationTypes/update",
      params
    )
    return data.data
  },

  // Delete a project (application type)
  deleteProject: async (params: DeleteProjectParams): Promise<boolean> => {
    const { data } = await apiClient.delete<ApiResponse<boolean>>(
      `/ApplicationTypes/delete?Id=${params.id}`
    )
    return data.data
  },
}
