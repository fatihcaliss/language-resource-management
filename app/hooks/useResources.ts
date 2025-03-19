import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { message } from "antd"

import { apiClient } from "@/app/services/instance"

// Interface tanımlamaları
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
    languages: {
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
    languages: {
      id: string
      name: string
    }[]
  }>({ resourceTypes: [], languages: [] })
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
  console.log("environmentList", environmentList)
  const getResourcesMutation = useMutation({
    mutationFn: async (params: {
      environmentId: string
      applicationTypeId: string
      resourceTypeIds: number[]
      searchText: string
      page: number
      pageSize: number
      languageCodes: string[]
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
    if (isSuccess) {
      //   console.log("inside1", requestFilters)
      //   console.log("inside2", tableFilters)
      getResourcesMutation.mutateAsync({
        environmentId: environmentList[0].id,
        applicationTypeId: environmentList[0].applicationTypes[0].id,
        resourceTypeIds:
          (requestFilters.resourceTypes &&
            requestFilters.resourceTypes?.find((type: any) => type.id === 3)
              ?.id) ||
          null,
        searchText: searchText,
        page: tablePagination.page || 1,
        pageSize: tablePagination.pageSize || 10,
        languageCodes: requestFilters.langCode || null,
      })
      setSelectedEnvironment({
        applicationTypes: environmentList[0].applicationTypes,
        id: environmentList[0].id,
        name: environmentList[0].name,
      })
      setSelectedApplicationType({
        id: environmentList[0].applicationTypes[0].id,
        name: environmentList[0].applicationTypes[0].name,
      })
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
      languageCodes: (filters.langCode || []) as unknown as string[],
    })
  }

  const updateFiltersAndPagination = (pagination: any, filters: any) => {
    setTableFilters({
      resourceTypes: (filters.resourceTypes || []) as unknown as {
        id: number
        name: string
      }[],
      languages: (filters.languages || []) as unknown as {
        id: string
        name: string
      }[],
    })
    setRequestFilters({
      resourceTypeIds: (filters.resourceTypes || []) as unknown as number,
      languageCodes: (filters.langCode || []) as unknown as {
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
  }
}

export default useResources
export type { IResource, ResourceItem }
