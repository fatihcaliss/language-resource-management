import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { message } from "antd"

import { apiClient } from "@/app/services/instance"

// Interface definitions
interface IResource {
  id: string
  key: string
  value: string
  langId: string
  langCode: string
  applicationTypeId: string
  applicationType: string
  resourceType: {
    id: number
    name: string
  }
  environmentId: string
}

interface ResourceItem {
  resources: {
    pageNumber: number
    pageSize: number
    totalNumberOfPages: number
    totalNumberOfRecords: number
    results: IResource[]
  }
  filters: {
    resourceTypes: {
      id: number
      name: string
    }[]
    langCodes: {
      id: string
      name: string
    }[]
  }
}

const useResources = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [data, setData] = useState<IResource[]>([])
  const [searchText, setSearchText] = useState<string>("")
  const [tableFilters, setTableFilters] = useState<{
    resourceTypes: {
      id: number
      name: string
    }[]
    langCodes: {
      id: string
      name: string
    }[]
  }>({ resourceTypes: [], langCodes: [] })
  const [requestFilters, setRequestFilters] = useState<any>({})
  const [tablePagination, setTablePagination] = useState<{
    page?: number
    pageSize?: number
    totalNumberOfPages?: number
    totalNumberOfRecords?: number
  }>({ page: 1, pageSize: 10, totalNumberOfPages: 0, totalNumberOfRecords: 0 })
  const [selectedEnvironment, setSelectedEnvironment] = useState<{
    applicationTypes: {
      id: string
      name: string
    }[]
    id: string
    name: string
  }>({ applicationTypes: [], id: "", name: "" })
  const [selectedApplicationType, setSelectedApplicationType] = useState<{
    id: string
    name: string
  }>({ id: "", name: "" })

  const {
    data: environmentList,
    isSuccess,
    isLoading: isEnvironmentListLoading,
  } = useQuery({
    queryKey: ["environmentList"],
    queryFn: () => apiClient.get("/Environments/list"),
    select: (data: any) => data.data.data,
  })

  const getResourcesMutation = useMutation({
    mutationFn: async (params: {
      environmentId: string
      applicationTypeId: string
      resourceTypeIds: number[]
      searchText: string
      page: number
      pageSize: number
      langCodes: string[]
    }) => {
      const { data } = (await apiClient.post("/Resources/list", params)) as {
        data: { data: ResourceItem }
      }
      return data
    },
    onSuccess: (data) => {
      setData(data?.data?.resources.results)
      setTableFilters(data?.data?.filters)
      setTablePagination({
        page: data?.data?.resources.pageNumber,
        pageSize: data?.data?.resources.pageSize,
        totalNumberOfPages: data?.data?.resources.totalNumberOfPages,
        totalNumberOfRecords: data?.data?.resources.totalNumberOfRecords,
      })
    },
    onError: (error: any) => {
      messageApi.error(error?.error?.detail)
    },
  })

  useEffect(() => {
    if (isSuccess && environmentList && environmentList.length > 0) {
      if (!selectedEnvironment.id) {
        const defaultEnv = environmentList[0]

        setSelectedEnvironment({
          applicationTypes: defaultEnv.applicationTypes,
          id: defaultEnv.id,
          name: defaultEnv.name,
        })

        if (
          defaultEnv.applicationTypes &&
          defaultEnv.applicationTypes.length > 0
        ) {
          const defaultAppType = defaultEnv.applicationTypes[0]
          setSelectedApplicationType({
            id: defaultAppType.id,
            name: defaultAppType.name,
          })
        }
      }

      if (selectedEnvironment.id && selectedApplicationType.id) {
        getResourcesMutation.mutateAsync({
          environmentId: selectedEnvironment.id,
          applicationTypeId: selectedApplicationType.id,
          resourceTypeIds: (requestFilters.resourceTypes ||
            []) as unknown as number[],
          searchText: searchText,
          page: tablePagination.page || 1,
          pageSize: tablePagination.pageSize || 10,
          langCodes: requestFilters.langCode || [],
        })
      }
    }
  }, [isSuccess, searchText])

  const fetchResources = (pagination: any, filters: any) => {
    return getResourcesMutation.mutateAsync({
      environmentId:
        filters?.selectedEnvironment?.id || selectedEnvironment?.id,
      applicationTypeId:
        filters?.selectedApplicationType?.id || selectedApplicationType?.id,
      resourceTypeIds: (filters.resourceType || []) as unknown as number[],
      searchText: searchText,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
      langCodes: (filters.langCode || []) as unknown as string[],
    })
  }

  const updateFiltersAndPagination = (pagination: any, filters: any) => {
    setTableFilters({
      resourceTypes: (filters.resourceTypes || []) as unknown as {
        id: number
        name: string
      }[],
      langCodes: (filters.langCodes || []) as unknown as {
        id: string
        name: string
      }[],
    })
    setRequestFilters({
      resourceTypeIds: (filters.resourceTypes || []) as unknown as number,
      langCodes: (filters.langCodes || []) as unknown as {
        id: string
        name: string
      }[],
    })
    setTablePagination({
      page: pagination.current,
      pageSize: pagination.pageSize,
      totalNumberOfPages: pagination.total,
      totalNumberOfRecords: pagination.total,
    })
    return fetchResources(pagination, filters)
  }

  const postCreateResourceMutation = useMutation({
    mutationFn: async (params: {
      environmentId: string
      applicationTypeId: string
      key: string
      value: string
      resourceType: string
      langCode: string
    }) => {
      const { data } = (await apiClient.post("/Resources/create", params)) as {
        data: { data: boolean }
      }
      return data
    },
    onSuccess: (data) => {
      messageApi.success("Resource created successfully")
    },
    onError: (error: any) => {
      messageApi.error(error?.error?.detail)
    },
  })

  return {
    contextHolder,
    data,
    searchText,
    setSearchText,
    tableFilters,
    tablePagination,
    isLoading: getResourcesMutation.isPending,
    updateFiltersAndPagination,
    fetchResources,
    selectedEnvironment,
    setSelectedEnvironment,
    environmentList,
    isEnvironmentListLoading,
    selectedApplicationType,
    setSelectedApplicationType,
    requestFilters,
    postCreateResourceMutation,
  }
}

export default useResources
export type { IResource, ResourceItem }
