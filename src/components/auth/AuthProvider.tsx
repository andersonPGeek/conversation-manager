import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions?: Permission[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }

    // Initialize users array in localStorage if it doesn't exist
    if (!localStorage.getItem("users")) {
      const initialUsers = [
        {
          id: "1",
          email: "admin@example.com",
          password: "admin123",
          name: "Administrador",
          role: "admin",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          email: "atendente@example.com",
          password: "atendente123",
          name: "Atendente",
          role: "attendant",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          email: "gerente@example.com",
          password: "gerente123",
          name: "Gerente",
          role: "manager",
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem("users", JSON.stringify(initialUsers));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
