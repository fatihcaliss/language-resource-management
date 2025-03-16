export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout bg-gradient-to-b from-[#1677ff] to-[#99c3ff]">
      {children}
    </div>
  )
}
