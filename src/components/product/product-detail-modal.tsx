import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Minus, Plus, Heart, Share } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";

interface ProductDetailModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
      id: product.id,
      nome: product.nome,
      preco: (product.preco-((product.promocao/100)*product.preco)),
      imagens: product.imagens[0],
      quantidadeMaxima: product.quantidadeEstoque,
    });
    }
    onOpenChange(false);
  };

  const incrementQuantity = () => {
    if (quantity < product.quantidadeEstoque) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.nome}</DialogTitle>
          <DialogDescription>Detalhes do produto</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.imagens[0]}
                alt={product.nome}
                className="w-full rounded-lg object-cover aspect-square"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.promocao > 0 && (
                  <Badge variant="destructive" className="text-sm font-bold">
                    -{product.promocao}%
                  </Badge>
                )}
                {product.quantidadeEstoque == 0 && (
                  <Badge variant="secondary" className="text-sm">
                    Produto em Destaque
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {product.nome}
              </h1>
              
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(product.preco - ((product.promocao/100)*product.preco))}
                </span>
                {product.preco && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(product.preco)}
                  </span>
                )}
              </div>
              
              {product.promocao > 0 && (
                <p className="text-sm text-success font-medium">
                  Você economiza {formatCurrency(((product.promocao/100)*product.preco))}
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Disponibilidade:</span>
                <span className={`text-sm font-medium ${
                  product.quantidadeEstoque > 0 ? "text-success" : "text-destructive"
                }`}>
                  {product.quantidadeEstoque > 0 ? `${product.quantidadeEstoque} unidades` : "Fora de estoque"}
                </span>
              </div>
              
              {product.quantidadeEstoque > 0 && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      product.quantidadeEstoque > 20 ? "bg-success" : 
                      product.quantidadeEstoque > 5 ? "bg-warning" : "bg-destructive"
                    }`}
                    style={{ width: `${Math.min((product.quantidadeEstoque / 50) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            {product.quantidadeEstoque > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantidade:</span>
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.quantidadeEstoque}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-button"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                  
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="outline" size="icon">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="border-t border-border pt-4 space-y-2">
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Código do Produto:</span>
                <span>#{product.id}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}