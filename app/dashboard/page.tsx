"use client"

import { useEffect, useState } from "react"
import {
  BarChartOutlined,
  FileTextOutlined,
  TeamOutlined,
  TranslationOutlined,
} from "@ant-design/icons"
import { Card, Col, Row, Statistic, Typography } from "antd"

import MainLayout from "../components/mainLayout/MainLayout"

const { Title } = Typography

export default function DashboardPage() {
  const [username, setUsername] = useState("Admin")

  // In a real application, you would fetch user data from an API
  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      setUsername("Admin User")
    }, 1000)
  }, [])

  return (
    <MainLayout>
      <div className="dashboard-container">
        <Title level={2}>Welcome, {username}!</Title>
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
            <Card title="Quick Actions" className="h-full" variant="borderless">
              <ul className="list-disc pl-5">
                <li className="mb-2">Create new project</li>
                <li className="mb-2">Add team member</li>
                <li className="mb-2">Import language resources</li>
                <li className="mb-2">Generate reports</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 0 8px;
        }
        .dashboard-card {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
        }
        .dashboard-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </MainLayout>
  )
}
