import { useState, useEffect } from "react"
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProductForm, ProductFormData } from "@/components/ProductForm"
import api from "../lib/api"

interface Product {
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
}


export default function Produtos() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get("/produtos")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Erro ao buscar produtos:", err));
  }, []);
  
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)

  const filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  async function handleCreateProduct (data: ProductFormData) {
    const newProduct: Product = {
      id: (products.length + 1).toString(),
      ...data,
      imagens: data.imagens.map(file => file.name),
      status: data.quantidadeEstoque > 0 ? "disponivel" : "esgotado"
    }
    
    setShowCreateForm(false)
    console.log("produto",newProduct);
    const response = await api.post("/produtos", newProduct);
    console.log("Produto criado:", response.data);
    setProducts([...products, newProduct])
    
    /*AQUI criar produto*/
  }
  
  async function handleEditProduct  (data: ProductFormData)  {
    if (!editingProduct) return
    
    const updatedProduct: Product = {
      ...editingProduct,
      ...data,
      imagens: data.imagens.map(file => file.name),
      status: data.quantidadeEstoque > 0 ? "disponivel" : "esgotado"
    }
    console.log("Produto atualizado:", updatedProduct)
    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p))
    try {
      const response = await api.put(`/produtos/${editingProduct.id}`, {
      nome: updatedProduct.nome,
      quantidadeEstoque: updatedProduct.quantidadeEstoque,
      preco: updatedProduct.preco,
      promocao: updatedProduct.promocao,
    });
    } catch (err) {
      console.error("Erro ao atualizar produto:", err);
    }
    setEditingProduct(null)
    
  }
  

  const getStatusBadge = (status: Product['status']) => {
    const variants = {
      disponivel: "bg-success text-success-foreground",
      esgotado: "bg-destructive text-destructive-foreground",
      descontinuado: "bg-muted text-muted-foreground"
    }
    
    const labels = {
      disponivel: "Disponível",
      esgotado: "Esgotado",
      descontinuado: "Descontinuado"
    }

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }
  async function deleteProduct(product){
    try {
    await api.delete(`/produtos/${product.id}`);
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
  }
  setProducts(prevProducts => prevProducts.filter(p => p.id !== product.id));
  }
  const formatPrice = (price: number, discount: number = 0) => {
    const discountedPrice = price * (1 - discount / 100)
    return {
      original: price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      discounted: discountedPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seu catálogo de produtos de limpeza</p>
        </div>
        
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-clean"
        >
          <Plus className="h-4 w-4 mr-2" />
          Criar Produto
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos por nome ou código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-border focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredProducts.map((product) => {
          const prices = formatPrice(product.preco, product.promocao)
          
          return (
            <Card key={product.id} className="shadow-elevation hover:shadow-clean transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base md:text-lg font-semibold text-foreground line-clamp-2">
                      {product.nome}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Código: {product.codigo}
                    </p>
                    
                  </div>
                  {getStatusBadge(product.status)}
                </div>
                
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex flex-col">
                    {product.promocao > 0 ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold text-primary">
                          {prices.discounted}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {prices.original}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          -{product.promocao}%
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-primary">
                        {prices.original}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-muted-foreground">Estoque</p>
                    <p className={`font-semibold ${
                      product.quantidadeEstoque > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {product.quantidadeEstoque} unid.
                    </p>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Dimensões: {product.largura} × {product.altura} × {product.profundidade} cm</p>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setViewingProduct(product)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="hidden xs:inline">Ver</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{viewingProduct?.nome}</DialogTitle>
                      </DialogHeader>
                      {viewingProduct && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Código</p>
                              <p>{viewingProduct.codigo}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Status</p>
                              {getStatusBadge(viewingProduct.status)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Preço</p>
                              <p className="font-semibold text-primary">
                                {formatPrice(viewingProduct.preco, viewingProduct.promocao).discounted}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Estoque</p>
                              <p>{viewingProduct.quantidadeEstoque} unidades</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Dimensões (L×A×P)</p>
                              <p>{viewingProduct.largura} × {viewingProduct.altura} × {viewingProduct.profundidade} cm</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Descrição</p>
                            <p className="text-sm">{viewingProduct.descricao}</p>
                          </div>
                          <Button
                            onClick={() => setEditingProduct(viewingProduct)}
                            className="w-full bg-primary hover:bg-primary/90"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Produto
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProduct(product)}
                      className="flex-1 w-auto sm:w-auto bg-grey hover:bg-red-500 text-black shadow-clean"
                    >Deletar</Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingProduct(product)}
                    className="flex-shrink-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum produto encontrado.</p>
        </div>
      )}

      {/* Create Product Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ProductForm
            onSubmit={handleCreateProduct}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {editingProduct && (
            <ProductForm
              onSubmit={handleEditProduct}
              onCancel={() => setEditingProduct(null)}
              initialData={{
                ...editingProduct,
                imagens: [] // Reset images for editing
              }}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}