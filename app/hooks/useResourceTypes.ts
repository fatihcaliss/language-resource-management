import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { resourceTypesService } from "../services/resourceTypesService"
import { ENVIRONMENT_KEYS } from "./useEnvironment"

// Keys for query caching
export const RESOURCE_TYPE_KEYS = {
  all: ["resourceTypes"] as const,
  lists: () => [...RESOURCE_TYPE_KEYS.all, "list"] as const,
  list: (filters: any) => [...RESOURCE_TYPE_KEYS.lists(), { filters }] as const,
  details: () => [...RESOURCE_TYPE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...RESOURCE_TYPE_KEYS.details(), id] as const,
}

// Hook to get all resource types
export const useGetResourceTypes = () => {
  return useQuery({
    queryKey: RESOURCE_TYPE_KEYS.lists(),
    queryFn: resourceTypesService.getResourceTypes,
  })
}

// Hook to create a new resource type
export const useCreateResourceType = (options = {}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: resourceTypesService.postCreateResourceType,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: RESOURCE_TYPE_KEYS.lists(),
      })
    },
    onError: (error: any) => {
      console.log("useCreateResourceType error::", error)
    },
    ...options,
  })

  return {
    createResourceType: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}

// Hook to update a resource type
export const useUpdateResourceType = (options = {}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: resourceTypesService.putUpdateResourceType,
    onSuccess: (data, variables) => {
      // Invalidate both the list and the specific resource detail
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: RESOURCE_TYPE_KEYS.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: RESOURCE_TYPE_KEYS.detail(variables.id),
        }),
        queryClient.invalidateQueries({
          queryKey: ENVIRONMENT_KEYS.lists(),
        }),
      ])
    },
    onError: (error: any) => {
      console.log("useUpdateResourceType error::", error)
    },
    ...options,
  })

  return {
    updateResourceType: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}

// Hook to delete a resource type
export const useDeleteResourceType = (options = {}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: resourceTypesService.deleteResourceType,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: RESOURCE_TYPE_KEYS.lists(),
      })
    },
    onError: (error: any) => {
      console.log("useDeleteResourceType error::", error)
    },
    ...options,
  })

  return {
    deleteResourceType: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}
