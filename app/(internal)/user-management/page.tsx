"use client"

import { useEffect, useState } from "react"
import {
  DeleteOutlined,
  EditOutlined,
  TeamOutlined,
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
import {
  useCreateCompanyUser,
  useDeleteCompanyUser,
  useGetCompanyUserList,
  useUpdateCompanyUser,
} from "@/app/hooks/useCompany"
import { useCreateGroup, useGetGroups } from "@/app/hooks/useGroups"
import { CompanyUser } from "@/app/services/companyService"

interface UserFormData {
  username: string
  email: string
  group: string
}

interface GroupFormData {
  name: string
}

const UserManagement = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)
  const [formGroup] = Form.useForm()

  const { data: users, isFetching: isUsersFetching } = useGetCompanyUserList()
  const { data: groups, isFetching: isGroupsFetching } = useGetGroups()

  const { createGroup, isPending: isCreateGroupPending } = useCreateGroup()
  const { data: companyUserList, isFetching: isCompanyUserListFetching } =
    useGetCompanyUserList()
  const { createCompanyUser, isPending: isCreateCompanyUserPending } =
    useCreateCompanyUser()
  const { deleteCompanyUser, isPending: isDeleteCompanyUserPending } =
    useDeleteCompanyUser()
  const { updateCompanyUser, isPending: isUpdateCompanyUserPending } =
    useUpdateCompanyUser()

  const columns = [
    {
      title: "Username",
      dataIndex: "fullName",
      key: "fullName",
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
      render: (_: any, record: CompanyUser) => record.userGroup.name,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: CompanyUser) => (
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

  const handleAddGroup = () => {
    formGroup.resetFields()
    setIsGroupModalOpen(true)
  }

  const handleEdit = (user: CompanyUser) => {
    setEditingUserId(user.id)
    form.setFieldsValue(user)
    setIsModalOpen(true)
  }

  const handleDelete = (userId: string) => {
    deleteCompanyUser({ id: userId })
    messageApi.success("User deleted successfully")
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      if (editingUserId) {
        await updateCompanyUser({
          id: editingUserId,
          ...values,
        })
        messageApi.success("User updated successfully")
      } else {
        await createCompanyUser(values)
        messageApi.success("User added successfully")
      }
      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      console.error("User creation error:", error)
      messageApi.error("User creation failed")
    }
  }

  const handleModalGroupOk = async () => {
    try {
      const values = await formGroup.validateFields()
      await createGroup(values)
      messageApi.success("Group created successfully")
      formGroup.resetFields()
      setIsGroupModalOpen(false)
    } catch (error) {
      console.error("Group creation error:", error)
      messageApi.error("Group creation failed")
    }
  }

  return (
    <MainLayout>
      {contextHolder}
      <div className="mb-4 flex gap-2">
        <Button
          color="primary"
          icon={<UserAddOutlined />}
          onClick={handleAdd}
          variant="outlined"
        >
          Add New User
        </Button>
        <Button
          color="primary"
          icon={<TeamOutlined />}
          onClick={handleAddGroup}
          variant="outlined"
        >
          Add New Group
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={isUsersFetching}
        pagination={false}
      />

      <Modal
        title={editingUserId ? "Edit User" : "Add New User"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please input full name!" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input password!" }]}
          >
            <Input placeholder="Enter password" />
          </Form.Item>
          <Form.Item
            name="groupId"
            label="Group"
            rules={[{ required: true, message: "Please select a group!" }]}
          >
            <Select
              loading={isGroupsFetching}
              placeholder="Select a group"
              allowClear
            >
              {groups?.map((group) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add New Group"
        open={isGroupModalOpen}
        onOk={handleModalGroupOk}
        onCancel={() => setIsGroupModalOpen(false)}
        confirmLoading={isCreateGroupPending}
      >
        <Form form={formGroup} layout="vertical">
          <Form.Item
            name="name"
            label="Group"
            rules={[{ required: true, message: "Please input group!" }]}
          >
            <Input placeholder="Enter group name" />
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  )
}

export default UserManagement
