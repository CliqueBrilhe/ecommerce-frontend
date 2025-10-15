import { useState, useMemo } from "react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { products, categories, Product } from "@/lib/products";
import { Grid, List, SlidersHorizontal } from "lucide-react";
import { HeroBanner } from "@/components/layout/hero-banner";

interface ProductCatalogProps {
  selectedCategory?: string;
  searchQuery?: string;
}

export function ProductCatalog({
  selectedCategory = "all",
  searchQuery = "",
}: ProductCatalogProps) {
  const [sortBy, setSortBy] = useState("nome");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      if (selectedCategory === "Oferta") {
        filtered = filtered.filter((p) => p.promocao > 0);
      } else {
        const categoryId = Number(selectedCategory);
        filtered = filtered.filter((p) => p.categoria === categoryId);
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.descricao.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "nome":
        default:
          return a.nome.localeCompare(b.nome);
      }
    });

    return sorted;
  }, [selectedCategory, searchQuery, sortBy]);

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Hero Banner - only show on home page */}
      {selectedCategory === "all" && !searchQuery && <HeroBanner />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {currentCategory?.name || "Todos os Produtos"}
          </h1>
          <p className="text-muted-foreground">
            {filteredAndSortedProducts.length} produto(s) encontrado(s)
            {searchQuery && ` para "${searchQuery}"`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nome">Nome (A-Z)</SelectItem>
              <SelectItem value="price-low">Menor Preço</SelectItem>
              <SelectItem value="price-high">Maior Preço</SelectItem>
              <SelectItem value="rating">Mais Avaliados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters/Tags */}
      {searchQuery && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          <Badge variant="secondary" className="gap-1">
            Busca: "{searchQuery}"
          </Badge>
        </div>
      )}

      {/* Featured Products Banner */}
      {selectedCategory === "all" && !searchQuery && (
        <div className="bg-gradient-accent rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-accent-foreground mb-2">
            Produtos em Destaque
          </h2>
          <p className="text-accent-foreground/80">
            Confira nossa seleção especial com os melhores preços
          </p>
        </div>
      )}

      {/* Products Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            Tente ajustar seus filtros ou termo de busca
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Limpar Filtros
          </Button>
        </div>
      )}
    </div>
  );
}
