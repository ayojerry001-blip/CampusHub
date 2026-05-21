import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/toaster" // Added import

export const metadata: Metadata = {
  title: "Campus Event Management System",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster /> {/* Added Toaster component */}
      </body>
    </html>
  )
}
