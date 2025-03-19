"use client"

import { useEffect, useState } from "react"
import {
  BarChartOutlined,
  DownOutlined,
  FileTextOutlined,
  PlusOutlined,
  TeamOutlined,
  TranslationOutlined,
} from "@ant-design/icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Skeleton,
  Statistic,
  Tree,
  Typography,
} from "antd"
import type { TreeDataNode, TreeProps } from "antd"

import MainLayout from "@/app/components/mainLayout/MainLayout"
import { apiClient } from "@/app/services/instance"

const { Title } = Typography

export default function DashboardPage() {
  const [username, setUsername] = useState("Admin")
  const [messageApi, contextHolder] = message.useMessage()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [projectForm] = Form.useForm()

  const { data: userData, isFetching: isUserDataFetching } = useQuery({
    queryKey: ["userData"],
    queryFn: () => apiClient.get("/Users/get-user"),
    select: (data: any) => data.data.data,
  })

  const {
    data: environmentList,
    isSuccess,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["environmentList"],
    queryFn: () => apiClient.get("/Environments/list"),
    select: (data: any) => data.data.data,
  })

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
      refetch()
    },
    onError: (error: any) => {
      messageApi.error(error?.error?.detail)
    },
  })

  const addNewProjectMutation = useMutation({
    mutationFn: async (params: { name: string; environmentId: string }) => {
      const { data } = (await apiClient.post(
        "/ApplicationTypes/create",
        params
      )) as {
        data: { data: boolean }
      }
      return data
    },
    onSuccess: (data) => {
      console.log("data", data)
      refetch()
    },
    onError: (error: any) => {
      messageApi.error(error?.error?.detail)
    },
  })
  // Transform environment data for tree component
  const transformEnvironmentData = (data: any[]): TreeDataNode[] => {
    return data?.map((env, envIndex) => ({
      title: env.name,
      key: `${envIndex}`,
      value: env.id,
      children: env.applicationTypes.map((app: any, appIndex: number) => ({
        title: app.name,
        key: `${envIndex}-${appIndex}`,
        value: app.id,
      })),
    }))
  }
  console.log("environmentList", environmentList)

  const mockData = [
    {
      name: "dev",
      applicationTypes: [
        {
          name: "Finance",
        },
        {
          name: "Payment",
        },
        {
          name: "Ticket Management",
        },
        {
          name: "Key Management",
        },
      ],
    },
    {
      name: "prod",
      applicationTypes: [
        {
          name: "E-Commerce",
        },
        {
          name: "Analytics",
        },
        {
          name: "User Management",
        },
      ],
    },
  ]

  const treeData = isSuccess ? transformEnvironmentData(environmentList) : []

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  const handleSubmit = async (values: { name: string }) => {
    try {
      await addNewResourceMutation.mutateAsync(values)
      messageApi.success("Environment created successfully!")
      form.resetFields()
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error creating environment:", error)
    }
  }

  // New functions for the project modal
  const showProjectModal = () => {
    setIsProjectModalOpen(true)
  }

  const handleProjectCancel = () => {
    projectForm.resetFields()
    setIsProjectModalOpen(false)
  }

  const handleProjectSubmit = async (values: {
    name: string
    environmentId: string
  }) => {
    try {
      await addNewProjectMutation.mutateAsync(values)
      messageApi.success("Project created successfully!")
      projectForm.resetFields()
      setIsProjectModalOpen(false)
    } catch (error) {
      console.error("Error creating project:", error)
    }
  }

  return (
    <>
      {contextHolder}
      <>
        {contextHolder}
        <MainLayout>
          <div className="dashboard-container">
            {isUserDataFetching ? (
              <Skeleton.Input active className="mb-3" />
            ) : (
              <Title level={2}>Welcome, {userData?.fullName}!</Title>
            )}
            <Title level={5} className="mb-6 text-gray-500">
              Here's an overview of your language resources
            </Title>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card className="dashboard-card" variant="borderless">
                  <Statistic
                    title="Total Projects"
                    value={12}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="dashboard-card" variant="borderless">
                  <Statistic
                    title="Languages"
                    value={24}
                    prefix={<TranslationOutlined />}
                    valueStyle={{ color: "#1677ff" }}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="dashboard-card">
                  <Statistic
                    title="Team Members"
                    value={8}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card className="dashboard-card" variant="borderless">
                  <Statistic
                    title="Completion Rate"
                    value={78}
                    suffix="%"
                    prefix={<BarChartOutlined />}
                    valueStyle={{ color: "#cf1322" }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-6">
              <Col xs={24} lg={16}>
                <Card
                  title="Recent Activity"
                  className="h-full"
                  variant="borderless"
                >
                  <p>No recent activity to display.</p>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card
                  title="Quick Actions"
                  className="h-full"
                  variant="borderless"
                >
                  <ul className="list-disc pl-5">
                    <li className="mb-2">
                      <Button type="default" onClick={showModal}>
                        Create new environment
                      </Button>
                    </li>
                    <li className="mb-2">
                      <Button type="default" onClick={showProjectModal}>
                        Create new project
                      </Button>
                    </li>
                  </ul>
                </Card>
              </Col>
            </Row>

            {/* Environment Tree Section */}
            <Row gutter={[16, 16]} className="mt-6">
              <Col xs={24}>
                <Card title="Environment Structure" variant="borderless">
                  {isFetching ? (
                    <Skeleton active />
                  ) : (
                    <Tree
                      showLine
                      switcherIcon={<DownOutlined />}
                      // defaultExpandedKeys={["0"]}
                      onSelect={(selectedKeys, info) => {
                        console.log("selected", selectedKeys, info)
                      }}
                      treeData={treeData}
                    />
                  )}
                </Card>
              </Col>
            </Row>
          </div>

          {/* Add Environment Modal */}
          <Modal
            title="Add New Environment"
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            okText="Create"
            cancelText="Cancel"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                name="name"
                label="Environment Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter environment name",
                  },
                ]}
              >
                <Input placeholder="Enter environment name" />
              </Form.Item>
            </Form>
          </Modal>

          {/* Add Project Modal */}
          <Modal
            title="Add New Project"
            open={isProjectModalOpen}
            onCancel={handleProjectCancel}
            onOk={() => projectForm.submit()}
            okText="Create"
            cancelText="Cancel"
          >
            <Form
              form={projectForm}
              layout="vertical"
              onFinish={handleProjectSubmit}
              autoComplete="off"
            >
              <Form.Item
                name="name"
                label="Project Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter project name",
                  },
                ]}
              >
                <Input placeholder="Enter project name" />
              </Form.Item>

              <Form.Item
                name="environmentId"
                label="Environment"
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
            </Form>
          </Modal>
        </MainLayout>
      </>
    </>
  )
}
