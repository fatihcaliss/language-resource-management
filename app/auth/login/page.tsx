"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Card, Checkbox, Form, Input, message, Typography } from "antd"

import { apiClient } from "@/app/services/instance"

import { login, setAuthToken } from "../../services/auth"

const { Title, Text } = Typography

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const onFinish = async (values: any) => {
    try {
      setLoading(true)
      const params = {
        email: values.email,
        password: values.password,
      }
      const { data } = (await apiClient.post("/auth/login", params)) as {
        data: { data: { token: string; message: string } }
      }
      console.log("data", data)
      localStorage.setItem("token", data.data.token)
      setAuthToken(data.data.token)
      if (data.data.token) {
        // messageApi.success(data.message)
        router.push("/dashboard")
      } else {
        // messageApi.error(data.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {contextHolder}
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <div className="mb-6 text-center">
            <Title level={2}>Language Resource Management</Title>
            <Text type="secondary">Sign in to your account</Text>
          </div>

          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex items-center justify-between">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Link
                  href="/auth/forgot-password"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
              >
                Sign In
              </Button>
            </Form.Item>

            <div className="text-center">
              <Text type="secondary">
                Don't have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Sign up now
                </Link>
              </Text>
            </div>
          </Form>
        </Card>
      </div>
    </>
  )
}
