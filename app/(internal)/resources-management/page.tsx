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
import useResources, { IResource } from "@/app/hooks/useResources"
import { apiClient } from "@/app/services/instance"

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
  } = useResources()

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
            loading={isLoading}
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
              return updateFiltersAndPagination(pagination, filters)
            }}
          />
        </div>
      </MainLayout>
    </>
  )
}

export default ResourcesManagementPage
