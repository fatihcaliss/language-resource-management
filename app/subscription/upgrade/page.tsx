"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button, Card, Col, Form, Input, message, Row, Typography } from "antd"

// no backend call required for card storage per latest requirement

const { Title, Text } = Typography

interface CardPayload {
  locale: string
  conversationId: string
  email: string
  externalId: string
  card: {
    cardAlias: string
    cardNumber: string
    expireYear: string
    expireMonth: string
    cardHolderName: string
  }
}

export default function UpgradeSubscriptionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = useMemo(() => searchParams.get("planId"), [searchParams])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form] = Form.useForm<CardPayload>()

  const initialValues: CardPayload = {
    locale: "tr",
    conversationId: "123456",
    email: "example@example.com",
    externalId: "ext-7890",
    card: {
      cardAlias: "My Visa",
      cardNumber: "5526080000000006",
      expireYear: "2028",
      expireMonth: "12",
      cardHolderName: "Emirhan Kalem",
    },
  }

  const onSubmit = async (values: CardPayload) => {
    if (!planId) {
      message.error("Plan ID not found.")
      return
    }

    setIsSubmitting(true)
    try {
      const iyziRes = await fetch("/api/iyzico/cardstorage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const result = await iyziRes.json()

      const statusValue = (result?.Status || result?.status || "").toString()
      if (!iyziRes.ok || statusValue.toLowerCase() !== "success") {
        throw new Error(result?.errorMessage || "Card saving failed")
      }

      const cardUserKey =
        result.cardUserKey || result.CardUserKey || result?.data?.cardUserKey
      const cardToken =
        result.cardToken || result.CardToken || result?.data?.cardToken

      if (!cardUserKey || !cardToken) {
        throw new Error("Card details missing (cardUserKey/cardToken)")
      }

      // Send to payment API
      const forwardRes = await fetch(
        "http://localhost:19050/api/Payments/card-storage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardUserKey, cardToken }),
        }
      )
      if (!forwardRes.ok) {
        const forwardErr = await forwardRes.json().catch(() => ({}))
        throw new Error(
          forwardErr?.message ||
            "Failed to forward card info to payment service"
        )
      }

      message.success("Card saved and forwarded to payment service.")
      router.push("/app")
    } catch (err: any) {
      message.error(err?.message || "An error occurred during the process")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <Row justify="center" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={2} style={{ color: "#fff", textAlign: "center" }}>
              Upgrade Subscription
            </Title>
            <Text style={{ color: "rgba(255,255,255,.85)" }}>
              Plan: {planId || "-"}
            </Text>
          </Col>
        </Row>

        <Card style={{ borderRadius: 12 }}>
          <Form<CardPayload>
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={onSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={["locale"]}
                  label="Locale"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={["conversationId"]}
                  label="Conversation ID"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={["email"]}
                  label="Email"
                  rules={[{ required: true }]}
                >
                  <Input type="email" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={["externalId"]}
                  label="External ID"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Title level={4}>Card Information</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={["card", "cardAlias"]}
                  label="Card Alias"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={["card", "cardHolderName"]}
                  label="Card Holder"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={["card", "cardNumber"]}
                  label="Card Number"
                  rules={[{ required: true }]}
                >
                  <Input maxLength={19} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name={["card", "expireMonth"]}
                  label="Month"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="MM" maxLength={2} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name={["card", "expireYear"]}
                  label="Year"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="YYYY" maxLength={4} />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="end">
              <Col>
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  Save Card and Continue
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  )
}
