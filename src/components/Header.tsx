import React, { useState } from "react";
import {
  Search,
  Tag,
  Filter,
  MessageSquare,
  LogOut,
  Settings,
  MessageSquareDashed,
  Home,
  Users,
  BarChart,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { useAuth } from "./auth/AuthProvider";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onManageTags?: () => void;
  availableTags?: Array<{ id: string; name: string; color: string }>;
  onFilterByTag?: (tagId: string | null) => void;
  onOpenSavedMessages?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onSearch = () => {},
  onManageTags = () => {},
  availableTags = [
    { id: "tag1", name: "Urgent", color: "#EF4444" },
    { id: "tag2", name: "Follow-up", color: "#3B82F6" },
    { id: "tag3", name: "Meeting", color: "#10B981" },
    { id: "tag4", name: "New Lead", color: "#F59E0B" },
  ],
  onFilterByTag = () => {},
  onOpenSavedMessages = () => {},
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value); // Search as you type
  };

  const handleFilterByTag = (tagId: string | null) => {
    setActiveFilter(tagId);
    onFilterByTag(tagId);
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="flex flex-col">
      <header className="w-full h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800">
            Gerenciador de Conversas
          </h1>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar conversas..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
                {activeFilter && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                  >
                    {availableTags.findIndex((tag) => tag.id === activeFilter) +
                      1}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleFilterByTag(null)}>
                Mostrar todas as conversas
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {availableTags.map((tag) => (
                <DropdownMenuItem
                  key={tag.id}
                  onClick={() => handleFilterByTag(tag.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <span>{tag.name}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onManageTags}
            className="flex items-center gap-1"
          >
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Gerenciar Tags</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenSavedMessages()}
            className="flex items-center gap-1"
          >
            <MessageSquareDashed className="h-4 w-4" />
            <span className="hidden sm:inline">Mensagens Rápidas</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="font-medium text-gray-500 cursor-default">
                {user?.name || "Usuário"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isAdmin && (
                <>
                  <DropdownMenuItem onClick={() => navigate("/integrations")}>
                    Gerenciar Integrações
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/attendant-management")}
                  >
                    Gestão de Atendentes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/account-management")}
                  >
                    Gestão de Conta
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={logout} className="text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center space-x-6">
        <a
          href="#"
          className="flex items-center gap-2 text-blue-600 border-b-2 border-blue-600 pb-1"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm font-medium">Conversas</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 pb-1 border-b-2 border-transparent hover:border-blue-600"
        >
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">Contatos</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 pb-1 border-b-2 border-transparent hover:border-blue-600"
        >
          <BarChart className="h-4 w-4" />
          <span className="text-sm font-medium">Relatórios</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 pb-1 border-b-2 border-transparent hover:border-blue-600"
        >
          <Home className="h-4 w-4" />
          <span className="text-sm font-medium">Dashboard</span>
        </a>
      </nav>
    </div>
  );
};

export default Header;
