import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ConfigProvider, theme } from "antd"

import "./globals.css"

import { AntdRegistry } from "@ant-design/nextjs-registry"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Language Resource Management",
  description: "Language Resource Management",
}

const customTheme = {
  token: {
    colorPrimary: "#1677ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorInfo: "#1677ff",
    borderRadius: 6,
    wireframe: false,
  },
  algorithm: theme.defaultAlgorithm,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <ConfigProvider theme={customTheme} wave={{ disabled: true }}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
