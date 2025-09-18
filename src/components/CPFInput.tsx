import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CPFInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const CPFInput = ({ value, onChange, error }: CPFInputProps) => {
  const formatCPF = (cpf: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = cpf.replace(/\D/g, '');
    
    // Aplica a máscara XXX.XXX.XXX-XX
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    return numbers.slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{2})$/, '$1-$2');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    onChange(formatted);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="cpf" className="text-sm font-medium text-foreground">
        CPF
      </Label>
      <Input
        id="cpf"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Digite seu CPF"
        className={`h-12 ${error ? 'border-destructive' : ''}`}
        maxLength={14}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default CPFInput;