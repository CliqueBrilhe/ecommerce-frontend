import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload, ImageIcon } from "lucide-react"
import api from "../lib/api";

export interface ProductFormData {
  id:string,
  nome: string
  codigo: string
  quantidadeEstoque: number
  preco: number
  promocao: number
  largura: number
  altura: number
  profundidade: number
  imagens: File[]
  descricao: string
}

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void
  onCancel: () => void
  initialData?: Partial<ProductFormData>
  isEditing?: boolean
}

export function ProductForm({ onSubmit, onCancel, initialData, isEditing = false }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    id:initialData?.id || "",
    nome: initialData?.nome || "",
    codigo: initialData?.codigo || "",
    quantidadeEstoque: initialData?.quantidadeEstoque || 0,
    preco: initialData?.preco || 0,
    promocao: initialData?.promocao || 0,
    largura: initialData?.largura || 0,
    altura: initialData?.altura || 0,
    profundidade: initialData?.profundidade || 0,
    imagens: initialData?.imagens || [],
    descricao: initialData?.descricao || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Upload das novas imagens
      const imageData = new FormData();
      formData.imagens.forEach((file) => {
        imageData.append("imagens", file);
      });
      const uploadRes = await api.post("/imagens/upload-multiplas", imageData);
      const uploadedImages = uploadRes.data;

      // Monta o payload final
      const productPayload = {
        nome: formData.nome,
        codigo: formData.codigo,
        quantidadeEstoque: formData.quantidadeEstoque,
        preco: formData.preco,
        promocao: formData.promocao,
        largura: formData.largura,
        altura: formData.altura,
        profundidade: formData.profundidade,
        descricao: formData.descricao,
        imagens: uploadedImages.map((img) => img.filename),
      };

      if (isEditing && initialData?.id) {
        // 🔹 Atualiza produto
        const response = await api.put(`/produtos/${initialData.id}`, productPayload);
        console.log("Produto atualizado:", response.data);
        alert("Produto atualizado com sucesso!");
      } else {
        // 🔹 Cria produto
        const response = await api.post("/produtos", productPayload);
        console.log("Produto criado:", response.data);
        alert("Produto criado com sucesso!");
      }

      onCancel(); // fecha o modal
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro ao salvar o produto");
    }
  };



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (formData.imagens.length + files.length <= 5) {
      setFormData({ ...formData, imagens: [...formData.imagens, ...files] })
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.imagens.filter((_, i) => i !== index)
    setFormData({ ...formData, imagens: newImages })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-elevation">
      <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">
          {isEditing ? "Editar Produto" : "Criar Novo Produto"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-foreground font-medium">Nome do Produto</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Detergente Líquido"
                required
                className="border-border focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo" className="text-foreground font-medium">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                placeholder="Ex: DET001"
                required
                className="border-border focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque" className="text-foreground font-medium">Quantidade em Estoque</Label>
              <Input
                id="estoque"
                type="number"
                min="0"
                value={formData.quantidadeEstoque}
                onChange={(e) => setFormData({ ...formData, quantidadeEstoque: Number(e.target.value) })}
                required
                className="border-border focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco" className="text-foreground font-medium">Preço (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: Number(e.target.value) })}
                required
                className="border-border focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="promocao" className="text-foreground font-medium">Promoção (%)</Label>
              <Input
                id="promocao"
                type="number"
                min="0"
                max="100"
                value={formData.promocao}
                onChange={(e) => setFormData({ ...formData, promocao: Number(e.target.value) })}
                className="border-border focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="largura" className="text-foreground font-medium">Largura (cm)</Label>
              <Input
                id="largura"
                type="number"
                step="0.1"
                min="0"
                value={formData.largura}
                onChange={(e) => setFormData({ ...formData, largura: Number(e.target.value) })}
                required
                className="border-border focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="altura" className="text-foreground font-medium">Altura (cm)</Label>
              <Input
                id="altura"
                type="number"
                step="0.1"
                min="0"
                value={formData.altura}
                onChange={(e) => setFormData({ ...formData, altura: Number(e.target.value) })}
                required
                className="border-border focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profundidade" className="text-foreground font-medium">Profundidade (cm)</Label>
              <Input
                id="profundidade"
                type="number"
                step="0.1"
                min="0"
                value={formData.profundidade}
                onChange={(e) => setFormData({ ...formData, profundidade: Number(e.target.value) })}
                required
                className="border-border focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-foreground font-medium">Imagens do Produto (máximo 5)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={formData.imagens.length >= 5}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer flex flex-col items-center gap-2 ${
                  formData.imagens.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {formData.imagens.length >= 5
                    ? "Limite de 5 imagens atingido"
                    : "Clique para selecionar imagens"}
                </span>
              </label>
            </div>

            {formData.imagens.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {formData.imagens.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-border">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <span className="text-xs text-muted-foreground truncate block mt-1">
                      {file.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-foreground font-medium">Descrição Detalhada</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva o produto em detalhes..."
              rows={4}
              required
              className="border-border focus:ring-primary resize-none"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-clean"
            >
              {isEditing ? "Atualizar Produto" : "Criar Produto"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-border hover:bg-accent"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}