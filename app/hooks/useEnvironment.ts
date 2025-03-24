import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { environmentService } from "../services/environmentService"
import { RESOURCE_TYPE_KEYS } from "./useResourceTypes"

// Keys for query caching
export const ENVIRONMENT_KEYS = {
  all: ["environments"] as const,
  lists: () => [...ENVIRONMENT_KEYS.all, "list"] as const,
  list: (filters: any) => [...ENVIRONMENT_KEYS.lists(), { filters }] as const,
  details: () => [...ENVIRONMENT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ENVIRONMENT_KEYS.details(), id] as const,
}

export const useGetEnvironments = () => {
  return useQuery({
    queryKey: ENVIRONMENT_KEYS.lists(),
    queryFn: environmentService.getEnvironments,
  })
}

export const useCreateEnvironment = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: environmentService.postCreateEnvironment,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ENVIRONMENT_KEYS.lists(),
      })
    },
    onError: (error: any) => {
      console.log("useCreateEnvironment error::", error)
    },
  })

  return {
    createEnvironment: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}

// Hook to update a environment type
export const useUpdateEnvironment = (options = {}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: environmentService.putUpdateEnvironment,
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific resource detail
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: ENVIRONMENT_KEYS.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: ENVIRONMENT_KEYS.detail(variables.id),
        }),
      ])
    },
    onError: (error: any) => {
      console.log("useUpdateEnvironment error::", error)
    },
    ...options,
  })

  return {
    updateEnvironment: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}

// Hook to delete a environment type
export const useDeleteEnvironment = (options = {}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: environmentService.deleteEnvironment,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ENVIRONMENT_KEYS.lists(),
      })
    },
    onError: (error: any) => {
      console.log("useDeleteEnvironment error::", error)
    },
    ...options,
  })

  return {
    deleteEnvironment: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}
