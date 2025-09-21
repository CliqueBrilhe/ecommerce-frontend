import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Droplets,
  Sparkles,
  Brush,
  Trash2,
  Home,
  Star,
  Package,
} from "lucide-react";

const categories = [
  { title: "Todos os Produtos", url: "/", icon: Package },
  { title: "Ofertas", url: "/categoria/ofertas", icon: Star },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-card border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-lg text-primary">Click&Brilhe</h2>
                <p className="text-xs text-muted-foreground">Produtos de beleza</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-0">
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {!collapsed && "Categorias"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {categories.map((category) => (
                <SidebarMenuItem key={category.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink
                      to={category.url}
                      end
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${getNavCls({ isActive })}`
                      }
                    >
                      <category.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="text-sm font-medium">{category.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}