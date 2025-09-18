import { Sparkles } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-primary-foreground" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-1">CleanShop</h1>
      <p className="text-text-secondary text-sm">Painel Administrativo</p>
    </div>
  );
};

export default Logo;