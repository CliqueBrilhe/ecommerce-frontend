import { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CPFInput from "../components/CPFInput";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
const LoginForm = () => {
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateCPF = (cpf: string) => {
    // Remove formatação
    const numbers = cpf.replace(/\D/g, '');
    
    if (numbers.length !== 11) {
      return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(numbers)) {
      return false;
    }

    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 >= 10) digit1 = 0;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 >= 10) digit2 = 0;

    return parseInt(numbers[9]) === digit1 && parseInt(numbers[10]) === digit2;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!cpf.trim()) {
      setError("CPF é obrigatório");
      return;
    }

    if (!validateCPF(cpf)) {
      setError("CPF inválido");
      return;
    }


    // Simula uma requisição
    
    toast({
      title: "Acesso realizado com sucesso!",
      description: `CPF ${cpf} validado.`,
    });
    navigate("/pedidos_cliente", { state: { cpf } });
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Fazer Login
          </h2>
          <p className="text-sm text-text-secondary text-center">
            Entre com seu CPF para acessar o sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CPFInput
            value={cpf}
            onChange={setCpf}
            error={error}
          />

          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;