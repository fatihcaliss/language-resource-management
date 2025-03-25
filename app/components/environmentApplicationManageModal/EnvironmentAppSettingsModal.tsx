import React, { useState } from "react"
import { PlusOutlined } from "@ant-design/icons"
import { useQueryClient } from "@tanstack/react-query"
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Segmented,
  Select,
  Table,
} from "antd"

import {
  useCreateApplication,
  useDeleteApplication,
  useGetApplications,
  useUpdateApplication,
} from "@/app/hooks/useApplication"
import {
  useCreateEnvironment,
  useDeleteEnvironment,
  useUpdateEnvironment,
} from "@/app/hooks/useEnvironment"
import { Environment } from "@/app/services/environmentService"

interface Application {
  id: string
  name: string
}

interface EnvironmentSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  environmentList?: Environment[]
  applicationList?: Application[]
}

interface EditingItem {
  id: string
  name: string
}

const EnvironmentSettingsModal: React.FC<EnvironmentSettingsModalProps> = ({
  isOpen,
  onClose,
  environmentList,
  // applicationList,
}) => {
  const [activeTab, setActiveTab] = useState<string | number>("Environments")
  const [environmentForm] = Form.useForm()
  const [applicationForm] = Form.useForm()
  const [editingEnvironment, setEditingEnvironment] =
    useState<EditingItem | null>(null)
  const [editingApplication, setEditingApplication] =
    useState<EditingItem | null>(null)
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()

  const { data: applicationList } = useGetApplications()

  // Mutations for Environments
  const { createEnvironment, isPending: isCreateEnvironmentPending } =
    useCreateEnvironment()
  const { updateEnvironment, isPending: isUpdateEnvironmentPending } =
    useUpdateEnvironment()
  const { deleteEnvironment, isPending: isDeleteEnvironmentPending } =
    useDeleteEnvironment()
  const { createApplication, isPending: isCreateApplicationPending } =
    useCreateApplication()
  const { updateApplication, isPending: isUpdateApplicationPending } =
    useUpdateApplication()
  const { deleteApplication, isPending: isDeleteApplicationPending } =
    useDeleteApplication()

  const handleEnvironmentSubmit = async (values: { name: string }) => {
    if (editingEnvironment) {
      await updateEnvironment({
        id: editingEnvironment.id,
        name: values.name,
      })
      messageApi.success("Environment updated successfully")
      environmentForm.resetFields()
      setEditingEnvironment(null)
    } else {
      await createEnvironment({
        name: values.name,
      })
      messageApi.success("Environment created successfully")
      environmentForm.resetFields()
    }
  }

  const handleApplicationSubmit = async (values: { name: string }) => {
    if (editingApplication) {
      await updateApplication({
        id: editingApplication.id,
        name: values.name,
      })
      messageApi.success("Application updated successfully")
      applicationForm.resetFields()
      setEditingApplication(null)
    } else if (environmentList) {
      await createApplication({
        name: values.name,
        environmentId: environmentList[0].id,
      })
      messageApi.success("Application created successfully")
      applicationForm.resetFields()
    }
  }

  const environmentColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Environment) => (
        <div className="flex gap-2">
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setEditingEnvironment({ id: record.id, name: record.name })
              environmentForm.setFieldsValue({ name: record.name })
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            loading={isDeleteEnvironmentPending}
            onClick={() => deleteEnvironment({ id: record.id })}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  const applicationColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: { id: string; name: string }) => (
        <div className="flex gap-2">
          <Button
            size="small"
            type="primary"
            onClick={() => {
              setEditingApplication({ id: record.id, name: record.name })
              applicationForm.setFieldsValue({ name: record.name })
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            danger
            loading={isDeleteApplicationPending}
            onClick={() => deleteApplication({ id: record.id })}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <Segmented
            options={["Environments", "Applications"]}
            value={activeTab}
            onChange={(value) => {
              setActiveTab(value)
              setEditingEnvironment(null)
              setEditingApplication(null)
              environmentForm.resetFields()
              applicationForm.resetFields()
            }}
            // block
            className="mb-4"
          />
        }
        open={isOpen}
        onCancel={() => {
          onClose()
          setEditingEnvironment(null)
          setEditingApplication(null)
          environmentForm.resetFields()
          applicationForm.resetFields()
        }}
        width={600}
        footer={null}
        styles={{ body: { maxHeight: "60vh", overflow: "auto" } }}
      >
        {activeTab === "Environments" && (
          <div className="mt-4 max-h-full overflow-auto">
            <Form
              form={environmentForm}
              onFinish={handleEnvironmentSubmit}
              className="my-4"
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
            >
              <Form.Item
                name="name"
                rules={[
                  { required: true, message: "Please enter environment name" },
                ]}
                className="flex-1"
              >
                <Input placeholder="Enter environment name" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={
                  isCreateEnvironmentPending || isUpdateEnvironmentPending
                }
              >
                {editingEnvironment ? "Update" : "Add"} Environment
              </Button>
              {editingEnvironment && (
                <Button
                  className="ml-2"
                  onClick={() => {
                    environmentForm.resetFields()
                    setEditingEnvironment(null)
                  }}
                >
                  Cancel
                </Button>
              )}
            </Form>
            <Divider />
            <Table
              dataSource={environmentList ? environmentList : []}
              columns={environmentColumns}
              rowKey="id"
              size="small"
              pagination={false}
            />
          </div>
        )}

        {activeTab === "Applications" && (
          <div className="mt-4 max-h-full overflow-auto">
            <Form
              form={applicationForm}
              onFinish={handleApplicationSubmit}
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
            >
              <Form.Item
                name="name"
                rules={[
                  { required: true, message: "Please enter application name" },
                ]}
                className="flex-1"
              >
                <Input placeholder="Enter application name" />
              </Form.Item>
              {!editingApplication && (
                <Form.Item
                  name="environmentId"
                  rules={[
                    {
                      required: true,
                      message: "Please select an environment",
                    },
                  ]}
                >
                  <Select placeholder="Select an environment">
                    {environmentList?.map((env: any) => (
                      <Select.Option key={env.id} value={env.id}>
                        {env.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={
                  isCreateApplicationPending || isUpdateApplicationPending
                }
                disabled={!environmentList}
              >
                {editingApplication ? "Update" : "Add"} Application
              </Button>
              {editingApplication && (
                <Button
                  className="ml-2"
                  onClick={() => {
                    applicationForm.resetFields()
                    setEditingApplication(null)
                  }}
                >
                  Cancel
                </Button>
              )}
            </Form>
            <Divider />
            <Table
              dataSource={applicationList ? applicationList : []}
              columns={applicationColumns}
              rowKey="id"
              size="small"
              pagination={false}
            />
          </div>
        )}
      </Modal>
    </>
  )
}

export default EnvironmentSettingsModal
