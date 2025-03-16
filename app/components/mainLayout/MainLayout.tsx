"use client"

import { useState } from "react"
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons"
import { Breadcrumb, Button, Dropdown, Layout, Menu, theme } from "antd"

import { logout } from "../../services/auth"

import "./MainLayout.css"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const { Header, Sider, Content } = Layout

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const handleLogout = () => {
    logout()
  }

  const generateBreadcrumbItems = () => {
    // Remove leading slash and split by '/'
    const pathSegments = pathname.split("/").filter((segment) => segment)

    // Always include Home as the first item
    const items = [{ title: <Link href="/dashboard">Home</Link> }]

    // Build up the breadcrumb items based on path segments
    let currentPath = ""
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`
      // Convert segment to title case (capitalize first letter of each word)
      const title = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      items.push({ title: <Link href={currentPath}>{title}</Link> })
    })

    // Make the last item not clickable (current page)
    if (items.length > 1) {
      items[items.length - 1] = {
        ...items[items.length - 1],
        title: <span>{items[items.length - 1].title}</span>,
      }
    }

    return items
  }

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
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
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
          defaultSelectedKeys={[pathname]}
          items={[
            {
              key: "/dashboard",
              icon: <UserOutlined />,
              label: "Dashboard",
              onClick: () => router.push("/dashboard"),
            },
            {
              key: "/projects",
              icon: <VideoCameraOutlined />,
              label: "Projects",
              onClick: () => router.push("/projects"),
            },
            {
              key: "/resources-management",
              icon: <UploadOutlined />,
              label: "Resources",
              onClick: () => router.push("/resources-management"),
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
              {/* <Breadcrumb items={[{ title: "Home" }, { title: "Dashboard" }]} /> */}
              <Breadcrumb items={generateBreadcrumbItems()} />
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
