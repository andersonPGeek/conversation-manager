import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowLeft, MessageSquare, Instagram } from "lucide-react";

const IntegrationsPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/login");
  };

  const handleWhatsAppSetup = () => {
    navigate("/whatsapp-setup");
  };

  const handleInstagramSetup = () => {
    navigate("/instagram-setup");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center ml-4">
            <h1 className="text-xl font-semibold">Integrações</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* WhatsApp Integration Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>WhatsApp</CardTitle>
                  <CardDescription>
                    Integração com WhatsApp Cloud API
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Configure a integração com a API do WhatsApp para gerenciar
                conversas diretamente na plataforma. Conecte seu número de
                telefone de negócios e comece a atender seus clientes.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleWhatsAppSetup}>
                Configurar WhatsApp
              </Button>
            </CardFooter>
          </Card>

          {/* Instagram Integration Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Instagram</CardTitle>
                  <CardDescription>
                    Integração com Instagram Messaging API
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Configure a integração com a API do Instagram para gerenciar
                mensagens diretas do Instagram. Conecte sua conta de negócios do
                Instagram e centralize o atendimento ao cliente.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleInstagramSetup}>
                Configurar Instagram
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default IntegrationsPage;
