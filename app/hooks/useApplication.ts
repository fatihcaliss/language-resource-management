import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { applicationService } from "../services/applicationService"
import { ENVIRONMENT_KEYS } from "./useEnvironment"

// Keys for query caching
export const APPLICATION_KEYS = {
  all: ["applications"] as const,
  lists: () => [...APPLICATION_KEYS.all, "list"] as const,
  list: (filters: any) => [...APPLICATION_KEYS.lists(), { filters }] as const,
  details: () => [...APPLICATION_KEYS.all, "detail"] as const,
  detail: (id: string) => [...APPLICATION_KEYS.details(), id] as const,
}

export const useGetApplications = (environmentId: string, options = {}) => {
  return useQuery({
    queryKey: APPLICATION_KEYS.lists(),
    queryFn: () => applicationService.getProjects(environmentId),
    ...options,
  })
}

export const useCreateApplication = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: applicationService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: APPLICATION_KEYS.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: ENVIRONMENT_KEYS.lists(),
      })
    },
    onError: (error: any) => {
      console.log("useCreateApplication error::", error)
    },
  })

  return {
    createApplication: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}

// Hook to update a application type
export const useUpdateApplication = (options = {}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: applicationService.putUpdateProject,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: APPLICATION_KEYS.lists(),
      })
    },
    onError: (error: any) => {
      console.log("useUpdateApplication error::", error)
    },
    ...options,
  })

  return {
    updateApplication: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}

// Hook to delete a application type
export const useDeleteApplication = (options = {}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: applicationService.deleteProject,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: APPLICATION_KEYS.lists(),
      })
    },
    onError: (error: any) => {
      console.log("useDeleteApplication error::", error)
    },
    ...options,
  })

  return {
    deleteApplication: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}
