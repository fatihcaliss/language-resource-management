"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Table,
  TreeSelect,
} from "antd"
import type { ColumnsType } from "antd/es/table"
import Title from "antd/es/typography/Title"

import EnvironmentSettingsModal from "@/app/components/environmentApplicationManageModal/EnvironmentAppSettingsModal"
import MainLayout from "@/app/components/mainLayout/MainLayout"
import useResources, { IResource } from "@/app/hooks/useResources"
import {
  useCreateResourceType,
  useDeleteResourceType,
  useGetResourceTypes,
  useUpdateResourceType,
} from "@/app/hooks/useResourceTypes"
import { debounce } from "@/app/utils/debounce"

const ResourcesManagementPage: React.FC = () => {
  const {
    contextHolder,
    data,
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
    postCreateResourceMutation,
    languageList,
    isLanguageListLoading,
    messageApi,
  } = useResources()

  const [filteredInfo, setFilteredInfo] = useState<Record<string, any>>({})
  const [searchInputValue, setSearchInputValue] = useState<string>("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isResourceTypeModalVisible, setIsResourceTypeModalVisible] =
    useState(false)
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false)
  const [resourceTypeForm] = Form.useForm()
  const [editingResourceType, setEditingResourceType] = useState<{
    id: string
    name: string
  } | null>(null)
  const [form] = Form.useForm()

  const { createResourceType, isPending: isCreateResourceTypeLoading } =
    useCreateResourceType()
  const { updateResourceType, isPending: isUpdateResourceTypeLoading } =
    useUpdateResourceType()
  const { deleteResourceType, isPending: isDeleteResourceTypeLoading } =
    useDeleteResourceType()
  const { data: resourceTypeList, isLoading: isGetResourceTypeLoading } =
    useGetResourceTypes()

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
    if (
      selectedEnvironment?.id &&
      selectedApplicationType?.id &&
      selectedEnvironment.applicationTypes?.length
    ) {
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
      const environment = environmentList?.find(
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

  // Handle modal visibility
  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalVisible(false)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      await postCreateResourceMutation.mutateAsync({
        environmentId: selectedEnvironment.id,
        applicationTypeId: selectedApplicationType.id,
        key: values.key,
        value: values.value,
        resourceTypeId: values.resourceType,
        langCode: values.langCode,
      })

      // Reset form and close modal on success
      form.resetFields()
      setIsModalVisible(false)

      // Refresh the table data
      updateFiltersAndPagination(
        {
          current: tablePagination.page,
          pageSize: tablePagination.pageSize,
        },
        {
          selectedApplicationType,
          selectedEnvironment,
        }
      )
    } catch (error) {
      // Form validation error is handled by the form itself
      console.error("Submission error:", error)
    }
  }

  // Handle resource type modal visibility
  const showResourceTypeModal = () => {
    setIsResourceTypeModalVisible(true)
  }

  const handleResourceTypeCancel = () => {
    resourceTypeForm.resetFields()
    setEditingResourceType(null)
    setIsResourceTypeModalVisible(false)
  }

  const handleResourceTypeSubmit = async () => {
    try {
      const values = await resourceTypeForm.validateFields()

      if (editingResourceType) {
        // Update existing resource type
        await updateResourceType({
          id: editingResourceType.id,
          name: values.typeName,
        })
        messageApi.success("Resource type updated successfully!")
      } else {
        // Create new resource type
        await createResourceType({
          name: values.typeName,
        })
        messageApi.success("Resource type created successfully!")
      }

      // Reset form and state
      resourceTypeForm.resetFields()
      setEditingResourceType(null)
      setIsResourceTypeModalVisible(false)
    } catch (error) {
      console.error("Resource type submission error:", error)
      messageApi.error("Failed to create resource type")
    }
  }

  const handleEditResourceType = (record: { id: string; name: string }) => {
    setEditingResourceType(record)
    resourceTypeForm.setFieldsValue({ typeName: record.name })
  }

  const handleDeleteResourceType = async (id: string) => {
    try {
      await deleteResourceType({ id })
      messageApi.success("Resource type deleted successfully!")
    } catch (error) {
      console.error("Delete resource type error:", error)
      messageApi.error("Failed to delete resource type")
    }
  }

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
      // onFilter: (value, record) => record.resourceType === value,
      sorter: (a, b) => a.resourceType.localeCompare(b.resourceType),
      render: (_, record) => record.resourceType,
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
      title: "Language Code",
      dataIndex: "langCode",
      key: "langCode",
      sorter: (a, b) => a.langCode.localeCompare(b.langCode),
      filters: tableFilters.langCodes.map((code) => ({
        text: code.name,
        value: code.id,
      })),
      filteredValue: filteredInfo.langCode || null,
      onFilter: (value, record) => {
        return record.langId === value
      },
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
              <div className="flex gap-2 w-1/2">
                <Button
                  type="default"
                  icon={<SettingOutlined />}
                  onClick={() => setIsSettingsModalVisible(true)}
                />

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

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
                disabled={
                  !selectedEnvironment.id || !selectedApplicationType.id
                }
              >
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

          {/* Create New Resource Modal */}
          <Modal
            title="Create New Resource"
            open={isModalVisible}
            onCancel={handleCancel}
            onOk={handleSubmit}
            confirmLoading={postCreateResourceMutation.isPending}
          >
            <Form form={form} layout="vertical" name="create_resource_form">
              <Form.Item
                name="key"
                label="Resource Key"
                rules={[
                  { required: true, message: "Please enter a resource key" },
                ]}
              >
                <Input placeholder="Enter resource key" />
              </Form.Item>

              <Form.Item
                name="value"
                label="Resource Value"
                rules={[
                  { required: true, message: "Please enter a resource value" },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Enter resource value" />
              </Form.Item>
              <div className="flex flex-row items-end gap-2 mb-6 justify-between">
                <Form.Item
                  name="resourceType"
                  label="Resource Type"
                  rules={[
                    {
                      required: true,
                      message: "Please select a resource type",
                    },
                  ]}
                  className="!mb-0 flex-2/3"
                >
                  <Select
                    placeholder="Select resource type"
                    loading={isGetResourceTypeLoading}
                    allowClear
                    showSearch
                    options={resourceTypeList?.map((type) => ({
                      label: type.name,
                      value: type.id,
                    }))}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {resourceTypeList?.map((type) => (
                      <Select.Option key={type.id} value={type.id}>
                        {type.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button
                  type="default"
                  icon={<PlusOutlined />}
                  onClick={showResourceTypeModal}
                  className="flex-1/3"
                >
                  Manage Resource Types
                </Button>
              </div>

              <Form.Item
                name="langCode"
                label="Language Code"
                rules={[
                  { required: true, message: "Please select a language code" },
                ]}
              >
                <Select
                  placeholder="Select culture code"
                  loading={isLanguageListLoading}
                  allowClear
                  showSearch
                  options={languageList?.map((lang) => ({
                    label: lang.name,
                    value: lang.id,
                  }))}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {languageList?.map((lang) => (
                    <Select.Option key={lang.id} value={lang.id}>
                      {lang.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Modal>

          {/* Resource Types Management Modal */}
          <Modal
            title="Manage Resource Types"
            open={isResourceTypeModalVisible}
            onCancel={handleResourceTypeCancel}
            footer={[
              <Button key="cancel" onClick={handleResourceTypeCancel}>
                Close
              </Button>,
            ]}
            width={600}
          >
            <div className="mb-4 flex w-full">
              <Form
                form={resourceTypeForm}
                layout="inline"
                onFinish={handleResourceTypeSubmit}
                className="w-full"
              >
                <Form.Item
                  name="typeName"
                  rules={[
                    {
                      required: true,
                      message: "Please enter resource type name",
                    },
                  ]}
                  className="flex-1 mr-2 min-w-[212px]"
                >
                  <Input placeholder="Enter resource type name" />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={
                    isCreateResourceTypeLoading || isUpdateResourceTypeLoading
                  }
                  className="flex"
                >
                  {editingResourceType ? "Update" : "Add"} Resource Type
                </Button>
                {editingResourceType && (
                  <Button
                    className="ml-2"
                    onClick={() => {
                      resourceTypeForm.resetFields()
                      setEditingResourceType(null)
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </Form>
            </div>
            <Divider />
            <div className="mt-4">
              <Title level={5}>Existing Resource Types</Title>
              <div className="max-h-60 overflow-y-auto">
                <Table
                  dataSource={resourceTypeList}
                  rowKey="id"
                  loading={isGetResourceTypeLoading}
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: "Name",
                      dataIndex: "name",
                      key: "name",
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      width: 150,
                      render: (_, record) => (
                        <div className="flex gap-2">
                          <Button
                            size="small"
                            type="primary"
                            onClick={() => handleEditResourceType(record)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            danger
                            loading={isDeleteResourceTypeLoading}
                            onClick={() => handleDeleteResourceType(record.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </Modal>

          <EnvironmentSettingsModal
            isOpen={isSettingsModalVisible}
            onClose={() => setIsSettingsModalVisible(false)}
            environmentList={environmentList}
          />
        </div>
      </MainLayout>
    </>
  )
}

export default ResourcesManagementPage
