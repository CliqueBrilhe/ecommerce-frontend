import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const GoToPedidosCliente = ()=>{
    navigate("/consult_cpf");
  }
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Left side - Menu trigger for mobile */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          
          {/* Logo - hidden on mobile when sidebar is open */}
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Menu className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-primary">Click&Brilhe</h1>
              <p className="text-xs text-muted-foreground">Produtos de beleza</p>
            </div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="pl-10 bg-background border-border focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
        <div className="flex items-center">
          <Button
              size="sm"
              className="rounded"
              onClick={() => GoToPedidosCliente()}>
            <p>Meus pedidos</p>
          </Button>
        </div>
        {/* Right side - Cart */}
        <div className="flex items-center">
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}