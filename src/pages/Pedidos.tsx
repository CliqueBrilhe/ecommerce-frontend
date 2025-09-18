import { useState } from "react"
import { Search, Eye, Calendar, Package, CheckCircle, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { pedidos, Pedido } from "@/lib/pedidos";


const mockPedidos: Pedido[] = pedidos

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidos)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewingPedido, setViewingPedido] = useState<Pedido | null>(null)
  const { toast } = useToast()

  const filteredPedidos = pedidos.filter(pedido =>
    pedido.produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.usuario.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const updatePedidoStatus = (pedidoId: number, newStatus: Pedido['status']) => {
    let pedidoIdNovo = pedidoId
    setPedidos(prevPedidos => 
      prevPedidos.map(pedido => 
        pedido.id == pedidoIdNovo
          ? { ...pedido, status: newStatus }
          : pedido
      )
    )
    
    setViewingPedido(prevPedido => 
      prevPedido && prevPedido.id === pedidoIdNovo
        ? { ...prevPedido, status: newStatus }
        : prevPedido
    )

    const statusLabels = {
      em_analise: "Em Análise",
      aprovado: "Aprovado", 
      reprovado: "Reprovado"
    }

    toast({
      title: "Status atualizado",
      description: `Pedido ${pedidoId} alterado para: ${statusLabels[newStatus]}`,
    })
  }

  const getStatusBadge = (status: Pedido['status']) => {
    const variants = {
      em_analise: "bg-warning text-warning-foreground",
      aprovado: "bg-success text-success-foreground",
      reprovado: "bg-destructive text-destructive-foreground"
    }
    
    const labels = {
      em_analise: "Em Análise",
      aprovado: "Aprovado",
      reprovado: "Reprovado"
    }

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusStats = () => {
    const stats = {
      em_analise: pedidos.filter(p => p.status === "em análise").length,
      aprovado: pedidos.filter(p => p.status === "aprovado").length,
      reprovado: pedidos.filter(p => p.status === "reprovado").length,
      total: pedidos.length
    }
    return stats
  }

  const stats = getStatusStats()

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Pedidos</h1>
          <p className="text-muted-foreground">Gerencie todos os pedidos do CleanShop</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-elevation">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevation">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Análise</p>
                <p className="text-2xl font-bold text-warning">{stats.em_analise}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevation">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Package className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aprovados</p>
                <p className="text-2xl font-bold text-success">{stats.aprovado}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevation">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Package className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reprovados</p>
                <p className="text-2xl font-bold text-destructive">{stats.reprovado}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar pedidos por ID, código do produto ou nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-border focus:ring-primary"
        />
      </div>

      {/* Pedidos Table */}
      <Card className="shadow-elevation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lista de Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">ID Pedido</TableHead>
                  <TableHead className="min-w-[200px]">Produto</TableHead>
                  <TableHead className="min-w-[80px]">Qtd</TableHead>
                  <TableHead className="min-w-[100px]">Data</TableHead>
                  <TableHead className="min-w-[120px]">Valor Total</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPedidos.map((pedido) => {
                  const valorTotal = parseFloat(pedido.valorProduto.toString())
                  
                  return (
                    <TableRow key={pedido.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{pedido.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{pedido.produto.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            Código: {pedido.produto.codigo}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{pedido.quantidade}</TableCell>
                      <TableCell className="text-sm">{pedido.data.toString()}</TableCell>
                      <TableCell className="font-semibold text-primary text-sm">
                        {formatCurrency(valorTotal)}
                      </TableCell>
                      <TableCell>{getStatusBadge(pedido.status)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingPedido(pedido)}
                              className="w-full sm:w-auto"
                            >
                              <Eye className="h-4 w-4 sm:mr-1" />
                              <span className="hidden sm:inline">Ver</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detalhes do Pedido {viewingPedido?.id}</DialogTitle>
                            </DialogHeader>
                            {viewingPedido && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">ID do Pedido</p>
                                    <p className="font-semibold">{viewingPedido.id}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Data do Pedido</p>
                                    <p>{viewingPedido.data.toString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status Atual</p>
                                    {getStatusBadge(viewingPedido.status)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Quantidade</p>
                                    <p>{viewingPedido.quantidade} unidades</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Informações do cliente</p>
                                    <p>nome: {viewingPedido.usuario.nome}</p>
                                    <p>cpf: {viewingPedido.usuario.cpf}</p>
                                    <p>email: {viewingPedido.usuario.login}</p>
                                    <p>cep: {viewingPedido.usuario.cep}</p>
                                  </div>
                                </div>

                                <div className="border-t pt-4">
                                  <h4 className="font-semibold mb-3">Informações do Produto</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Nome do Produto</p>
                                      <p>{viewingPedido.produto.nome}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Código do Produto</p>
                                      <p>{viewingPedido.produto.codigo}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="border-t pt-4">
                                  <h4 className="font-semibold mb-3">Valores</h4>
                                  <div className="space-y-3">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Valor do Produto:</span>
                                      <span className="font-medium">{formatCurrency(viewingPedido.valorProduto)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Valor do Frete:</span>
                                      <span className="font-medium">{formatCurrency(viewingPedido.valorFrete)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                                      <span>Total:</span>
                                      <span className="text-primary">
                                        {valorTotal}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="border-t pt-4">
                                  <h4 className="font-semibold mb-3">Alterar Status do Pedido</h4>
                                  <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                      Selecione o novo status para este pedido:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                      <Button
                                        variant={viewingPedido.status === "em análise" ? "default" : "outline"}
                                        onClick={() => updatePedidoStatus(viewingPedido.id, "em análise")}
                                        className="w-full justify-center"
                                        disabled={viewingPedido.status === "em análise"}
                                      >
                                        <Clock className="h-4 w-4 mr-2" />
                                        Em Análise
                                      </Button>
                                      <Button
                                        variant={viewingPedido.status === "aprovado" ? "default" : "outline"}
                                        onClick={() => updatePedidoStatus(viewingPedido.id, "aprovado")}
                                        className="w-full justify-center bg-success hover:bg-success/90 text-success-foreground"
                                        disabled={viewingPedido.status === "aprovado"}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Aprovar
                                      </Button>
                                      <Button
                                        variant={viewingPedido.status === "reprovado" ? "default" : "outline"}
                                        onClick={() => updatePedidoStatus(viewingPedido.id, "reprovado")}
                                        className="w-full justify-center bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                        disabled={viewingPedido.status === "reprovado"}
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reprovar
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredPedidos.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}