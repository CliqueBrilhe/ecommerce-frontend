// Service for integrating with external APIs (Receita Federal, CEP, and Pagar.me)
import axios from "axios";
export interface CustomerData {
  nome: string;
  cpf: string;
  situacao: string;
}

export interface AddressData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface FreightData {
  value: number;
  deliveryTime: string;
}

export interface PaymentData {
  amount: number;
  customer: CustomerData;
  paymentMethod: string;
  cardData?: {
    number: string;
    holder_name: string;
    exp_month: string;
    exp_year: string;
    cvv: string;
  };
}

export class CheckoutService {
  private static PAGARME_API_KEY_STORAGE = 'pagarme_api_key';

  // CPF validation
  static validateCPF(cpf: string): boolean {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    if (cleanCPF.length !== 11) return false;
    
    // Check for repeated digits
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validate check digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF[i]) * (10 - i);
    }
    let digit1 = (sum * 10) % 11;
    if (digit1 === 10) digit1 = 0;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF[i]) * (11 - i);
    }
    let digit2 = (sum * 10) % 11;
    if (digit2 === 10) digit2 = 0;
    
    return digit1 === parseInt(cleanCPF[9]) && digit2 === parseInt(cleanCPF[10]);
  }

  // Fetch customer data from Receita Federal API
  static async fetchCustomerData(cpf: string): Promise<CustomerData | null> {
    return {
          nome: 'Heitor A B',
          cpf: '11111111111',
          situacao: 'valido'
        };
    try {
      const cleanCPF = cpf.replace(/[^\d]/g, '');
      
      // Using a public API for CPF consultation
      const response = await fetch(`https://www.receitaws.com.br/v1/cpf/${cleanCPF}`);
      const data = await response.json();
      
      if (data.status === 'OK') {
        return {
          nome: data.nome,
          cpf: cleanCPF,
          situacao: data.situacao
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching customer data:', error);
      return null;
    }
  }

  // Fetch address data from CEP API
  static async fetchAddressData(cep: string): Promise<AddressData | null> {
    try {
      const cleanCEP = cep.replace(/[^\d]/g, '');
      
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        return {
          cep: cleanCEP,
          logradouro: data.logradouro,
          complemento: data.complemento,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching address data:', error);
      return null;
    }
  }

  // Calculate freight (mock implementation)
  static async calculateFreight(cep: string, weight: number): Promise<FreightData> {
    // Mock freight calculation based on CEP
    const cleanCEP = cep.replace(/[^\d]/g, '');
    const firstDigit = parseInt(cleanCEP[0]);
    
    // Different regions have different rates
    const baseRate = firstDigit <= 3 ? 15 : firstDigit <= 6 ? 25 : 35;
    const weightRate = Math.ceil(weight / 1000) * 5;
    
    return {
      value: baseRate + weightRate,
      deliveryTime: firstDigit <= 3 ? '1-2 dias úteis' : firstDigit <= 6 ? '2-4 dias úteis' : '3-7 dias úteis'
    };
  }

  // Pagar.me API key management
  static savePagarmeApiKey(apiKey: string): void {
    localStorage.setItem(this.PAGARME_API_KEY_STORAGE, apiKey);
  }

  static getPagarmeApiKey(): string | null {
    return localStorage.getItem(this.PAGARME_API_KEY_STORAGE);
  }

  // Process payment with Pagar.me (mock implementation)
  static async processPayment(paymentData: PaymentData): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
    qrCode?: string;
  }> {
    const apiKey = this.getPagarmeApiKey();
    if (!apiKey) {
      return { success: false, error: "Chave da API Pagar.me não configurada" };
    }

    try {
      const response = await axios.post(
        "https://api.pagar.me/core/v5/orders",
        {
          items: [
            {
              name: "Compra no site",
              quantity: 1,
              unit_price: paymentData.amount, // valor já em centavos
            },
          ],
          customer: paymentData.customer,
          payments: [
            {
              payment_method: "pix",
              pix: {
                expires_in: 3600, // QR válido por 1h
              },
            },
          ],
        },
        {
          auth: {
            username: apiKey,
            password: "",
          },
        }
      );

      const charge = response.data.charges[0];
      const lastTransaction = charge.last_transaction;

      return {
        success: true,
        transactionId: charge.id,
        qrCode: lastTransaction.pix_qr_code_base64, // imagem em base64
      };
    } catch (error: any) {
      console.error("Erro no pagamento:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errors?.[0]?.message || "Erro no pagamento",
      };
    }
  }
}