import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  nome: string;
  preco: number;
  imagens: string;
  quantidade: number;
  quantidadeMaxima: number;
}

interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: Omit<CartItem, "quantidade">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantidade: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      imagens: [],
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          if (existingItem.quantidade < product.quantidadeMaxima) {
            set((state) => ({
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantidade: item.quantidade + 1 }
                  : item
              ),
            }));
          }
        } else {
          set((state) => ({
            items: [...state.items, { ...product, quantidade: 1 }],
          }));
        }

        // Recalculate totals
        const updatedItems = get().items;
        set({
          totalItems: updatedItems.reduce((total, item) => total + item.quantidade, 0),
          totalPrice: updatedItems.reduce((total, item) => total + item.preco * item.quantidade, 0),
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));

        // Recalculate totals
        const updatedItems = get().items;
        set({
          totalItems: updatedItems.reduce((total, item) => total + item.quantidade, 0),
          totalPrice: updatedItems.reduce((total, item) => total + item.preco * item.quantidade, 0),
        });
      },

      updateQuantity: (id, quantidade) => {
        if (quantidade === 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantidade: Math.min(quantidade, item.quantidadeMaxima) } : item
          ),
        }));

        // Recalculate totals
        const updatedItems = get().items;
        set({
          totalItems: updatedItems.reduce((total, item) => total + item.quantidade, 0),
          totalPrice: updatedItems.reduce((total, item) => total + item.preco * item.quantidade, 0),
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);