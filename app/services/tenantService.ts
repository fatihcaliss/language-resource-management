import { apiClient } from "./instance"

// Tenant data interfaces
export interface TenantData {
  tenantId: string
  name: string
  subscriptionId: string | null
  subscriptionStatusId: number
}

export interface TenantResponse {
  statusCode: number
  title: string
  data: TenantData
  error: string | null
}

// Subscription status constants
export const SUBSCRIPTION_STATUS = {
  PENDING: 1,
  ACTIVE: 2,
  FROZEN: 3,
  PAYMENT_DECLINED: 4,
  CLOSED: 5,
} as const

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS]

// API functions
export const tenantService = {
  // Get current tenant information
  getTenant: async (): Promise<TenantData> => {
    // const token = localStorage.getItem("token")
    const { data } = await apiClient.get<TenantResponse>(
      "http://localhost:16000/api/Tenants"
      // {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json",
      //     Authorization: `${token}`,
      //   },
      // }
    )
    return data.data
  },

  // Helper function to check if subscription is active
  hasActiveSubscription: (tenant: TenantData): boolean => {
    return (
      tenant.subscriptionId !== null &&
      tenant.subscriptionStatusId === SUBSCRIPTION_STATUS.ACTIVE
    )
  },

  // Helper function to get subscription status name
  getSubscriptionStatusName: (statusId: number): string => {
    switch (statusId) {
      case SUBSCRIPTION_STATUS.PENDING:
        return "Pending"
      case SUBSCRIPTION_STATUS.ACTIVE:
        return "Active"
      case SUBSCRIPTION_STATUS.FROZEN:
        return "Frozen"
      case SUBSCRIPTION_STATUS.PAYMENT_DECLINED:
        return "Payment Declined"
      case SUBSCRIPTION_STATUS.CLOSED:
        return "Closed"
      default:
        return "Unknown"
    }
  },
}
