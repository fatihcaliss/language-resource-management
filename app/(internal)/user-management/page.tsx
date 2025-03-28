"use client"

import { useEffect, useState } from "react"
import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
} from "@ant-design/icons"
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd"

import MainLayout from "@/app/components/mainLayout/MainLayout"

interface User {
  id: string
  username: string
  email: string
  group: string
}

interface UserFormData {
  username: string
  email: string
  group: string
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [editingUserId, setEditingUserId] = useState<string | null>(null)

  // Mock groups - replace with actual groups from your backend
  const groups = ["Admin", "User", "Manager", "Guest"]

  // Mock initial data - replace with actual API call
  useEffect(() => {
    setUsers([
      {
        id: "1",
        username: "john_doe",
        email: "john@example.com",
        group: "Admin",
      },
      {
        id: "2",
        username: "jane_doe",
        email: "jane@example.com",
        group: "User",
      },
    ])
  }, [])

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingUserId(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUserId(user.id)
    form.setFieldsValue(user)
    setIsModalOpen(true)
  }

  const handleDelete = (userId: string) => {
    // Replace with actual API call
    setUsers(users.filter((user) => user.id !== userId))
    message.success("User deleted successfully")
  }

  const handleModalOk = () => {
    form.validateFields().then((values: UserFormData) => {
      if (editingUserId) {
        // Update existing user
        setUsers(
          users.map((user) =>
            user.id === editingUserId ? { ...user, ...values } : user
          )
        )
        message.success("User updated successfully")
      } else {
        // Add new user
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          ...values,
        }
        setUsers([...users, newUser])
        message.success("User added successfully")
      }
      setIsModalOpen(false)
      form.resetFields()
    })
  }

  return (
    <MainLayout>
      <div className="mb-4">
        <Button type="primary" icon={<UserAddOutlined />} onClick={handleAdd}>
          Add New User
        </Button>
      </div>

      <Table columns={columns} dataSource={users} rowKey="id" />

      <Modal
        title={editingUserId ? "Edit User" : "Add New User"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="group"
            label="Group"
            rules={[{ required: true, message: "Please select a group!" }]}
          >
            <Select>
              {groups.map((group) => (
                <Select.Option key={group} value={group}>
                  {group}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  )
}

export default UserManagement
