import React, { useState, useEffect } from "react";
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
import {
  sanitizeInput,
  checkLoginRateLimit,
  incrementLoginAttempt,
  resetLoginAttempts,
  getLoginBlockTimeRemaining,
} from "../../utils/security";

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
}

// Mock users for testing
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
    name: "Administrador",
    role: "admin",
  },
  {
    id: "2",
    email: "atendente@example.com",
    password: "atendente123",
    name: "Atendente",
    role: "attendant",
  },
  {
    id: "3",
    email: "gerente@example.com",
    password: "gerente123",
    name: "Gerente",
    role: "manager",
  },
];

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const navigate = useNavigate();

  // Simulate IP address for demo purposes
  const userIpAddress = "127.0.0.1";

  useEffect(() => {
    let timer: number;

    if (isBlocked && blockTimeRemaining > 0) {
      timer = window.setInterval(() => {
        setBlockTimeRemaining((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsBlocked(false);
            clearInterval(timer);
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBlocked, blockTimeRemaining]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check if user is rate limited
    if (!checkLoginRateLimit(userIpAddress)) {
      const timeRemaining = getLoginBlockTimeRemaining(userIpAddress);
      setIsBlocked(true);
      setBlockTimeRemaining(timeRemaining);
      setError(
        `Muitas tentativas de login. Tente novamente em ${Math.ceil(timeRemaining / 60)} minutos.`,
      );
      return;
    }

    // Sanitize inputs to prevent XSS
    const sanitizedEmail = sanitizeInput(email);

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user =
      users.find(
        (user: any) =>
          user.email === sanitizedEmail && user.password === password,
      ) ||
      mockUsers.find(
        (user) => user.email === sanitizedEmail && user.password === password,
      );

    if (user) {
      // Reset login attempts on successful login
      resetLoginAttempts(userIpAddress);

      // Store user info in localStorage
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }),
      );

      // After login, go to home or integrations page based on role
      if (user.role === "admin") {
        navigate("/integrations");
      } else {
        navigate("/");
      }
    } else {
      // Increment failed login attempts
      incrementLoginAttempt(userIpAddress);

      setError("Email ou senha inválidos");
    }
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
            Gerenciador de Conversas
          </CardTitle>
          <CardDescription className="text-center">
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {isBlocked && (
              <div className="p-3 rounded-md bg-amber-50 text-amber-700 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>
                  Conta temporariamente bloqueada. Tente novamente em{" "}
                  {Math.floor(blockTimeRemaining / 60)}:
                  {(blockTimeRemaining % 60).toString().padStart(2, "0")}
                </span>
              </div>
            )}
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a
                  href="#"
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" onClick={handleLogin}>
            Entrar
          </Button>
          <div className="text-center text-sm text-gray-500">
            Não tem uma conta?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800"
            >
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
        <div className="px-6 pb-6 text-center text-sm text-gray-500">
          <p>Usuários de teste:</p>
          <p>admin@example.com / admin123</p>
          <p>atendente@example.com / atendente123</p>
          <p>gerente@example.com / gerente123</p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
