"use client"

import React, { useEffect, useState } from "react"
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button, Input, message, Popconfirm, Space, Table } from "antd"
import type { ColumnsType } from "antd/es/table"

import MainLayout from "@/app/components/mainLayout/MainLayout"
import { apiClient } from "@/app/services/instance"

// Define the interface for our resource data

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
  }
}

const ResourcesManagementPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const [data, setData] = useState<IResource[]>([])
  const [searchText, setSearchText] = useState<string>("")
  const [tableFilters, setTableFilters] = useState<{
    resourceTypes: {
      id: number
      name: string
    }[]
  }>({ resourceTypes: [] })
  const [requestFilters, setRequestFilters] = useState<any>({})
  const [tablePagination, setTablePagination] = useState<{
    page?: number
    pageSize?: number
    totalNumberOfPages?: number
    totalNumberOfRecords?: number
  }>({ page: 1, pageSize: 10, totalNumberOfPages: 0, totalNumberOfRecords: 0 })
  const { data: environmentList, isSuccess } = useQuery({
    queryKey: ["environmentList"],
    queryFn: () => apiClient.get("/Environments/list"),
    select: (data: any) => data.data.data,
  })

  const getResourcesMutation = useMutation({
    mutationFn: async (params: {
      environmentId: string
      applicationTypeId: string
      resourceTypeId: number | null
      searchText: string
      page: number
      pageSize: number
    }) => {
      const { data } = (await apiClient.post("/Resources/list", params)) as {
        data: { data: ResourceItem }
      }
      return data
    },
    onSuccess: (data) => {
      console.log("data", data?.data)
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
      getResourcesMutation.mutateAsync({
        environmentId: environmentList[0].id,
        applicationTypeId: environmentList[0].applicationTypes[0].id,
        resourceTypeId:
          (requestFilters.resourceTypes &&
            requestFilters.resourceTypes?.find((type: any) => type.id === 3)
              ?.id) ||
          null,
        searchText: "",
        page: tablePagination.page || 1,
        pageSize: tablePagination.pageSize || 10,
      })
    }
  }, [isSuccess, JSON.stringify(tableFilters), JSON.stringify(tablePagination)])

  // Define table columns
  const columns: ColumnsType<IResource> = [
    {
      title: "Application",
      dataIndex: "applicationType",
      key: "applicationType",
      sorter: (a, b) => a.applicationType.localeCompare(b.applicationType),
    },
    {
      title: "Resource Type",
      dataIndex: "resourceType",
      key: "resourceType",
      filters: tableFilters.resourceTypes.map((type) => ({
        text: type.name,
        value: type.id,
      })),
      onFilter: (value, record) => record.resourceType.id === value,
      sorter: (a, b) => a.resourceType.name.localeCompare(b.resourceType.name),
      render: (_, record) => record.resourceType.name,
    },
    {
      title: "Key Value",
      dataIndex: "key",
      key: "key",
      sorter: (a, b) => a.key.localeCompare(b.key),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      ellipsis: true,
    },
    {
      title: "Culture Code",
      dataIndex: "langCode",
      key: "langCode",
      sorter: (a, b) => a.langCode.localeCompare(b.langCode),
      filters: [
        { text: "English (US)", value: "en-US" },
        { text: "Spanish (Spain)", value: "es-ES" },
      ],
      onFilter: (value, record) => record.langCode === value,
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Button
    //         type="primary"
    //         icon={<EditOutlined />}
    //         onClick={() => messageApi.info(`Edit resource ${record.id}`)}
    //       >
    //         Edit
    //       </Button>
    //       <Popconfirm
    //         title="Are you sure you want to delete this resource?"
    //         onConfirm={() => handleDelete(record.id)}
    //         okText="Yes"
    //         cancelText="No"
    //       >
    //         <Button danger icon={<DeleteOutlined />}>
    //           Delete
    //         </Button>
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
  ]

  return (
    <>
      {contextHolder}
      <MainLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Resources Management</h1>
            <div className="flex justify-between mb-4">
              <Input
                placeholder="Search resources..."
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button type="primary" icon={<PlusOutlined />}>
                Add New Resource
              </Button>
            </div>
          </div>

          <Table
            scroll={{ x: 1000 }}
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={getResourcesMutation.isPending}
            pagination={{
              defaultCurrent: 1,
              defaultPageSize: 10,
              pageSize: tablePagination.pageSize || 10,
              current: tablePagination.page || 1,
              total: tablePagination.totalNumberOfRecords || 0,
              pageSizeOptions: [10, 20, 50, 100],
              showSizeChanger: true,
              showQuickJumper: false,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            onChange={(pagination, filters, sorter, extra) => {
              console.log("pagination", pagination)
              console.log("filters", filters)
              console.log("sorter", sorter)
              console.log("extra", extra)
              setTableFilters({
                resourceTypes: (filters.resourceTypes || []) as unknown as {
                  id: number
                  name: string
                }[],
              })
              setRequestFilters({
                resourceTypeId: (filters.resourceTypeId ||
                  []) as unknown as number,
              })
              setTablePagination({
                page: pagination.current,
                pageSize: pagination.pageSize,
                totalNumberOfPages: pagination.total,
                totalNumberOfRecords: pagination.total,
              })
            }}
          />
        </div>
      </MainLayout>
    </>
  )
}

export default ResourcesManagementPage
