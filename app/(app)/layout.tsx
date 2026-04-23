import { MenuDrawer } from "@/components/ui/menu-drawer"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative max-w-[440px] mx-auto min-h-screen bg-bg">
      {children}
      <MenuDrawer />
    </div>
  )
}
