import { ApiResponse } from "./baseService"
import { ApplicationType } from "./environmentService"
import { apiClient } from "./instance"

// Types
export interface Group {
  id: string
  name: string
}

export interface CreateGroupParams {
  name: string
}

// export interface DeleteGroupParams {
//   id: string
// }

// export interface UpdateGroupParams {
//   id: string
//   name: string
// }

// API functions
export const groupsService = {
  // Get all projects (application types)
  getGroups: async (): Promise<Group[]> => {
    const { data } = await apiClient.get<ApiResponse<Group[]>>(`/Groups/list`)
    return data.data
  },

  // Create a new project (application type)
  createGroup: async (params: CreateGroupParams): Promise<boolean> => {
    const { data } = await apiClient.post<ApiResponse<boolean>>(
      "/Groups/create-group",
      params
    )
    return data.data
  },

  // Update a project (application type)
  //     putUpdateGroup: async (params: UpdateGroupParams): Promise<boolean> => {
  //     const { data } = await apiClient.put<ApiResponse<boolean>>(
  //       "/Groups/update",
  //       params
  //     )
  //     return data.data
  //   },

  // Delete a project (application type)
  //   deleteGroup: async (params: DeleteGroupParams): Promise<boolean> => {
  //     const { data } = await apiClient.delete<ApiResponse<boolean>>(
  //       `/Groups/delete?Id=${params.id}`
  //     )
  //     return data.data
  //   },
}
