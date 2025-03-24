import React, { useState } from "react"
import { PlusOutlined } from "@ant-design/icons"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Segmented,
  Table,
} from "antd"

import { applicationService } from "@/app/services/applicationService"
import {
  Environment,
  environmentService,
} from "@/app/services/environmentService"

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
  applicationList,
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

  // Mutations for Environments
  const createEnvironmentMutation = useMutation({
    mutationFn: environmentService.postCreateEnvironment,
    onSuccess: () => {
      messageApi.success("Environment created successfully")
      environmentForm.resetFields()
      queryClient.invalidateQueries({ queryKey: ["environments"] })
    },
    onError: () => messageApi.error("Failed to create environment"),
  })

  const updateEnvironmentMutation = useMutation({
    mutationFn: environmentService.putUpdateEnvironment,
    onSuccess: () => {
      messageApi.success("Environment updated successfully")
      environmentForm.resetFields()
      setEditingEnvironment(null)
      queryClient.invalidateQueries({ queryKey: ["environments"] })
    },
    onError: () => messageApi.error("Failed to update environment"),
  })

  const deleteEnvironmentMutation = useMutation({
    mutationFn: environmentService.deleteEnvironment,
    onSuccess: () => {
      messageApi.success("Environment deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["environments"] })
    },
    onError: () => messageApi.error("Failed to delete environment"),
  })

  // Mutations for Applications
  const createApplicationMutation = useMutation({
    mutationFn: applicationService.createProject,
    onSuccess: () => {
      messageApi.success("Application created successfully")
      applicationForm.resetFields()
      queryClient.invalidateQueries({ queryKey: ["environments"] })
    },
    onError: () => messageApi.error("Failed to create application"),
  })

  const updateApplicationMutation = useMutation({
    mutationFn: applicationService.putUpdateProject,
    onSuccess: () => {
      messageApi.success("Application updated successfully")
      applicationForm.resetFields()
      setEditingApplication(null)
      queryClient.invalidateQueries({ queryKey: ["environments"] })
    },
    onError: () => messageApi.error("Failed to update application"),
  })

  const deleteApplicationMutation = useMutation({
    mutationFn: applicationService.deleteProject,
    onSuccess: () => {
      messageApi.success("Application deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["environments"] })
    },
    onError: () => messageApi.error("Failed to delete application"),
  })

  const handleEnvironmentSubmit = async (values: { name: string }) => {
    if (editingEnvironment) {
      await updateEnvironmentMutation.mutateAsync({
        id: editingEnvironment.id,
        name: values.name,
      })
    } else {
      await createEnvironmentMutation.mutateAsync({
        name: values.name,
      })
    }
  }

  const handleApplicationSubmit = async (values: { name: string }) => {
    if (editingApplication) {
      await updateApplicationMutation.mutateAsync({
        id: editingApplication.id,
        name: values.name,
      })
    } else if (environmentList) {
      await createApplicationMutation.mutateAsync({
        name: values.name,
        environmentId: environmentList[0].id,
      })
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
            onClick={() => deleteEnvironmentMutation.mutate({ id: record.id })}
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
            onClick={() => deleteApplicationMutation.mutate({ id: record.id })}
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
        <Divider />
        {activeTab === "Environments" && (
          <div className="mt-4 max-h-full overflow-auto">
            <Form
              form={environmentForm}
              layout="inline"
              onFinish={handleEnvironmentSubmit}
              className="my-4"
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
                  createEnvironmentMutation.isPending ||
                  updateEnvironmentMutation.isPending
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
              layout="inline"
              onFinish={handleApplicationSubmit}
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
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={
                  createApplicationMutation.isPending ||
                  updateApplicationMutation.isPending
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
