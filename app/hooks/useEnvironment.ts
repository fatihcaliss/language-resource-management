import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { environmentService } from "../services/environmentService"

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
    mutationFn: environmentService.createEnvironment,
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
