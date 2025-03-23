import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"

import {
  DeleteResourceTypeParams,
  PostCreateResourceTypeParams,
  PutUpdateResourceTypeParams,
  ResourceType,
  resourceTypesService,
} from "../services/resourceTypesService"

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
  const [messageApi, contextHolder] = message.useMessage()

  const {
    onSuccessMessage = "Resource type created successfully!",
    onErrorMessage = "Failed to create resource type",
    onSuccess: customOnSuccess,
    onError: customOnError,
  } = options as {
    onSuccessMessage?: string
    onErrorMessage?: string
    onSuccess?: (data: any, variables: any, context: any) => void
    onError?: (error: any, variables: any, context: any) => void
  }

  const mutation = useMutation({
    mutationFn: resourceTypesService.postCreateResourceType,
    onSuccess: (data, variables, context) => {
      messageApi.success(onSuccessMessage)
      // Allow custom success handler to run
      if (customOnSuccess) {
        customOnSuccess(data, variables, context)
      }
      return queryClient.invalidateQueries({
        queryKey: RESOURCE_TYPE_KEYS.lists(),
      })
    },
    onError: (error: any, variables, context) => {
      messageApi.error(error?.error?.detail || onErrorMessage)
      // Allow custom error handler to run
      if (customOnError) {
        customOnError(error, variables, context)
      }
    },
  })

  return {
    createResourceType: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    contextHolder,
  }
}

// Hook to update a resource type
export const useUpdateResourceType = (options = {}) => {
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()

  const {
    onSuccessMessage = "Resource type updated successfully!",
    onErrorMessage = "Failed to update resource type",
    onSuccess: customOnSuccess,
    onError: customOnError,
  } = options as {
    onSuccessMessage?: string
    onErrorMessage?: string
    onSuccess?: (data: any, variables: any, context: any) => void
    onError?: (error: any, variables: any, context: any) => void
  }

  const mutation = useMutation({
    mutationFn: resourceTypesService.putUpdateResourceType,
    onSuccess: (data, variables, context) => {
      messageApi.success(onSuccessMessage)
      if (customOnSuccess) {
        customOnSuccess(data, variables, context)
      }
      // Invalidate both the list and the specific resource detail
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: RESOURCE_TYPE_KEYS.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: RESOURCE_TYPE_KEYS.detail(variables.id),
        }),
      ])
    },
    onError: (error: any, variables, context) => {
      messageApi.error(error?.error?.detail || onErrorMessage)
      if (customOnError) {
        customOnError(error, variables, context)
      }
    },
  })

  return {
    updateResourceType: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    contextHolder,
  }
}

// Hook to delete a resource type
export const useDeleteResourceType = (options = {}) => {
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()

  const {
    onSuccessMessage = "Resource type deleted successfully!",
    onErrorMessage = "Failed to delete resource type",
    onSuccess: customOnSuccess,
    onError: customOnError,
  } = options as {
    onSuccessMessage?: string
    onErrorMessage?: string
    onSuccess?: (data: any, variables: any, context: any) => void
    onError?: (error: any, variables: any, context: any) => void
  }

  const mutation = useMutation({
    mutationFn: resourceTypesService.deleteResourceType,
    onSuccess: (data, variables, context) => {
      messageApi.success(onSuccessMessage)
      if (customOnSuccess) {
        customOnSuccess(data, variables, context)
      }
      return queryClient.invalidateQueries({
        queryKey: RESOURCE_TYPE_KEYS.lists(),
      })
    },
    onError: (error: any, variables, context) => {
      messageApi.error(error?.error?.detail || onErrorMessage)
      if (customOnError) {
        customOnError(error, variables, context)
      }
    },
  })

  return {
    deleteResourceType: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    contextHolder,
  }
}
