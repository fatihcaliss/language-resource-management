import { Button } from "antd"

import MainLayout from "./components/MainLayout"

export default function Home() {
  return (
    <MainLayout>
      <div className="flex min-h-full flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">
          Welcome to Language Resource Management
        </h1>
        <Button type="primary">Get Started</Button>
      </div>
    </MainLayout>
  )
}
