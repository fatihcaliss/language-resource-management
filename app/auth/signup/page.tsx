"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons"
import { useMutation } from "@tanstack/react-query"
import { Button, Card, Checkbox, Form, Input, message, Typography } from "antd"

import { apiClient } from "../../services/instance"

const { Title, Text } = Typography

export default function SignupPage() {
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  const signupMutation = useMutation({
    mutationFn: async (params: {
      email: string
      password: string
      fullname: string
    }) => {
      const { data } = await apiClient.post("/auth/register", params)
      return data
    },
    onSuccess: (data) => {
      router.push("/auth/login")
    },
    onError: (error: any) => {
      messageApi.error(error?.error?.detail)
    },
  })

  const onFinish = async (values: any) => {
    try {
      const params = {
        email: values.email,
        password: values.password,
        fullname: values.username,
      }
      await signupMutation.mutateAsync(params)
    } catch (error) {
      console.error("Signup failed:", error)
    }
  }

  return (
    <>
      {contextHolder}
      <div className="flex min-h-screen items-center justify-center  p-4">
        <Card className="w-full max-w-md shadow-lg">
          <div className="mb-6 text-center">
            <Title level={2}>Resource Management System</Title>
            <Text type="secondary">Create a new account</Text>
          </div>

          <Form
            name="signup_form"
            initialValues={{ agreement: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
                { min: 3, message: "Username must be at least 3 characters" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    )
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm Password"
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("You must accept the terms and conditions")
                        ),
                },
              ]}
            >
              <Checkbox>
                I agree to the <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={signupMutation.isPending}
              >
                Sign Up
              </Button>
            </Form.Item>

            <div className="text-center">
              <Text type="secondary">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Sign in
                </Link>
              </Text>
            </div>
          </Form>
        </Card>
      </div>
    </>
  )
}
