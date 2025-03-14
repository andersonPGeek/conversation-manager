import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Separator } from "../ui/separator";
import {
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Info,
  Instagram,
} from "lucide-react";

const InstagramSetup = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("step1");
  const [accessToken, setAccessToken] = useState("");
  const [pageId, setPageId] = useState("");
  const [instagramAccountId, setInstagramAccountId] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleVerifyCredentials = () => {
    // In a real app, you would verify the credentials with the Instagram API
    setVerificationStatus("verifying");

    // Simulate API call
    setTimeout(() => {
      if (accessToken && pageId && instagramAccountId) {
        setVerificationStatus("success");
        setErrorMessage("");
      } else {
        setVerificationStatus("error");
        setErrorMessage("Por favor, preencha todos os campos corretamente.");
      }
    }, 1500);
  };

  const handleSaveConfiguration = () => {
    // Save Instagram configuration
    const instagramConfig = {
      accessToken,
      pageId,
      instagramAccountId,
      configuredAt: new Date().toISOString(),
    };

    localStorage.setItem("instagramConfig", JSON.stringify(instagramConfig));
    localStorage.setItem("instagramConfigured", "true");

    // Navigate to the main conversation page
    navigate("/");
  };

  const handleBack = () => {
    navigate("/integrations");
  };

  const goToNextStep = () => {
    if (activeTab === "step1") setActiveTab("step2");
    else if (activeTab === "step2") setActiveTab("step3");
    else if (activeTab === "step3") setActiveTab("step4");
  };

  const goToPreviousStep = () => {
    if (activeTab === "step4") setActiveTab("step3");
    else if (activeTab === "step3") setActiveTab("step2");
    else if (activeTab === "step2") setActiveTab("step1");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center ml-4">
            <Instagram className="h-6 w-6 text-pink-600 mr-2" />
            <h1 className="text-xl font-semibold">
              Configuração do Instagram Messaging API
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto shadow-md">
          <CardHeader>
            <CardTitle>Conecte sua conta do Instagram Business</CardTitle>
            <CardDescription>
              Siga os passos abaixo para configurar a integração com o Instagram
              Messaging API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="step1">1. Pré-requisitos</TabsTrigger>
                <TabsTrigger value="step2">2. Criar App</TabsTrigger>
                <TabsTrigger value="step3">3. Configurar Instagram</TabsTrigger>
                <TabsTrigger value="step4">4. Conectar API</TabsTrigger>
              </TabsList>

              <TabsContent value="step1" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Antes de começar, você precisará:
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <p>Uma conta no Facebook Business Manager</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <p>Uma página do Facebook conectada ao Instagram</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <p>
                        Uma conta comercial do Instagram vinculada à sua página
                        do Facebook
                      </p>
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Importante</AlertTitle>
                    <AlertDescription>
                      Para usar a API do Instagram Messaging, você precisa ter
                      uma conta comercial do Instagram vinculada a uma página do
                      Facebook no Business Manager.
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center">
                    <a
                      href="https://business.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      Acessar Facebook Business Manager
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="step2" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Criar um aplicativo no Facebook Developers
                  </h3>

                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      Acesse o{" "}
                      <a
                        href="https://developers.facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Facebook Developers
                      </a>
                    </li>
                    <li>
                      Clique em "Meus Aplicativos" e depois em "Criar
                      Aplicativo"
                    </li>
                    <li>Selecione "Empresa" como tipo de aplicativo</li>
                    <li>
                      Preencha as informações solicitadas e clique em "Criar
                      Aplicativo"
                    </li>
                    <li>
                      Na página do aplicativo, adicione o produto "Messenger" e
                      "Instagram Graph API"
                    </li>
                    <li>Anote o ID do aplicativo para uso posterior</li>
                  </ol>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Dica</AlertTitle>
                    <AlertDescription>
                      Certifique-se de que você tem permissões administrativas
                      no Business Manager para criar aplicativos.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>

              <TabsContent value="step3" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Configurar o Instagram no seu aplicativo
                  </h3>

                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      Na página do seu aplicativo, vá para a seção "Instagram"
                      no menu lateral
                    </li>
                    <li>
                      Clique em "Configuração básica" e siga as instruções para
                      conectar sua conta do Instagram Business
                    </li>
                    <li>
                      Vá para a seção "Mensagens" e ative a opção "Mensagens do
                      Instagram"
                    </li>
                    <li>
                      Selecione a página do Facebook associada à sua conta do
                      Instagram
                    </li>
                    <li>Anote o ID da página do Facebook</li>
                    <li>Anote o ID da conta do Instagram</li>
                    <li>
                      Vá para a seção "Configuração do sistema" e gere um token
                      de acesso permanente
                    </li>
                    <li>Anote o token de acesso para uso posterior</li>
                  </ol>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-medium mb-2">
                      Informações importantes para coletar:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>ID da página do Facebook</li>
                      <li>ID da conta do Instagram</li>
                      <li>Token de acesso permanente</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="step4" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Conectar à API do Instagram
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pageId">ID da Página do Facebook</Label>
                      <Input
                        id="pageId"
                        placeholder="Ex: 123456789012345"
                        value={pageId}
                        onChange={(e) => setPageId(e.target.value)}
                      />
                      <p className="text-sm text-gray-500">
                        Encontrado na página de configuração do Instagram no seu
                        aplicativo
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagramAccountId">
                        ID da Conta do Instagram
                      </Label>
                      <Input
                        id="instagramAccountId"
                        placeholder="Ex: 987654321098765"
                        value={instagramAccountId}
                        onChange={(e) => setInstagramAccountId(e.target.value)}
                      />
                      <p className="text-sm text-gray-500">
                        Encontrado nas configurações do Instagram no seu
                        aplicativo
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accessToken">Token de Acesso</Label>
                      <Input
                        id="accessToken"
                        placeholder="Ex: EAABZCqZA..."
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        type="password"
                      />
                      <p className="text-sm text-gray-500">
                        Token de acesso permanente gerado nas configurações do
                        sistema
                      </p>
                    </div>

                    {verificationStatus === "error" && (
                      <Alert variant="destructive">
                        <AlertTitle>Erro na verificação</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    )}

                    {verificationStatus === "success" && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertTitle className="text-green-700">
                          Credenciais verificadas com sucesso!
                        </AlertTitle>
                        <AlertDescription className="text-green-600">
                          Suas credenciais do Instagram foram verificadas.
                          Clique em "Salvar Configuração" para continuar.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleVerifyCredentials}
                      disabled={verificationStatus === "verifying"}
                      variant="outline"
                      className="w-full"
                    >
                      {verificationStatus === "verifying"
                        ? "Verificando..."
                        : "Verificar Credenciais"}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={activeTab === "step1"}
            >
              Voltar
            </Button>

            {activeTab === "step4" ? (
              <Button
                onClick={handleSaveConfiguration}
                disabled={verificationStatus !== "success"}
              >
                Salvar Configuração
              </Button>
            ) : (
              <Button onClick={goToNextStep}>Próximo</Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default InstagramSetup;
