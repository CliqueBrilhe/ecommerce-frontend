import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Sparkles } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-accent mb-8">
      <div className="absolute inset-0">
        <img 
          src={heroBanner}
          alt="Produtos de limpeza premium"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60" />
      </div>
      
      <div className="relative px-8 py-12 text-center text-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <Badge variant="secondary" className="bg-secondary/90 text-secondary-foreground">
            ✨ Produtos Premium de Limpeza
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Sua Casa Sempre
            <span className="block text-secondary"> Limpa e Protegida</span>
          </h1>
          
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Descubra nossa linha completa de produtos de limpeza profissionais. 
            Qualidade garantida, preços imbatíveis e entrega rápida.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-secondary" />
              <span>Compra Segura</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span>Produtos Premium</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-button"
            >
              Ver Ofertas Especiais
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              Explorar Catálogo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}