import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to login page
  redirect("/auth/login")

  // This part won't be executed due to the redirect
  return null
}
