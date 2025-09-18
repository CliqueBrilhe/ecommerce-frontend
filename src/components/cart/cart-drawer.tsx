import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export function CartDrawer() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative hover:bg-primary/10 hover:border-primary transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          {totalItems > 0 && (
            <Badge 
              variant="default" 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-secondary text-secondary-foreground"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            {showCheckout ? 'Finalizar Compra' : 'Carrinho de Compras'}
          </SheetTitle>
          <SheetDescription>
            {showCheckout ? 'Complete os dados para finalizar sua compra' : 
             totalItems > 0 ? `${totalItems} item(s) no carrinho` : "Seu carrinho está vazio"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {showCheckout ? (
            <CheckoutForm
              items={items}
              totalPrice={totalPrice}
              onSuccess={() => {
                clearCart();
                setShowCheckout(false);
                setIsOpen(false);
              }}
              onCancel={() => setShowCheckout(false)}
            />
          ) : (
            <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Seu carrinho está vazio</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Adicione produtos para começar suas compras
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                      {item.imagens && item.imagens.length > 0 ? (
                        <img
                          src={item.imagens[0]}
                          alt={item.nome}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                          No Image
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{item.nome}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatCurrency(item.preco)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantidade - 1))}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantidade}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {formatCurrency(item.preco * item.quantidade)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 mt-1"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-primary">{formatCurrency(totalPrice)}</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-button"
                    onClick={() => setShowCheckout(true)}
                  >
                    Finalizar Compra
                  </Button>
                </div>
              </>
            )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}