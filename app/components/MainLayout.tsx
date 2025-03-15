"use client"

import { useState } from "react"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons"
import { Breadcrumb, Button, Dropdown, Layout, Menu, theme } from "antd"

import "./MainLayout.css"

const { Header, Sider, Content } = Layout

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const userMenuItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
    },
    {
      key: "logout",
      label: "Logout",
      danger: true,
    },
  ]

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">
          {!collapsed ? "LangResource" : "LRM"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "nav 1",
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "nav 2",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "nav 3",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {" "}
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              <Breadcrumb
                items={[{ title: "Home" }, { title: "List" }, { title: "App" }]}
              />
            </div>

            <div style={{ marginRight: "24px" }}>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button
                  type="text"
                  icon={<UserOutlined />}
                  style={{ fontSize: "18px" }}
                />
              </Dropdown>
            </div>
          </div>
        </Header>
        <div
          style={{ padding: "8px 24px", background: colorBgContainer }}
        ></div>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
