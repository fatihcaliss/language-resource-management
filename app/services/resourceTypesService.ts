import { apiClient } from "./instance"

// Types
export interface ResourceType {
  id: string
  name: string
}

export interface ApplicationType {
  id: string
  name: string
}

export interface PostCreateResourceTypeParams {
  name: string
}

interface ApiResponse<T> {
  data: T
}

export interface PutUpdateResourceTypeParams {
  id: string
  name: string
}

export interface DeleteResourceTypeParams {
  id: string
}

// API functions
export const resourceTypesService = {
  // Get all environments
  getResourceTypes: async (): Promise<ResourceType[]> => {
    const { data } = await apiClient.get<ApiResponse<ResourceType[]>>(
      "/ResourceTypes/list"
    )
    return data.data
  },

  // Create a new environment
  postCreateResourceType: async (
    params: PostCreateResourceTypeParams
  ): Promise<boolean> => {
    const { data } = await apiClient.post<ApiResponse<boolean>>(
      "/ResourceTypes/create",
      params
    )
    return data.data
  },

  // Update a resource type
  putUpdateResourceType: async (
    params: PutUpdateResourceTypeParams
  ): Promise<boolean> => {
    const { data } = await apiClient.put<ApiResponse<boolean>>(
      "/ResourceTypes/update",
      params
    )
    return data.data
  },

  // Delete a resource type
  deleteResourceType: async (
    params: DeleteResourceTypeParams
  ): Promise<boolean> => {
    const { data } = await apiClient.delete<ApiResponse<boolean>>(
      `/ResourceTypes/delete/${params.id}`
    )
    return data.data
  },
}
