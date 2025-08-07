"use client"

import {
  ArrowRightOutlined,
  CheckOutlined,
  CrownOutlined,
} from "@ant-design/icons"
import { useQuery } from "@tanstack/react-query"
import { Button, Card, Col, Divider, Row, Space, Spin, Typography } from "antd"

import { apiClient } from "@/app/services/instance"

const { Title, Text, Paragraph } = Typography

interface SubscriptionPlan {
  subscriptionTypeId: number
  subscriptionType: string
  maxApplications: number
  maxResources: number
  maxEnvironments: number
  maxLanguages: number
  maxRequestsPerDay: number
  monthlyPrice: number
}

export default function SubscriptionPage() {
  const {
    data: subscriptionListData,
    isFetching: isSubscriptionListDataFetching,
  } = useQuery({
    queryKey: ["subscriptionData"],
    queryFn: () => apiClient.get("http://localhost:16000/api/Subscriptions"),
    select: (data: any) => data.data.data as SubscriptionPlan[],
  })

  const handleUpgrade = (subscriptionTypeId?: number) => {
    // TODO: Implement subscription upgrade logic
    // This could redirect to a payment provider, open a modal, etc.
    console.log("Upgrade subscription clicked", { subscriptionTypeId })
  }

  const handleContactSales = () => {
    // TODO: Implement contact sales logic
    console.log("Contact sales clicked")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Row justify="center" style={{ marginBottom: "40px" }}>
          <Col>
            <Title
              level={1}
              style={{
                color: "white",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              <CrownOutlined style={{ marginRight: "12px" }} />
              Subscription Required
            </Title>
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "18px",
                display: "block",
                textAlign: "center",
              }}
            >
              Unlock the full potential of our language resource management
              platform
            </Text>
          </Col>
        </Row>

        <Card
          style={{
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Title
            level={2}
            style={{
              textAlign: "center",
              color: "#1890ff",
              marginBottom: "24px",
            }}
          >
            Choose Your Plan
          </Title>

          {isSubscriptionListDataFetching ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
                minHeight: "463px",
              }}
            >
              <Spin size="default" />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {subscriptionListData?.map((plan: SubscriptionPlan) => (
                <Col xs={24} md={8} key={plan.subscriptionTypeId}>
                  <Card
                    style={{
                      height: "100%",
                      border:
                        plan.subscriptionType === "Normal"
                          ? "2px solid #1890ff"
                          : "1px solid #d9d9d9",
                      borderRadius: "8px",
                      position: "relative",
                    }}
                    styles={{
                      body: {
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      },
                    }}
                  >
                    {plan.subscriptionType === "Normal" && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "#1890ff",
                          color: "white",
                          padding: "4px 16px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        POPULAR
                      </div>
                    )}

                    <Title
                      level={3}
                      style={{
                        color:
                          plan.subscriptionType === "Normal"
                            ? "#1890ff"
                            : "#666",
                        textAlign: "center",
                        marginTop:
                          plan.subscriptionType === "Normal" ? "16px" : "0",
                      }}
                    >
                      {plan.subscriptionType}
                    </Title>

                    <Title
                      level={1}
                      style={{ textAlign: "center", margin: "16px 0" }}
                    >
                      ${plan.monthlyPrice}
                      <Text type="secondary" style={{ fontSize: "16px" }}>
                        /month
                      </Text>
                    </Title>

                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Text>
                        <CheckOutlined
                          style={{ color: "#52c41a", marginRight: "8px" }}
                        />
                        {plan.maxApplications} Applications
                      </Text>
                      <Text>
                        <CheckOutlined
                          style={{ color: "#52c41a", marginRight: "8px" }}
                        />
                        {plan.maxResources.toLocaleString()} Resources
                      </Text>
                      <Text>
                        <CheckOutlined
                          style={{ color: "#52c41a", marginRight: "8px" }}
                        />
                        {plan.maxEnvironments} Environments
                      </Text>
                      <Text>
                        <CheckOutlined
                          style={{ color: "#52c41a", marginRight: "8px" }}
                        />
                        {plan.maxLanguages} Languages
                      </Text>
                      <Text>
                        <CheckOutlined
                          style={{ color: "#52c41a", marginRight: "8px" }}
                        />
                        {plan.maxRequestsPerDay.toLocaleString()} Requests/Day
                      </Text>
                      {plan.subscriptionType === "Enterprise" && (
                        <>
                          <Text>
                            <CheckOutlined
                              style={{ color: "#52c41a", marginRight: "8px" }}
                            />
                            Custom Integrations
                          </Text>
                          <Text>
                            <CheckOutlined
                              style={{ color: "#52c41a", marginRight: "8px" }}
                            />
                            Dedicated Support
                          </Text>
                          {/* <Text>
                            <CheckOutlined
                              style={{ color: "#52c41a", marginRight: "8px" }}
                            />
                            SLA Guarantee
                          </Text> */}
                        </>
                      )}
                    </Space>
                    <div className="mt-auto">
                      <Divider />

                      <Button
                        type={
                          plan.subscriptionType === "Normal"
                            ? "primary"
                            : "default"
                        }
                        size="large"
                        block
                        icon={
                          plan.subscriptionType !== "Enterprise" ? (
                            <ArrowRightOutlined />
                          ) : undefined
                        }
                        onClick={() =>
                          plan.subscriptionType === "Enterprise"
                            ? handleContactSales()
                            : handleUpgrade(plan.subscriptionTypeId)
                        }
                      >
                        {plan.subscriptionType === "Enterprise"
                          ? "Contact Sales"
                          : "Upgrade Now"}
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Paragraph type="secondary" className="!mb-0">
              Need help choosing? Contact our sales team for a personalized
              recommendation.
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  )
}
