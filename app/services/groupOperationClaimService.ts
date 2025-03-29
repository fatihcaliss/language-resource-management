import { ApiResponse } from "./baseService"
import { ApplicationType } from "./environmentService"
import { apiClient } from "./instance"

// Types
export interface GroupOperationClaim {
  claimType: string
  claims: {
    id: string
    displayName: string
  }[]
}

export interface AssignClaimsToGroupParams {
  groupId: string
  operationClaimIds: string[]
}

export interface RemoveClaimsFromGroupParams {
  groupId: string
  claimIds: string[]
}

// API functions
export const groupOperationClaimService = {
  // Get all company users
  getGroupOperationClaimList: async (): Promise<GroupOperationClaim[]> => {
    const { data } = await apiClient.get<ApiResponse<GroupOperationClaim[]>>(
      `GroupOperationClaims/group-operation-claim-list`
    )
    return data.data
  },

  // Assign claims to group
  assignClaimsToGroup: async (
    params: AssignClaimsToGroupParams
  ): Promise<boolean> => {
    const { data } = await apiClient.post<ApiResponse<boolean>>(
      "GroupOperationClaims/assign-claims-to-group",
      params
    )
    return data.data
  },

  // Delete a group operation claim
  removeClaimsFromGroup: async (
    params: RemoveClaimsFromGroupParams
  ): Promise<boolean> => {
    const { data } = await apiClient.post<ApiResponse<boolean>>(
      `GroupOperationClaims/remove-claims-from-group`,
      params
    )
    return data.data
  },
}
