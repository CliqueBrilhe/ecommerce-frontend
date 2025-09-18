import { useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/layout/header";
import { ProductCatalog } from "@/pages/product-catalog";

const Index = () => {
  const { category } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col">
          <Header onSearch={setSearchQuery} />
          
          <div className="flex-1 p-6">
            <ProductCatalog 
              selectedCategory={category || "all"} 
              searchQuery={searchQuery}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
