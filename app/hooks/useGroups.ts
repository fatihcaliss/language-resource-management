import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { groupsService } from "../services/groupsService"

// Keys for query caching
export const GROUP_KEYS = {
  all: ["groups"] as const,
  lists: () => [...GROUP_KEYS.all, "list"] as const,
  list: (filters: any) => [...GROUP_KEYS.lists(), { filters }] as const,
  details: () => [...GROUP_KEYS.all, "detail"] as const,
  detail: (id: string) => [...GROUP_KEYS.details(), id] as const,
}

export const useGetGroups = (options = {}) => {
  return useQuery({
    queryKey: GROUP_KEYS.lists(),
    queryFn: () => groupsService.getGroups(),
    ...options,
  })
}

export const useCreateGroup = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: groupsService.createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: GROUP_KEYS.lists(),
      })
    },
    onError: (error: any) => {
      console.log("useCreateGroup error::", error)
    },
  })

  return {
    createGroup: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}

// Hook to update a group
// export const useUpdateGroup = (options = {}) => {
//   const queryClient = useQueryClient()

//   const mutation = useMutation({
//     mutationFn: groupsService.putUpdateGroup,
//     onSuccess: () => {
//       return queryClient.invalidateQueries({
//         queryKey: GROUP_KEYS.lists(),
//       })
//     },
//     onError: (error: any) => {
//       console.log("useUpdateApplication error::", error)
//     },
//     ...options,
//   })

//   return {
//     updateApplication: mutation.mutateAsync,
//     isPending: mutation.isPending,
//     error: mutation.error,
//   }
// }

// Hook to delete a group
// export const useDeleteGroup = (options = {}) => {
//   const queryClient = useQueryClient()

//   const mutation = useMutation({
//     mutationFn: groupsService.deleteGroup,
//     onSuccess: () => {
//       return queryClient.invalidateQueries({
//         queryKey: GROUP_KEYS.lists(),
//       })
//     },
//     onError: (error: any) => {
//       console.log("useDeleteGroup error::", error)
//     },
//     ...options,
//   })

//   return {
//     deleteGroup: mutation.mutateAsync,
//     isPending: mutation.isPending,
//     error: mutation.error,
//   }
// }
