"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons"
import { Button, Card, Result, Spin, Typography } from "antd"

import { apiClient } from "@/app/services/instance"

const { Title, Text } = Typography

export default function ActivateUserPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const userId = searchParams.get("userId")
  const token = searchParams.get("token")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!userId || !token) {
        setVerificationStatus({
          success: false,
          message: "Invalid verification link. Missing user ID or token.",
        })
        setLoading(false)
        return
      }

      try {
        const response = await apiClient.get("/Users/verify-email-register", {
          params: {
            userId,
            token,
          },
        })

        setVerificationStatus({
          success: true,
          message:
            (response.data as any)?.message || "Email verified successfully!",
        })
      } catch (error: any) {
        setVerificationStatus({
          success: false,
          message:
            error?.response?.data?.message ||
            error?.error?.detail ||
            "Failed to verify email. Please try again or contact support.",
        })
      } finally {
        setLoading(false)
      }
    }

    verifyEmail()
  }, [userId, token])

  const handleGoToLogin = () => {
    router.push("/auth/login")
  }

  const handleGoHome = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <div className="text-center py-8">
            <Spin
              size="large"
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
            <Title level={3} className="mt-4">
              Verifying your email...
            </Title>
            <Text type="secondary">
              Please wait while we verify your email address.
            </Text>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <Result
          icon={
            verificationStatus?.success ? (
              <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 72 }} />
            ) : (
              <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 72 }} />
            )
          }
          title={
            <Title level={2}>
              {verificationStatus?.success
                ? "Email Verified!"
                : "Verification Failed"}
            </Title>
          }
          subTitle={
            <Text type={verificationStatus?.success ? "secondary" : "danger"}>
              {verificationStatus?.message}
            </Text>
          }
          extra={[
            verificationStatus?.success ? (
              <Button
                type="primary"
                size="large"
                key="login"
                onClick={handleGoToLogin}
              >
                Go to Login
              </Button>
            ) : (
              <div key="actions" className="space-x-2">
                <Button size="large" onClick={handleGoHome}>
                  Go Home
                </Button>
                <Button type="primary" size="large" onClick={handleGoToLogin}>
                  Try Login
                </Button>
              </div>
            ),
          ]}
        />
      </Card>
    </div>
  )
}
