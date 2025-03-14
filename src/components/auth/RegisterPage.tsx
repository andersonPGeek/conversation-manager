import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { MessageSquare, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { sanitizeInput } from "../../utils/security";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    if (!name.trim()) {
      setError("Nome é obrigatório");
      return false;
    }
    if (!email.trim()) {
      setError("Email é obrigatório");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email inválido");
      return false;
    }
    if (password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }
    return true;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Check if email already exists in mockUsers
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const emailExists = existingUsers.some(
        (user: any) => user.email === email,
      );

      if (emailExists) {
        setError("Este email já está em uso");
        setIsSubmitting(false);
        return;
      }

      // Create new user with sanitized inputs
      const newUser = {
        id: `user-${Date.now()}`,
        name: sanitizeInput(name),
        email: sanitizeInput(email),
        password, // Password is not sanitized as it's not displayed
        role: "admin", // All new users are admins
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      existingUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));

      // Auto login
      login({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      });

      // Redirect to integrations page
      navigate("/integrations");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Criar Conta
          </CardTitle>
          <CardDescription className="text-center">
            Cadastre-se para acessar o Gerenciador de Conversas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full"
            onClick={handleRegister}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Criando conta..." : "Criar Conta"}
          </Button>
          <div className="text-center text-sm text-gray-500">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
              Faça login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
