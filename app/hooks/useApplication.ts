import { useMutation, useQueryClient } from "@tanstack/react-query"

import { applicationService } from "../services/applicationService"

// Keys for query caching
export const APPLICATION_KEYS = {
  all: ["applications"] as const,
  lists: () => [...APPLICATION_KEYS.all, "list"] as const,
  list: (filters: any) => [...APPLICATION_KEYS.lists(), { filters }] as const,
  details: () => [...APPLICATION_KEYS.all, "detail"] as const,
  detail: (id: string) => [...APPLICATION_KEYS.details(), id] as const,
}

export const useCreateApplication = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: applicationService.createProject,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: APPLICATION_KEYS.lists(),
      })
    },
    onError: (error: any) => {
      console.log("useCreateApplication error::", error)
    },
  })

  return {
    createProject: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}
