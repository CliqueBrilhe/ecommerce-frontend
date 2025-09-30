import api from "../lib/api"
export interface Product {
  id: string
  nome: string
  codigo: string
  quantidadeEstoque: number
  preco: number
  promocao: number
  largura: number
  altura: number
  profundidade: number
  imagens: string[]
  descricao: string
  status: "disponivel" | "esgotado" | "descontinuado"
  categoria: string
}
async function getProducts(): Promise<Product[]> {
  try {
    const res = await api.get<Product[]>("/produtos");
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    return [];
  }
}

export const products: Product[] = await getProducts();


export const categories = [
  { id: "all", name: "Todos os Produtos", count: products.length },
  
];