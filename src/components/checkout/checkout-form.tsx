import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, AlertCircle, CreditCard, QrCode } from "lucide-react";
import { CheckoutService, CustomerData, AddressData, FreightData } from "@/lib/checkout-service";
import { formatCurrency } from "@/lib/utils";
import api from "../../lib/api";


interface CheckoutFormProps {
  items: Array<{
    id: string;
    nome: string;
    preco: number;
    quantidade: number;
  }>;
  totalPrice: number;
  onSuccess: () => void;
  onCancel: () => void;
}
interface Usuario {
    id: number
    nome: string
    cpf: string
    cep: string
    dataNascimento: Date
    login: string
    senha: string
    tipoUsuario: "admin" | "comum"
}
export function CheckoutForm({ items, totalPrice, onSuccess, onCancel }: CheckoutFormProps) {
  const [step, setStep] = useState<'customer' | 'shipping' | 'payment' | 'processing' | 'success'>('customer');
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [email2, setEmail2] = useState('');
  const [cep, setCep] = useState('');
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [freightData, setFreightData] = useState<FreightData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [cardData, setCardData] = useState({
    number: '',
    holder_name: '',
    exp_month: '',
    exp_year: '',
    cvv: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');
  const pagarmeApiKey = 'sk_bdc1e93d17fc40de8880bb729fe97689'
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const handleCPFSubmit = async () => {
    setLoading(true);
    setError('');
    if(email!=email2){
      setError('Digite o mesmo e-mail');
      setLoading(false);
      return;
    }
    if (!CheckoutService.validateCPF(cpf)) {
      setError('CPF inválido');
      setLoading(false);
      return;
    }

    try {
      const data = await CheckoutService.fetchCustomerData(cpf);
      if (data) {
        setCustomerData(data);
        setStep('shipping');
      } else {
        setError('CPF não encontrado ou dados indisponíveis');
      }
    } catch (err) {
      setError('Erro ao consultar CPF');
    }

    setLoading(false);
  };

  const handleCEPSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const address = await CheckoutService.fetchAddressData(cep);
      if (address) {
        setAddressData(address);
        
        // Calculate freight
        const totalWeight = items.reduce((acc, item) => acc + (item.quantidade * 500), 0); // 500g per item
        const freight = await CheckoutService.calculateFreight(cep, totalWeight);
        setFreightData(freight);
        
        setStep('payment');
      } else {
        setError('CEP não encontrado');
      }
    } catch (err) {
      setError('Erro ao consultar CEP');
    }

    setLoading(false);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    if (!pagarmeApiKey) {
      setError('Configure sua chave da API Pagar.me primeiro');
      setLoading(false);
      return;
    }

    CheckoutService.savePagarmeApiKey(pagarmeApiKey);
    setStep('processing');
    try {
     const usuario = {
      "nome": customerData.nome,
      "cpf": customerData.cpf,
      "cep": cep,
      "dataNascimento": "1990-05-10",
      "login": email,
      "senha": "teste",
      "tipoUsuario": "comum"
    }
    let res1
    try{
      res1 = await api.post("/usuarios", usuario).then(e=>console.log(res1))
    }
    catch(err){
      console.log("usuario encontrado")
    }
    
    await items.map((item)=> {       
      const pedido = {
        "produtoId": item.id,
        "usuarioId": res1.data.id,
        "quantidade":item.quantidade,
        "valorFrete": freightData.value
      };
      const res = api.post("/pedidos", pedido).then(res =>{
        console.log(`Pedido ${res.data} criado com sucesso!`)
        const resEmail = api.post("/email/send", {
          "to": email,
          "subject": "Confirmação de pedido",
          "text": "Seu pedido foi confirmado! Consulte o status de seus pedidos em 'Meus pedidos'. Atenciosamente, Equipe Click&Brilhe"
        })
      });
    })
    }catch(e){
      console.error(e)
    }
    setLoading(false);
  };

  const finalTotal = totalPrice + (freightData?.value || 0);

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {['customer', 'shipping', 'payment', 'success'].map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === stepName ? 'bg-primary text-primary-foreground' :
              ['customer', 'shipping', 'payment', 'success'].indexOf(step) > index ? 'bg-success text-success-foreground' :
              'bg-muted text-muted-foreground'
            }`}>
              {['customer', 'shipping', 'payment', 'success'].indexOf(step) > index ? '✓' : index + 1}
            </div>
            {index < 3 && <div className="w-12 h-px bg-border mx-2" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 'customer' && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@provider.com"
                maxLength={30}
              />
            </div>
            <div>
              <Label htmlFor="email2">Confirme seu e-Mail</Label>
              <Input
                id="email"
                value={email2}
                onChange={(e) => setEmail2(e.target.value)}
                placeholder="example@provider.com"
                maxLength={30}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={onCancel} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleCPFSubmit} disabled={loading || cpf.length < 14} className="flex-1">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Consultar CPF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'shipping' && customerData && (
        <Card>
          <CardHeader>
            <CardTitle>Dados de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome completo"
                maxLength={50}
              />
              <p className="text-sm text-muted-foreground">CPF: {cpf}</p>
              
            </div>

            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={cep}
                onChange={(e) => setCep(formatCEP(e.target.value))}
                placeholder="00000-000"
                maxLength={9}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={() => setStep('customer')} variant="outline" className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleCEPSubmit} disabled={loading || cep.length < 9} className="flex-1">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Calcular Frete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'payment' && addressData && freightData && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.nome} (x{item.quantidade})</span>
                    <span>{formatCurrency(item.preco * item.quantidade)}</span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete ({freightData.deliveryTime}):</span>
                  <span>{formatCurrency(freightData.value)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <div className="p-3 bg-muted rounded-lg text-sm">
                <p><strong>Entrega:</strong></p>
                <p>{addressData.logradouro}, {addressData.bairro}</p>
                <p>{addressData.localidade} - {addressData.uf}</p>
                <p>CEP: {addressData.cep}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forma de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!CheckoutService.getPagarmeApiKey() && (
                <div>
                  <Label htmlFor="pagarme-key">Chave da API Pagar.me</Label>
                  {/*<Input
                    id="pagarme-key"
                    type="password"
                    value={pagarmeApiKey}
                    onChange={(e) => setPagarmeApiKey(e.target.value)}
                    placeholder="sk_test_..."
                  />*/}
                  <p className="text-xs text-muted-foreground mt-1">
                    ⚠️ Para maior segurança, recomendamos usar Supabase para armazenar chaves de API
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={paymentMethod === 'pix' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('pix')}
                  className="flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  PIX
                </Button>
                <Button
                  variant={paymentMethod === 'credit_card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('credit_card')}
                  className="flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Cartão
                </Button>
              </div>

              {paymentMethod === 'credit_card' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="card-number">Número do Cartão</Label>
                    <Input
                      id="card-number"
                      value={cardData.number}
                      onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value }))}
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="card-name">Nome no Cartão</Label>
                    <Input
                      id="card-name"
                      value={cardData.holder_name}
                      onChange={(e) => setCardData(prev => ({ ...prev, holder_name: e.target.value }))}
                      placeholder="Nome como no cartão"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="exp-month">Mês</Label>
                      <Input
                        id="exp-month"
                        value={cardData.exp_month}
                        onChange={(e) => setCardData(prev => ({ ...prev, exp_month: e.target.value }))}
                        placeholder="MM"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="exp-year">Ano</Label>
                      <Input
                        id="exp-year"
                        value={cardData.exp_year}
                        onChange={(e) => setCardData(prev => ({ ...prev, exp_year: e.target.value }))}
                        placeholder="AA"
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={cardData.cvv}
                        onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                        placeholder="000"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button onClick={() => setStep('shipping')} variant="outline" className="flex-1">
                  Voltar
                </Button>
                <Button onClick={handlePayment} disabled={loading || !pagarmeApiKey} className="flex-1">
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Pagar {formatCurrency(finalTotal)}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'processing' && (
        <Card>
          <CardContent className="py-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Processando Pagamento</h3>
            <p className="text-muted-foreground">Aguarde enquanto processamos sua compra...</p>
          </CardContent>
        </Card>
      )}

      {step === 'success' && (
        <Card>
          <CardContent className="py-8 text-center space-y-4">
            <CheckCircle className="w-12 h-12 mx-auto text-success" />
            <h3 className="text-lg font-semibold">Pagamento Realizado!</h3>
            <p className="text-muted-foreground">Sua compra foi processada com sucesso.</p>
            
            {qrCode && paymentMethod === 'pix' && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">QR Code PIX:</p>
                <img src={qrCode} alt="QR Code PIX" className="mx-auto" />
              </div>
            )}
            
            <p className="text-sm text-muted-foreground">
              Você receberá um e-mail com os detalhes do pedido.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}