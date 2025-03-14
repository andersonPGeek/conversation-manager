import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuth } from "../auth/AuthProvider";

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  attendants: number;
  period: string;
}

const AccountManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("subscription");
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [isChangePlanDialogOpen, setIsChangePlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  // Mock data for payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm-1",
      type: "visa",
      last4: "4242",
      expiryMonth: "12",
      expiryYear: "2025",
      isDefault: true,
    },
    {
      id: "pm-2",
      type: "mastercard",
      last4: "5555",
      expiryMonth: "08",
      expiryYear: "2024",
      isDefault: false,
    },
  ]);

  // Mock data for invoices
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "inv-1",
      date: "2023-06-01",
      amount: 149.7,
      status: "paid",
      attendants: 3,
      period: "01/06/2023 - 30/06/2023",
    },
    {
      id: "inv-2",
      date: "2023-05-01",
      amount: 149.7,
      status: "paid",
      attendants: 3,
      period: "01/05/2023 - 31/05/2023",
    },
    {
      id: "inv-3",
      date: "2023-04-01",
      amount: 99.8,
      status: "paid",
      attendants: 2,
      period: "01/04/2023 - 30/04/2023",
    },
  ]);

  // Form state for adding a new card
  const [cardFormData, setCardFormData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    setAsDefault: true,
  });

  const [cardFormErrors, setCardFormErrors] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddCard = () => {
    setCardFormData({
      cardNumber: "",
      cardholderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      setAsDefault: true,
    });
    setCardFormErrors({
      cardNumber: "",
      cardholderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    });
    setIsAddCardDialogOpen(true);
  };

  const handleChangePlan = () => {
    setIsChangePlanDialogOpen(true);
  };

  const validateCardForm = () => {
    const errors = {
      cardNumber: "",
      cardholderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
    };
    let isValid = true;

    // Validate card number (simple validation for demo)
    if (!cardFormData.cardNumber.trim()) {
      errors.cardNumber = "Número do cartão é obrigatório";
      isValid = false;
    } else if (!/^\d{16}$/.test(cardFormData.cardNumber.replace(/\s/g, ""))) {
      errors.cardNumber = "Número do cartão inválido";
      isValid = false;
    }

    // Validate cardholder name
    if (!cardFormData.cardholderName.trim()) {
      errors.cardholderName = "Nome do titular é obrigatório";
      isValid = false;
    }

    // Validate expiry month
    if (!cardFormData.expiryMonth.trim()) {
      errors.expiryMonth = "Mês é obrigatório";
      isValid = false;
    } else if (!/^(0[1-9]|1[0-2])$/.test(cardFormData.expiryMonth)) {
      errors.expiryMonth = "Mês inválido";
      isValid = false;
    }

    // Validate expiry year
    if (!cardFormData.expiryYear.trim()) {
      errors.expiryYear = "Ano é obrigatório";
      isValid = false;
    } else if (!/^\d{4}$/.test(cardFormData.expiryYear)) {
      errors.expiryYear = "Ano inválido";
      isValid = false;
    } else {
      const currentYear = new Date().getFullYear();
      const year = parseInt(cardFormData.expiryYear);
      if (year < currentYear || year > currentYear + 10) {
        errors.expiryYear = "Ano fora do intervalo válido";
        isValid = false;
      }
    }

    // Validate CVV
    if (!cardFormData.cvv.trim()) {
      errors.cvv = "CVV é obrigatório";
      isValid = false;
    } else if (!/^\d{3,4}$/.test(cardFormData.cvv)) {
      errors.cvv = "CVV inválido";
      isValid = false;
    }

    setCardFormErrors(errors);
    return isValid;
  };

  const handleSaveCard = () => {
    if (!validateCardForm()) return;

    // Add new card
    const newCard: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: getCardType(cardFormData.cardNumber),
      last4: cardFormData.cardNumber.slice(-4),
      expiryMonth: cardFormData.expiryMonth,
      expiryYear: cardFormData.expiryYear,
      isDefault: cardFormData.setAsDefault,
    };

    // If new card is default, update other cards
    let updatedPaymentMethods = paymentMethods.map((pm) => ({
      ...pm,
      isDefault: cardFormData.setAsDefault ? false : pm.isDefault,
    }));

    setPaymentMethods([...updatedPaymentMethods, newCard]);
    setIsAddCardDialogOpen(false);
  };

  const handleSetDefaultCard = (cardId: string) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === cardId,
      })),
    );
  };

  const handleRemoveCard = (cardId: string) => {
    setPaymentMethods(paymentMethods.filter((pm) => pm.id !== cardId));
  };

  const handleCardInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setCardFormData({
      ...cardFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSavePlanChange = () => {
    // In a real app, this would update the subscription plan
    setIsChangePlanDialogOpen(false);
  };

  // Helper function to determine card type from number
  const getCardType = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s+/g, "");
    if (/^4/.test(number)) return "visa";
    if (/^5[1-5]/.test(number)) return "mastercard";
    if (/^3[47]/.test(number)) return "amex";
    if (/^6(?:011|5)/.test(number)) return "discover";
    return "unknown";
  };

  // Format card number with spaces
  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar para a página inicial
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center ml-4">
            <DollarSign className="h-6 w-6 text-indigo-600 mr-2" />
            <h1 className="text-xl font-semibold">Gestão de Conta</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="subscription">Assinatura</TabsTrigger>
            <TabsTrigger value="payment">Métodos de Pagamento</TabsTrigger>
            <TabsTrigger value="invoices">Faturas</TabsTrigger>
          </TabsList>

          <TabsContent value="subscription">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Detalhes da Assinatura</CardTitle>
                <CardDescription>
                  Gerencie seu plano de assinatura e ciclo de faturamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-indigo-800">
                        Plano Empresarial
                      </h3>
                      <p className="text-indigo-600">
                        R$ 49,90 por atendente / mês
                      </p>
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                      Ativo
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Detalhes do Plano</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Plano atual</span>
                        <span>Empresarial (Mensal)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Atendentes</span>
                        <span>3 atendentes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Valor por atendente
                        </span>
                        <span>R$ 49,90 / mês</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total mensal</span>
                        <span className="font-medium">R$ 149,70</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Ciclo de Faturamento</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Próxima cobrança</span>
                        <span>15/07/2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Período</span>
                        <span>15/07/2023 - 14/08/2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Método de pagamento
                        </span>
                        <span>Visa terminando em 4242</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status</span>
                        <Badge
                          variant="success"
                          className="bg-green-100 text-green-800"
                        >
                          Ativo
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Opções de Plano</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-2 border-indigo-200 bg-indigo-50">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-indigo-800">
                            Mensal
                          </CardTitle>
                          <Badge className="bg-indigo-100 text-indigo-800">
                            Atual
                          </Badge>
                        </div>
                        <CardDescription className="text-indigo-600">
                          Pagamento mensal
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-indigo-800 mb-1">
                          R$ 49,90
                          <span className="text-sm font-normal text-indigo-600">
                            {" "}
                            / atendente / mês
                          </span>
                        </div>
                        <p className="text-sm text-indigo-700 mb-4">
                          Cobrado mensalmente
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>Anual</CardTitle>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            Economize 15%
                          </Badge>
                        </div>
                        <CardDescription>
                          Pagamento anual com desconto
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold mb-1">
                          R$ 42,42
                          <span className="text-sm font-normal text-gray-500">
                            {" "}
                            / atendente / mês
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          R$ 509,04 por atendente, cobrado anualmente
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-6">
                <Button onClick={handleChangePlan}>Alterar Plano</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Métodos de Pagamento</CardTitle>
                  <CardDescription>
                    Gerencie seus cartões e métodos de pagamento
                  </CardDescription>
                </div>
                <Button onClick={handleAddCard}>
                  <CreditCard className="mr-2 h-4 w-4" /> Adicionar Cartão
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Nenhum método de pagamento cadastrado
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`p-4 rounded-md border ${method.isDefault ? "border-indigo-200 bg-indigo-50" : "border-gray-200"}`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-8 bg-white rounded border flex items-center justify-center">
                                {method.type === "visa" && (
                                  <span className="text-blue-600 font-bold">
                                    VISA
                                  </span>
                                )}
                                {method.type === "mastercard" && (
                                  <span className="text-red-600 font-bold">
                                    MC
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {method.type.charAt(0).toUpperCase() +
                                    method.type.slice(1)}{" "}
                                  terminando em {method.last4}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Expira em {method.expiryMonth}/
                                  {method.expiryYear}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {method.isDefault ? (
                                <Badge className="bg-indigo-100 text-indigo-800">
                                  Padrão
                                </Badge>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleSetDefaultCard(method.id)
                                  }
                                >
                                  Definir como padrão
                                </Button>
                              )}
                              {!method.isDefault && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRemoveCard(method.id)}
                                >
                                  Remover
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Histórico de Faturas</CardTitle>
                <CardDescription>
                  Visualize e baixe suas faturas anteriores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Atendentes</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            {new Date(invoice.date).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell>{invoice.period}</TableCell>
                          <TableCell>{invoice.attendants}</TableCell>
                          <TableCell>R$ {invoice.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(invoice.status)}
                              className={`
                                ${invoice.status === "paid" ? "bg-green-100 text-green-800" : ""}
                                ${invoice.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                                ${invoice.status === "failed" ? "bg-red-100 text-red-800" : ""}
                              `}
                            >
                              {invoice.status === "paid" && "Pago"}
                              {invoice.status === "pending" && "Pendente"}
                              {invoice.status === "failed" && "Falhou"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-1" /> PDF
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Card Dialog */}
      <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Cartão de Crédito</DialogTitle>
            <DialogDescription>
              Adicione um novo cartão de crédito para pagamentos
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                value={cardFormData.cardNumber}
                onChange={(e) => {
                  const formattedValue = formatCardNumber(e.target.value);
                  setCardFormData({
                    ...cardFormData,
                    cardNumber: formattedValue,
                  });
                }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {cardFormErrors.cardNumber && (
                <p className="text-sm text-red-500">
                  {cardFormErrors.cardNumber}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cardholderName">Nome no Cartão</Label>
              <Input
                id="cardholderName"
                name="cardholderName"
                value={cardFormData.cardholderName}
                onChange={handleCardInputChange}
                placeholder="NOME COMO ESTÁ NO CARTÃO"
              />
              {cardFormErrors.cardholderName && (
                <p className="text-sm text-red-500">
                  {cardFormErrors.cardholderName}
                </p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiryMonth">Mês</Label>
                <Input
                  id="expiryMonth"
                  name="expiryMonth"
                  value={cardFormData.expiryMonth}
                  onChange={handleCardInputChange}
                  placeholder="MM"
                  maxLength={2}
                />
                {cardFormErrors.expiryMonth && (
                  <p className="text-sm text-red-500">
                    {cardFormErrors.expiryMonth}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiryYear">Ano</Label>
                <Input
                  id="expiryYear"
                  name="expiryYear"
                  value={cardFormData.expiryYear}
                  onChange={handleCardInputChange}
                  placeholder="AAAA"
                  maxLength={4}
                />
                {cardFormErrors.expiryYear && (
                  <p className="text-sm text-red-500">
                    {cardFormErrors.expiryYear}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  value={cardFormData.cvv}
                  onChange={handleCardInputChange}
                  placeholder="123"
                  maxLength={4}
                />
                {cardFormErrors.cvv && (
                  <p className="text-sm text-red-500">{cardFormErrors.cvv}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="setAsDefault"
                name="setAsDefault"
                checked={cardFormData.setAsDefault}
                onChange={handleCardInputChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="setAsDefault" className="text-sm">
                Definir como método de pagamento padrão
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddCardDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveCard}>Adicionar Cartão</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Plan Dialog */}
      <Dialog
        open={isChangePlanDialogOpen}
        onOpenChange={setIsChangePlanDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Alterar Plano</DialogTitle>
            <DialogDescription>
              Escolha o plano que melhor atende às suas necessidades
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-4">
              <div
                className={`p-4 rounded-md border-2 ${selectedPlan === "monthly" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"} cursor-pointer`}
                onClick={() => setSelectedPlan("monthly")}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-lg">Plano Mensal</h3>
                  {selectedPlan === "monthly" && (
                    <Badge className="bg-indigo-100 text-indigo-800">
                      Selecionado
                    </Badge>
                  )}
                </div>
                <p className="text-gray-500 mb-2">
                  Pagamento mensal, sem compromisso de longo prazo
                </p>
                <div className="text-xl font-bold">
                  R$ 49,90
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    / atendente / mês
                  </span>
                </div>
              </div>

              <div
                className={`p-4 rounded-md border-2 ${selectedPlan === "annual" ? "border-indigo-500 bg-indigo-50" : "border-gray-200"} cursor-pointer`}
                onClick={() => setSelectedPlan("annual")}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-lg">Plano Anual</h3>
                  {selectedPlan === "annual" ? (
                    <Badge className="bg-indigo-100 text-indigo-800">
                      Selecionado
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Economize 15%
                    </Badge>
                  )}
                </div>
                <p className="text-gray-500 mb-2">
                  Pagamento anual com desconto, cobrado uma vez por ano
                </p>
                <div className="text-xl font-bold">
                  R$ 42,42
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    / atendente / mês
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  R$ 509,04 por atendente, cobrado anualmente
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="font-medium mb-2">Resumo da alteração</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Plano atual:</span>
                  <span>Mensal (R$ 49,90 / atendente / mês)</span>
                </div>
                <div className="flex justify-between">
                  <span>Novo plano:</span>
                  <span>
                    {selectedPlan === "monthly"
                      ? "Mensal (R$ 49,90 / atendente / mês)"
                      : "Anual (R$ 42,42 / atendente / mês)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Atendentes:</span>
                  <span>3</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Novo valor:</span>
                  <span>
                    {selectedPlan === "monthly"
                      ? "R$ 149,70 / mês"
                      : "R$ 1.527,12 / ano (R$ 127,26 / mês)"}
                  </span>
                </div>
                {selectedPlan === "annual" && (
                  <div className="flex justify-between text-green-600">
                    <span>Economia:</span>
                    <span>R$ 269,28 / ano</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-700">
                    A alteração do plano entrará em vigor no próximo ciclo de
                    faturamento. Você continuará no plano atual até o final do
                    período atual.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsChangePlanDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSavePlanChange}>Confirmar Alteração</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountManagement;
