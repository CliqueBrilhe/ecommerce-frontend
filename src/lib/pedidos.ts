import api from "../lib/api"
interface Produto {
  id: number,
  codigo: string,
  nome: string,
  quantidadeEstoque: number,
  preco: number,
  promocao: number,
  largura: number,
  altura: number,
  profundidade: number
  imagens: []
  descricao: string

}
interface Usuario {

  id: number
  nome: string
  cpf: string
  cep: string
  dataNascimento: Date,
  login: string,
  senha: string,
  tipoUsuario: "comum" | "admin"
}
 
export interface Pedido {
  id: number,
  produto: Produto
  quantidade: number
  data: Date
  valorProduto: number,
  valorFrete: number,
  status: "em análise" | "aprovado" | "reprovado"
  usuario: Usuario
}

async function getPedidos(): Promise<Pedido[]> {
  try {
    const res = await api.get<Pedido[]>("/pedidos");
    
    const pedidosTratados = res.data.map((pedido) => {
        let pedidoNovo = { 
          ...pedido, 
          data: new Date(pedido.data)  // conversao
        };

        return pedidoNovo;
      });

    return pedidosTratados;
  } catch (err) {
    console.error("Erro ao buscar pedidos:", err);
    return [];
  }
}

export const pedidos: Pedido[] = await getPedidos();
