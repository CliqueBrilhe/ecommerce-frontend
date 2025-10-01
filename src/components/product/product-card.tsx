import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { ProductDetailModal } from "./product-detail-modal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [showDetails, setShowDetails] = useState(false);

  const discount = product.preco
    ? Math.round(product.preco-((product.promocao/100)*product.preco))
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      nome: product.nome,
      preco: (product.preco-((product.promocao/100)*product.preco)),
      imagens: product.imagens,
      quantidadeMaxima: product.quantidadeEstoque,
    });
  };

  return (
    <>
      <Card 
        className="group cursor-pointer transition-all duration-300 hover:shadow-card hover:scale-[1.02] bg-card border-border"
        onClick={() => setShowDetails(true)}
      >
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={`https://ecommercebackend-production-d712.up.railway.app/imagens/${product.imagens[0]}`}
              alt={product.nome}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.promocao > 0 && (
                <Badge variant="destructive" className="text-xs font-bold">
                  -{product.promocao}%
                </Badge>
              )}
              {product.quantidadeEstoque==0 && (
                <Badge variant="secondary" className="text-xs">
                  Esgotado
                </Badge>
              )}
            </div>

            {/* Favorite button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {product.nome}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {product.descricao}
              </p>
            </div>


            {/* promocao */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(product.preco-((product.promocao/100)*product.preco))}
                </span>
                {product.preco && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(product.preco)}
                  </span>
                )}
              </div>
              
              {/* Stock */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {product.quantidadeEstoque > 0 ? `${product.quantidadeEstoque} em estoque` : "Fora de estoque"}
                </span>
                <div className={`h-2 w-16 bg-muted rounded-full overflow-hidden`}>
                  <div
                    className={`h-full transition-all duration-500 ${
                      product.quantidadeEstoque > 20 ? "bg-success" : 
                      product.quantidadeEstoque > 5 ? "bg-warning" : "bg-destructive"
                    }`}
                    style={{ width: `${Math.min((product.quantidadeEstoque / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-button"
            onClick={handleAddToCart}
            disabled={product.quantidadeEstoque === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.quantidadeEstoque === 0 ? "Fora de Estoque" : "Adicionar ao Carrinho"}
          </Button>
        </CardFooter>
      </Card>

      <ProductDetailModal
        product={product}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
}