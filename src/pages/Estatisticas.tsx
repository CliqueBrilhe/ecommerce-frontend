import { useState } from "react"
import { TrendingUp, Calendar, DollarSign, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { pedidos, Pedido } from "@/lib/pedidos";

interface RelatorioPorMes {
  mes: string
  ano: number
  pedidos: Pedido[]
  valorTotal: number
}
const mockPedidosCompletos: Pedido[] = pedidos

export default function Estatisticas() {
  const [anoSelecionado, setAnoSelecionado] = useState<string>("2024")
  const [mesSelecionado, setMesSelecionado] = useState<string>("todos")

  const processarDados = (ano: string, mes: string = "todos") => {
  // 🔹 Filtra pelo ano
  let pedidosFiltrados = mockPedidosCompletos.filter(
    (pedido) => pedido.data.getFullYear().toString() === ano
  );

  // 🔹 Filtra pelo mês (se selecionado)
  if (mes !== "todos") {
    const mesNumero = getMonthNumber(mes); // 1 a 12
    pedidosFiltrados = pedidosFiltrados.filter(
      (pedido) => pedido.data.getMonth() + 1 === mesNumero
    );
  }

  // 🔹 Agrupa por ano/mês
  const dadosPorMes: RelatorioPorMes[] = [];

  pedidosFiltrados.forEach((pedido) => {
    const anoData = pedido.data.getFullYear();
    const mesData = pedido.data.getMonth() + 1;
    const nomeMes = getMonthName(mesData);

    // Verifica se já existe o grupo
    let grupo = dadosPorMes.find(
      (element) => element.ano === anoData && element.mes === nomeMes
    );

    if (!grupo) {
      grupo = {
        mes: nomeMes,
        ano: anoData,
        pedidos: [],
        valorTotal: 0,
      };
      dadosPorMes.push(grupo);
    }

    // Adiciona o pedido ao grupo
    grupo.pedidos.push(pedido);
    grupo.valorTotal +=
      parseFloat(pedido.valorProduto.toString()) +
      parseFloat(pedido.valorFrete.toString());
  });

  console.log("Pedidos filtrados:", pedidosFiltrados);
  console.log("Dados agrupados:", dadosPorMes);

  // 🔹 Ordena do mês mais recente para o mais antigo
  return dadosPorMes.sort((a, b) => {
    const mesA = getMonthNumber(a.mes);
    const mesB = getMonthNumber(b.mes);
    return mesB - mesA;
  });
};

  const getMonthName = (mes: number): string => {
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]
    return meses[mes - 1]
  }

  const getMonthNumber = (nomeMes: string): number => {
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]
    return meses.indexOf(nomeMes) + 1
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const dadosProcessados = processarDados(anoSelecionado, mesSelecionado)
  const valorTotalPeriodo = dadosProcessados.reduce((total, mes) => total + mes.valorTotal, 0)
  const totalPedidosPeriodo = dadosProcessados.reduce((total, mes) => total + mes.pedidos.length, 0)
  const ticketMedio = totalPedidosPeriodo > 0 ? valorTotalPeriodo / totalPedidosPeriodo : 0

  const anosDisponiveis = Array.from(
    new Set(mockPedidosCompletos.map(pedido => pedido.data.getFullYear().toString()))
  ).sort((a, b) => parseInt(b) - parseInt(a))

  const mesesDisponiveis = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  const getPeriodoTexto = () => {
    if (mesSelecionado === "todos") {
      return anoSelecionado
    }
    return `${mesSelecionado} ${anoSelecionado}`
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Estatísticas</h1>
          <p className="text-muted-foreground">Relatórios de vendas e performance</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={anoSelecionado} onValueChange={setAnoSelecionado}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {anosDisponiveis.map((ano) => (
                <SelectItem key={ano} value={ano}>
                  {ano}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os meses</SelectItem>
              {mesesDisponiveis.map((mes) => (
                <SelectItem key={mes} value={mes}>
                  {mes}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-elevation">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Faturamento {getPeriodoTexto()}</p>
                <p className="text-2xl md:text-3xl font-bold text-primary">{formatCurrency(valorTotalPeriodo)}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevation">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total de Pedidos</p>
                <p className="text-2xl md:text-3xl font-bold text-success">{totalPedidosPeriodo}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <Package className="h-6 w-6 md:h-8 md:w-8 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevation">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Ticket Médio</p>
                <p className="text-2xl md:text-3xl font-bold text-warning">{formatCurrency(ticketMedio)}</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Reports */}
      <Card className="shadow-elevation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Calendar className="h-4 w-4 md:h-5 md:w-5" />
            Relatório - {getPeriodoTexto()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {dadosProcessados.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum dado encontrado para {anoSelecionado}.</p>
              </div>
            ) : (
              dadosProcessados.map((dadosMes) => (
                <div key={`${dadosMes.ano}-${dadosMes.mes}`} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-foreground">
                      {dadosMes.mes} {dadosMes.ano}
                    </h3>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {dadosMes.pedidos.length} pedidos
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(dadosMes.valorTotal)}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID do Pedido</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dadosMes.pedidos
                          .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                          .map((pedido) => (
                            <TableRow key={pedido.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">{pedido.id}</TableCell>
                              <TableCell>
                                {new Date(pedido.data).toLocaleDateString('pt-BR')}
                              </TableCell>
                              <TableCell className="text-right font-semibold text-primary">
                                {formatCurrency(parseFloat(pedido.valorProduto.toString())+parseFloat(pedido.valorFrete.toString()))}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-muted-foreground">
                        Total do mês:
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {formatCurrency(dadosMes.valorTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}