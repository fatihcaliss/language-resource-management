import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { companyService } from "../services/companyService"

// Keys for query caching
export const COMPANY_KEYS = {
  all: ["company"] as const,
  lists: () => [...COMPANY_KEYS.all, "list"] as const,
  list: (filters: any) => [...COMPANY_KEYS.lists(), { filters }] as const,
  details: () => [...COMPANY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...COMPANY_KEYS.details(), id] as const,
}

export const useGetCompanyUserList = (options = {}) => {
  return useQuery({
    queryKey: COMPANY_KEYS.lists(),
    queryFn: () => companyService.getCompanyUserList(),
    ...options,
  })
}

export const useCreateCompanyUser = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: companyService.createCompanyUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COMPANY_KEYS.lists(),
      })
    },
    onError: (error: any) => {
      console.log("useCreateCompanyUser error::", error)
    },
  })

  return {
    createCompanyUser: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}

// Hook to update a company user
export const useUpdateCompanyUser = (options = {}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: companyService.putUpdateCompanyUser,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: COMPANY_KEYS.lists(),
      })
    },
    onError: (error: any) => {
      console.log("useUpdateCompanyUser error::", error)
    },
    ...options,
  })

  return {
    updateCompanyUser: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}

// Hook to delete a company user
export const useDeleteCompanyUser = (options = {}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: companyService.deleteCompanyUser,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: COMPANY_KEYS.lists(),
      })
    },
    onError: (error: any) => {
      console.log("useDeleteCompanyUser error::", error)
    },
    ...options,
  })

  return {
    deleteCompanyUser: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}
