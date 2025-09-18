import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/AdminSidebar"
import { Outlet } from "react-router-dom"
import { User, Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export default function AdminLayout() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso!');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 md:h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="h-full px-3 md:px-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="flex-shrink-0" />
                <div className="hidden sm:block min-w-0">
                  <h2 className="font-semibold text-foreground truncate">Painel Administrativo</h2>
                  <p className="text-sm text-muted-foreground">CleanShop</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                
                
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Admin</span>
                  </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-shrink-0"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}