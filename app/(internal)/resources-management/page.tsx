"use client"

import React, { useEffect, useMemo, useState } from "react"
import { PlusOutlined, SearchOutlined } from "@ant-design/icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button, Input, Table, TreeSelect } from "antd"
import type { ColumnsType } from "antd/es/table"

import MainLayout from "@/app/components/mainLayout/MainLayout"
import useResources, { IResource } from "@/app/hooks/useResources"
import { apiClient } from "@/app/services/instance"
import { debounce } from "@/app/utils/debounce"

const ResourcesManagementPage: React.FC = () => {
  const {
    contextHolder,
    data,
    searchText,
    setSearchText,
    tableFilters,
    tablePagination,
    isLoading,
    updateFiltersAndPagination,
    selectedEnvironment,
    setSelectedEnvironment,
    environmentList,
    isEnvironmentListLoading,
    selectedApplicationType,
    setSelectedApplicationType,
    requestFilters,
  } = useResources()

  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({})
  const [searchInputValue, setSearchInputValue] = useState<string>("")

  // Create a debounced search function that only updates after delay
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchText(value)
      }, 500),
    [setSearchText]
  )

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchInputValue(value)
    debouncedSearch(value)
  }

  // Derive selectedValue from selectedEnvironment and selectedApplicationType
  const selectedValue = useMemo(() => {
    if (selectedEnvironment?.id && selectedApplicationType?.id) {
      return `${selectedEnvironment.id}|${selectedApplicationType.id}`
    }
    return undefined
  }, [selectedEnvironment, selectedApplicationType])

  // Transform environmentList to treeData with proper format
  const treeData = useMemo(() => {
    if (!environmentList) return []

    return environmentList.map((environment: any) => ({
      label: environment.name,
      value: environment.id,
      disabled: !environment.applicationTypes?.length, // Only disable if no apps
      children:
        environment.applicationTypes?.map((applicationType: any) => ({
          label: applicationType.name,
          value: `${environment.id}|${applicationType.id}`,
        })) || [],
    }))
  }, [environmentList])

  // Handle environment/application type selection
  const handleEnvironmentChange = (value: string) => {
    // Clear table filters when changing environment
    setFilteredInfo({})

    if (value && value.includes("|")) {
      // This is an application type selection
      const [environmentId, applicationTypeId] = value.split("|")

      // Find the selected environment
      const environment = environmentList.find(
        (env: any) => env.id === environmentId
      )

      if (environment) {
        const applicationType = environment?.applicationTypes.find(
          (app: any) => app.id === applicationTypeId
        )

        if (applicationType) {
          // Set selected environment and application type
          setSelectedEnvironment({
            id: environmentId,
            name: environment.name,
            applicationTypes: environment.applicationTypes,
          })

          setSelectedApplicationType({
            id: applicationTypeId,
            name: applicationType.name,
          })

          // Trigger data fetch with the new selection
          updateFiltersAndPagination(
            {
              current: 1,
              pageSize: tablePagination.pageSize,
            },
            {
              selectedApplicationType: {
                id: applicationTypeId,
                name: applicationType.name,
              },
              selectedEnvironment: {
                id: environmentId,
                name: environment.name,
                applicationTypes: environment.applicationTypes,
              },
            }
          )
        }
      }
    }
  }

  // Set default environment and application type on initial load
  useEffect(() => {
    if (
      environmentList &&
      environmentList.length > 0 &&
      (!selectedEnvironment.id || !selectedApplicationType.id)
    ) {
      const defaultEnv = environmentList[0]

      if (
        defaultEnv.applicationTypes &&
        defaultEnv.applicationTypes.length > 0
      ) {
        const defaultAppType = defaultEnv.applicationTypes[0]

        // Set selected environment and application type
        setSelectedEnvironment({
          id: defaultEnv.id,
          name: defaultEnv.name,
          applicationTypes: defaultEnv.applicationTypes,
        })

        setSelectedApplicationType({
          id: defaultAppType.id,
          name: defaultAppType.name,
        })

        // Trigger initial data fetch
        updateFiltersAndPagination(
          {
            current: 1,
            pageSize: tablePagination.pageSize,
          },
          {
            selectedApplicationType: {
              id: defaultAppType.id,
              name: defaultAppType.name,
            },
            selectedEnvironment: {
              id: defaultEnv.id,
              name: defaultEnv.name,
              applicationTypes: defaultEnv.applicationTypes,
            },
          }
        )
      }
    }
  }, [environmentList])

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
      filteredValue: filteredInfo.resourceType || null,
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
      filters: tableFilters.languages.map((code) => ({
        text: code.name,
        value: code.id,
      })),
      filteredValue: filteredInfo.langCode || null,
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

  // console.log("selectedEnvironment", selectedEnvironment)
  // console.log("selectedApplicationType", selectedApplicationType)
  // console.log("environmentList", environmentList)
  // console.log("tableFilters", tableFilters)
  // console.log("selectedValue", selectedValue)

  return (
    <>
      {contextHolder}
      <MainLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Resources Management</h1>
            <div className="flex justify-between mb-4">
              <div className="flex gap-4 w-1/2">
                <TreeSelect
                  placeholder="Select Environment"
                  className="flex-1"
                  value={selectedValue}
                  onChange={handleEnvironmentChange}
                  treeData={treeData}
                  loading={isEnvironmentListLoading}
                  treeLine
                  treeDefaultExpandAll
                />
                <Input
                  placeholder="Search resources..."
                  prefix={<SearchOutlined />}
                  value={searchInputValue}
                  onChange={handleSearchInputChange}
                  className="flex-1"
                  allowClear
                />
              </div>

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
            loading={isLoading || isEnvironmentListLoading}
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
              // console.log("filters", filters)
              setFilteredInfo(filters)
              return updateFiltersAndPagination(pagination, filters)
            }}
          />
        </div>
      </MainLayout>
    </>
  )
}

export default ResourcesManagementPage
