import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  User,
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
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { useAuth } from "../auth/AuthProvider";

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface Attendant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  active: boolean;
  role: string;
  createdAt: string;
  lastLogin?: string;
  permissions: Permission[];
}

const AttendantManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Default permissions for attendants
  const defaultPermissions: Permission[] = [
    {
      id: "perm-1",
      name: "Renomear colunas",
      description: "Permite renomear colunas no quadro Kanban",
      enabled: true,
    },
    {
      id: "perm-2",
      name: "Excluir colunas",
      description: "Permite excluir colunas no quadro Kanban",
      enabled: true,
    },
    {
      id: "perm-3",
      name: "Transferir conversas",
      description: "Permite transferir conversas entre atendentes",
      enabled: true,
    },
    {
      id: "perm-4",
      name: "Criar Tags",
      description: "Permite criar novas tags para categorizar conversas",
      enabled: true,
    },
  ];

  const [attendants, setAttendants] = useState<Attendant[]>([
    {
      id: "att-1",
      name: "Carlos Silva",
      email: "carlos@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      active: true,
      role: "attendant",
      createdAt: "2023-05-15",
      lastLogin: "2023-06-10 14:30",
      permissions: [...defaultPermissions],
    },
    {
      id: "att-2",
      name: "Maria Santos",
      email: "maria@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      active: true,
      role: "attendant",
      createdAt: "2023-04-20",
      lastLogin: "2023-06-12 09:15",
      permissions: [...defaultPermissions],
    },
    {
      id: "att-3",
      name: "João Oliveira",
      email: "joao@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
      active: false,
      role: "attendant",
      createdAt: "2023-03-10",
      lastLogin: "2023-05-28 16:45",
      permissions: [...defaultPermissions],
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAttendant, setSelectedAttendant] = useState<Attendant | null>(
    null,
  );

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    active: true,
    permissions: [...defaultPermissions],
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddAttendant = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      active: true,
      permissions: [...defaultPermissions],
    });
    setFormErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setIsAddDialogOpen(true);
  };

  const handleEditAttendant = (attendant: Attendant) => {
    setSelectedAttendant(attendant);
    setFormData({
      name: attendant.name,
      email: attendant.email,
      password: "",
      confirmPassword: "",
      active: attendant.active,
      permissions: [...attendant.permissions],
    });
    setFormErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteAttendant = (attendant: Attendant) => {
    setSelectedAttendant(attendant);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleActive = (attendant: Attendant) => {
    setAttendants(
      attendants.map((a) =>
        a.id === attendant.id ? { ...a, active: !a.active } : a,
      ),
    );
  };

  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Nome é obrigatório";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email inválido";
      isValid = false;
    }

    // Only validate password for new attendants or if password field is not empty
    if (isAddDialogOpen || formData.password) {
      if (isAddDialogOpen && !formData.password) {
        errors.password = "Senha é obrigatória";
        isValid = false;
      } else if (formData.password && formData.password.length < 6) {
        errors.password = "Senha deve ter pelo menos 6 caracteres";
        isValid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Senhas não conferem";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSaveAttendant = () => {
    if (!validateForm()) return;

    if (isAddDialogOpen) {
      // Add new attendant
      const newAttendant: Attendant = {
        id: `att-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name.replace(
          / /g,
          "",
        )}`,
        active: formData.active,
        role: "attendant",
        createdAt: new Date().toISOString().split("T")[0],
        permissions: [...formData.permissions],
      };

      setAttendants([...attendants, newAttendant]);
      setIsAddDialogOpen(false);
    } else if (isEditDialogOpen && selectedAttendant) {
      // Update existing attendant
      setAttendants(
        attendants.map((a) =>
          a.id === selectedAttendant.id
            ? {
                ...a,
                name: formData.name,
                email: formData.email,
                active: formData.active,
                permissions: [...formData.permissions],
                // Password would be updated in a real app
              }
            : a,
        ),
      );
      setIsEditDialogOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedAttendant) {
      setAttendants(attendants.filter((a) => a.id !== selectedAttendant.id));
      setIsDeleteDialogOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePermissionChange = (permissionId: string, enabled: boolean) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.map((permission) =>
        permission.id === permissionId
          ? { ...permission, enabled }
          : permission,
      ),
    });
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
            <User className="h-6 w-6 text-indigo-600 mr-2" />
            <h1 className="text-xl font-semibold">Gestão de Atendentes</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Atendentes</CardTitle>
              <CardDescription>
                Gerencie os atendentes da sua equipe
              </CardDescription>
            </div>
            <Button onClick={handleAddAttendant}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Atendente (R$
              49,90/mês)
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Atendente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendants.map((attendant) => (
                    <TableRow key={attendant.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={attendant.avatar}
                              alt={attendant.name}
                            />
                          </Avatar>
                          <span>{attendant.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{attendant.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Badge
                            variant={attendant.active ? "success" : "secondary"}
                            className={`${attendant.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {attendant.active ? "Ativo" : "Inativo"}
                          </Badge>
                          <Switch
                            checked={attendant.active}
                            onCheckedChange={() =>
                              handleToggleActive(attendant)
                            }
                            className="ml-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{attendant.createdAt}</TableCell>
                      <TableCell>
                        {attendant.lastLogin || "Nunca acessou"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditAttendant(attendant)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteAttendant(attendant)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <div className="text-sm text-gray-500">
              Total de atendentes: {attendants.length}
            </div>
            <div className="text-sm text-gray-500">
              Atendentes ativos: {attendants.filter((a) => a.active).length}
            </div>
          </CardFooter>
        </Card>

        <Card className="mt-8 shadow-md">
          <CardHeader>
            <CardTitle>Plano Atual</CardTitle>
            <CardDescription>
              Informações sobre seu plano de assinatura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100 mb-4">
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

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Atendentes contratados</span>
                <span>{attendants.length}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Valor mensal</span>
                <span>R$ {(49.9 * attendants.length).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Próxima cobrança</span>
                <span>15/07/2023</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Forma de pagamento</span>
                <span>Cartão de crédito terminando em 4242</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => navigate("/account-management")}
            >
              Alterar Plano
            </Button>
            <Button onClick={() => navigate("/account-management")}>
              Gerenciar Pagamentos
            </Button>
          </CardFooter>
        </Card>
      </main>

      {/* Add Attendant Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Atendente</DialogTitle>
            <DialogDescription>
              Adicione um novo atendente à sua equipe. Cada atendente adicional
              será cobrado R$ 49,90/mês conforme seu plano atual.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nome do atendente"
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@exemplo.com"
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="******"
              />
              {formErrors.password && (
                <p className="text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="******"
              />
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                name="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
              <Label htmlFor="active">Ativo</Label>
            </div>

            <div className="space-y-3 mt-4">
              <h3 className="text-sm font-medium">Permissões</h3>
              <div className="space-y-2 border rounded-md p-3 bg-gray-50">
                {formData.permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{permission.name}</p>
                      <p className="text-xs text-gray-500">
                        {permission.description}
                      </p>
                    </div>
                    <Switch
                      id={`permission-${permission.id}`}
                      checked={permission.enabled}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(permission.id, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAttendant}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Attendant Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Atendente</DialogTitle>
            <DialogDescription>
              Atualize as informações do atendente. Deixe os campos de senha em
              branco para manter a senha atual.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nome completo</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nome do atendente"
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@exemplo.com"
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-password">Nova senha (opcional)</Label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Deixe em branco para manter a senha atual"
              />
              {formErrors.password && (
                <p className="text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-confirmPassword">Confirmar nova senha</Label>
              <Input
                id="edit-confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirme a nova senha"
              />
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active"
                name="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
              <Label htmlFor="edit-active">Ativo</Label>
            </div>

            <div className="space-y-3 mt-4">
              <h3 className="text-sm font-medium">Permissões</h3>
              <div className="space-y-2 border rounded-md p-3 bg-gray-50">
                {formData.permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{permission.name}</p>
                      <p className="text-xs text-gray-500">
                        {permission.description}
                      </p>
                    </div>
                    <Switch
                      id={`edit-permission-${permission.id}`}
                      checked={permission.enabled}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(permission.id, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveAttendant}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Attendant Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o atendente{" "}
              <strong>{selectedAttendant?.name}</strong>? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center p-4 bg-red-50 rounded-md border border-red-100">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">
                Todas as conversas e dados associados a este atendente serão
                reatribuídos ou arquivados.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir Atendente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendantManagement;
