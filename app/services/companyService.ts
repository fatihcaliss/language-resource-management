import { ApiResponse } from "./baseService"
import { ApplicationType } from "./environmentService"
import { apiClient } from "./instance"

// Types
export interface CompanyUser {
  id: string
  name: string
  userGroup: {
    id: string
    name: string
  }
}

export interface CreateCompanyUserParams {
  email: string
  password: string
  fullName: string
  groupId: string
}

export interface UpdateCompanyUserParams {
  id: string
  userName: string
  email: string
  groupId: string
  status: boolean
}

export interface DeleteGroupParams {
  id: string
}

// API functions
export const companyService = {
  // Get all company users
  getCompanyUserList: async (): Promise<CompanyUser[]> => {
    const { data } =
      await apiClient.get<ApiResponse<CompanyUser[]>>(`/Companies/user-list`)
    return data.data
  },

  // Create a new company user
  createCompanyUser: async (
    params: CreateCompanyUserParams
  ): Promise<boolean> => {
    const { data } = await apiClient.post<ApiResponse<boolean>>(
      "/Companies/create-user",
      params
    )
    return data.data
  },

  // Update a company user
  putUpdateCompanyUser: async (
    params: UpdateCompanyUserParams
  ): Promise<boolean> => {
    const { data } = await apiClient.put<ApiResponse<boolean>>(
      "/Companies/update-user",
      params
    )
    return data.data
  },

  // Delete a company user
  deleteCompanyUser: async (params: DeleteGroupParams): Promise<boolean> => {
    const { data } = await apiClient.delete<ApiResponse<boolean>>(
      `/Companies/delete-user?Id=${params.id}`
    )
    return data.data
  },
}
