"use client"

import { useState } from "react"
import {
  BarChartOutlined,
  DownOutlined,
  FileTextOutlined,
  TeamOutlined,
  TranslationOutlined,
} from "@ant-design/icons"
import { useQuery } from "@tanstack/react-query"
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

import MainLayout from "@/app/components/mainLayout/MainLayout"
import { useCreateApplication } from "@/app/hooks/useApplication"
import {
  useCreateEnvironment,
  useGetEnvironments,
} from "@/app/hooks/useEnvironment"
import { apiClient } from "@/app/services/instance"
import { transformEnvironmentData } from "@/app/utils/transformEnvironmentTreeSelect"

const { Title } = Typography

export default function DashboardPage() {
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

  const { data: environmentList, isSuccess, isFetching } = useGetEnvironments()

  const {
    createEnvironment,
    isPending: isCreatingEnvironment,
    isSuccess: isEnvironmentCreated,
  } = useCreateEnvironment()

  const {
    createApplication,
    isPending: isCreatingApplication,
    isSuccess: isApplicationCreated,
  } = useCreateApplication()

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
      await createEnvironment(values)
      isEnvironmentCreated &&
        messageApi.success("Environment created successfully!")
      form.resetFields()
      setIsModalOpen(false)
    } catch (error: any) {
      console.error("Error creating environment:", error)
      messageApi.error(error?.error?.detail || error?.title)
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
      await createApplication(values)
      isApplicationCreated &&
        messageApi.success("Application created successfully!")
      projectForm.resetFields()
      setIsProjectModalOpen(false)
    } catch (error: any) {
      console.error("Error creating project:", error)
      messageApi.error(error?.error?.detail || error?.title)
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
            confirmLoading={isCreatingEnvironment}
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
            confirmLoading={isCreatingApplication}
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
