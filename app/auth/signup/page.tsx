"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  LockOutlined,
  MailOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { useMutation } from "@tanstack/react-query"
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  message,
  Modal,
  Typography,
} from "antd"

import { apiClient } from "../../services/instance"

const { Title, Text, Paragraph } = Typography

export default function SignupPage() {
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)

  const signupMutation = useMutation({
    mutationFn: async (params: {
      email: string
      password: string
      name: string
      surname: string
    }) => {
      const { data } = await apiClient.post("/Users/register", params)
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
        name: values.name,
        surname: values.surname,
      }
      await signupMutation.mutateAsync(params)
    } catch (error) {
      console.error("Signup failed:", error)
    }
  }

  const showTermsModal = () => {
    setTermsModalOpen(true)
  }

  const showPrivacyModal = () => {
    setPrivacyModalOpen(true)
  }

  const handleModalClose = () => {
    setTermsModalOpen(false)
    setPrivacyModalOpen(false)
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
              name="name"
              rules={[
                { required: true, message: "Please input your name!" },
                { min: 3, message: "Name must be at least 3 characters" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Name"
              />
            </Form.Item>

            <Form.Item
              name="surname"
              rules={[
                { required: true, message: "Please input your surname!" },
                { min: 3, message: "Surname must be at least 3 characters" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Surname"
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
                I agree to the <a onClick={showTermsModal}>Terms of Service</a>{" "}
                and <a onClick={showPrivacyModal}>Privacy Policy</a>
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

      {/* Terms of Service Modal */}
      <Modal
        title="Terms of Service"
        open={termsModalOpen}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        width={700}
        footer={[
          <Button key="close" type="primary" onClick={handleModalClose}>
            I Understand
          </Button>,
        ]}
      >
        <div style={{ maxHeight: "60vh", overflow: "auto", padding: "0 16px" }}>
          <Title level={4}>Resource Management System Terms of Service</Title>
          <Paragraph>Last Updated: {new Date().toLocaleDateString()}</Paragraph>

          <Title level={5}>1. Acceptance of Terms</Title>
          <Paragraph>
            By accessing or using the Resource Management System, you agree to
            be bound by these Terms of Service. If you do not agree to these
            terms, please do not use the service.
          </Paragraph>

          <Title level={5}>2. Description of Service</Title>
          <Paragraph>
            The Resource Management System provides tools for managing language
            learning resources, tracking progress, and collaborating with other
            users. We reserve the right to modify, suspend, or discontinue any
            aspect of the service at any time.
          </Paragraph>

          <Title level={5}>3. User Accounts</Title>
          <Paragraph>
            To use certain features of the service, you must create an account.
            You are responsible for maintaining the confidentiality of your
            account information and for all activities that occur under your
            account.
          </Paragraph>

          <Title level={5}>4. User Content</Title>
          <Paragraph>
            You retain ownership of any content you submit to the service. By
            submitting content, you grant us a worldwide, non-exclusive,
            royalty-free license to use, reproduce, modify, adapt, publish, and
            display such content.
          </Paragraph>

          <Title level={5}>5. Prohibited Activities</Title>
          <Paragraph>
            You agree not to:
            <ul>
              <li>Use the service for any illegal purpose</li>
              <li>Interfere with the operation of the service</li>
              <li>Access data not intended for you</li>
              <li>
                Attempt to probe, scan, or test the vulnerability of the system
              </li>
              <li>Impersonate any person or entity</li>
            </ul>
          </Paragraph>

          <Title level={5}>6. Termination</Title>
          <Paragraph>
            We reserve the right to terminate or suspend your account at our
            sole discretion, without notice, for conduct that we believe
            violates these Terms of Service or is harmful to other users, us, or
            third parties.
          </Paragraph>

          <Title level={5}>7. Disclaimer of Warranties</Title>
          <Paragraph>
            The service is provided "as is" without warranties of any kind,
            either express or implied. We do not warrant that the service will
            be uninterrupted or error-free.
          </Paragraph>

          <Title level={5}>8. Limitation of Liability</Title>
          <Paragraph>
            In no event shall we be liable for any indirect, incidental,
            special, consequential, or punitive damages resulting from your use
            of or inability to use the service.
          </Paragraph>

          <Title level={5}>9. Changes to Terms</Title>
          <Paragraph>
            We may revise these Terms of Service at any time without notice. By
            continuing to use the service after such revisions, you agree to be
            bound by the revised terms.
          </Paragraph>

          <Title level={5}>10. Contact Information</Title>
          <Paragraph>
            If you have any questions about these Terms of Service, please
            contact us at support@resourcemanagement.example.com.
          </Paragraph>
        </div>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        title="Privacy Policy"
        open={privacyModalOpen}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        width={700}
        footer={[
          <Button key="close" type="primary" onClick={handleModalClose}>
            I Understand
          </Button>,
        ]}
      >
        <div style={{ maxHeight: "60vh", overflow: "auto", padding: "0 16px" }}>
          <Title level={4}>Resource Management System Privacy Policy</Title>
          <Paragraph>Last Updated: {new Date().toLocaleDateString()}</Paragraph>

          <Title level={5}>1. Information We Collect</Title>
          <Paragraph>
            We collect information you provide directly to us, including your
            name, email address, and any other information you choose to
            provide. We also automatically collect certain information about
            your device and how you interact with our service.
          </Paragraph>

          <Title level={5}>2. How We Use Your Information</Title>
          <Paragraph>
            We use the information we collect to:
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>
                Send you technical notices, updates, security alerts, and
                support messages
              </li>
              <li>
                Respond to your comments, questions, and customer service
                requests
              </li>
              <li>Develop new products and services</li>
              <li>
                Monitor and analyze trends, usage, and activities in connection
                with our service
              </li>
            </ul>
          </Paragraph>

          <Title level={5}>3. Sharing of Information</Title>
          <Paragraph>
            We may share your information with:
            <ul>
              <li>
                Vendors, consultants, and other service providers who need
                access to such information to carry out work on our behalf
              </li>
              <li>
                In response to a request for information if we believe
                disclosure is in accordance with, or required by, any applicable
                law or legal process
              </li>
              <li>
                If we believe your actions are inconsistent with our user
                agreements or policies, or to protect the rights, property, and
                safety of us or others
              </li>
              <li>
                In connection with, or during negotiations of, any merger, sale
                of company assets, financing, or acquisition of all or a portion
                of our business by another company
              </li>
              <li>With your consent or at your direction</li>
            </ul>
          </Paragraph>

          <Title level={5}>4. Data Security</Title>
          <Paragraph>
            We take reasonable measures to help protect information about you
            from loss, theft, misuse, unauthorized access, disclosure,
            alteration, and destruction.
          </Paragraph>

          <Title level={5}>5. Your Rights</Title>
          <Paragraph>
            You may access, correct, or delete your personal information by
            contacting us. You may also opt out of receiving promotional emails
            from us by following the instructions in those emails.
          </Paragraph>

          <Title level={5}>6. Cookies</Title>
          <Paragraph>
            We use cookies and similar technologies to collect information about
            your browsing activities and to recognize you across different
            devices.
          </Paragraph>

          <Title level={5}>7. Children's Privacy</Title>
          <Paragraph>
            Our service is not directed to children under 13, and we do not
            knowingly collect personal information from children under 13.
          </Paragraph>

          <Title level={5}>8. Changes to This Privacy Policy</Title>
          <Paragraph>
            We may change this privacy policy from time to time. If we make
            changes, we will notify you by revising the date at the top of the
            policy and, in some cases, we may provide you with additional
            notice.
          </Paragraph>

          <Title level={5}>9. Contact Us</Title>
          <Paragraph>
            If you have any questions about this privacy policy, please contact
            us at privacy@resourcemanagement.example.com.
          </Paragraph>
        </div>
      </Modal>
    </>
  )
}
