"use client"

import React, { useEffect, useState } from "react"
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { useMutation } from "@tanstack/react-query"
import { Button, Input, message, Popconfirm, Select, Space, Table } from "antd"
import type { ColumnsType } from "antd/es/table"

import MainLayout from "@/app/components/mainLayout/MainLayout"
import { setAuthToken } from "@/app/services/auth"
import { apiClient } from "@/app/services/instance"

// Define the interface for our resource data
interface ResourceItem {
  id: string
  domain: string
  resourceType: string
  keyValue: string
  cultureValue: string
  cultureCode: string
}

const ResourcesManagementPage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const [data, setData] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>("")

  const addNewResourceMutation = useMutation({
    mutationFn: async (params: { name: string }) => {
      const { data } = (await apiClient.post(
        "/Environments/create",
        params
      )) as {
        data: { data: boolean }
      }
      return data
    },
    onSuccess: (data) => {
      console.log("data", data)
    },
    onError: (error: any) => {
      messageApi.error(error?.error?.detail)
    },
  })

  // Mock data - replace with actual API call
  useEffect(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const mockData: ResourceItem[] = [
        {
          id: "1",
          domain: "Frontend",
          resourceType: "Label",
          keyValue: "welcome_message",
          cultureValue: "Welcome to our application",
          cultureCode: "en-US",
        },
        {
          id: "2",
          domain: "Backend",
          resourceType: "Error",
          keyValue: "invalid_credentials",
          cultureValue: "Invalid username or password",
          cultureCode: "en-US",
        },
        {
          id: "3",
          domain: "Frontend",
          resourceType: "Button",
          keyValue: "submit_button",
          cultureValue: "Submit",
          cultureCode: "en-US",
        },
        {
          id: "4",
          domain: "Frontend",
          resourceType: "Label",
          keyValue: "welcome_message",
          cultureValue: "Bienvenido a nuestra aplicación",
          cultureCode: "es-ES",
        },
      ]
      setData(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  // Handle delete resource
  const handleDelete = (id: string) => {
    setData(data.filter((item) => item.id !== id))
    messageApi.success("Resource deleted successfully")
  }

  // Filter data based on search text
  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      val.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  )

  // Define table columns
  const columns: ColumnsType<ResourceItem> = [
    {
      title: "Domain",
      dataIndex: "domain",
      key: "domain",
      sorter: (a, b) => a.domain.localeCompare(b.domain),
    },
    {
      title: "Resource Type",
      dataIndex: "resourceType",
      key: "resourceType",
      sorter: (a, b) => a.resourceType.localeCompare(b.resourceType),
      filters: [
        { text: "Label", value: "Label" },
        { text: "Button", value: "Button" },
        { text: "Error", value: "Error" },
      ],
      onFilter: (value, record) => record.resourceType === value,
    },
    {
      title: "Key Value",
      dataIndex: "keyValue",
      key: "keyValue",
      sorter: (a, b) => a.keyValue.localeCompare(b.keyValue),
    },
    {
      title: "Culture Value",
      dataIndex: "cultureValue",
      key: "cultureValue",
      ellipsis: true,
    },
    {
      title: "Culture Code",
      dataIndex: "cultureCode",
      key: "cultureCode",
      sorter: (a, b) => a.cultureCode.localeCompare(b.cultureCode),
      filters: [
        { text: "English (US)", value: "en-US" },
        { text: "Spanish (Spain)", value: "es-ES" },
      ],
      onFilter: (value, record) => record.cultureCode === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => messageApi.info(`Edit resource ${record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this resource?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
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
              <Button
                type="primary"
                icon={<PlusOutlined />}
                // onClick={() => messageApi.info("Add new resource")}
                onClick={() =>
                  addNewResourceMutation.mutateAsync({ name: "test" })
                }
              >
                Add New Resource
              </Button>
            </div>
          </div>

          <Table
            scroll={{ x: 1000 }}
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
          />
        </div>
      </MainLayout>
    </>
  )
}

export default ResourcesManagementPage
