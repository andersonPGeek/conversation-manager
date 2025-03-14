import React, { useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { Card } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Clock, MoreVertical, UserPlus, MoveHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Attendant {
  id: string;
  name: string;
  avatar: string;
  active: boolean;
}

interface Column {
  id: string;
  title: string;
}

interface ConversationCardProps {
  id?: string;
  contactName?: string;
  contactAvatar?: string;
  lastMessage?: string;
  timestamp?: string;
  tags?: Tag[];
  unreadCount?: number;
  onCardClick?: () => void;
  isDragging?: boolean;
  onChangeAttendant?: (
    conversationId: string,
    attendantId: string,
    columnId: string,
  ) => void;
  onChangeColumn?: (conversationId: string, columnId: string) => void;
  availableAttendants?: Attendant[];
  availableColumns?: Column[];
  currentAttendantId?: string;
  currentColumnId?: string;
}

const ConversationCard: React.FC<ConversationCardProps> = ({
  id = "conv-1",
  contactName = "John Doe",
  contactAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  lastMessage = "Hey there! Just checking in about our meeting tomorrow. Are we still on for 2pm?",
  timestamp = "10:30 AM",
  tags = [
    { id: "tag1", name: "Urgent", color: "red" },
    { id: "tag2", name: "Meeting", color: "blue" },
  ],
  unreadCount = 0,
  onCardClick = () => {},
  isDragging = false,
  onChangeAttendant = () => {},
  onChangeColumn = () => {},
  availableAttendants = [
    {
      id: "att-1",
      name: "Carlos Silva",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      active: true,
    },
    {
      id: "att-2",
      name: "Maria Santos",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      active: true,
    },
    {
      id: "att-3",
      name: "João Oliveira",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
      active: false,
    },
  ],
  availableColumns = [
    { id: "column-1", title: "Demonstração" },
    { id: "column-2", title: "Levantamento de escopo" },
    { id: "column-3", title: "Proposta" },
    { id: "column-4", title: "Contrato" },
  ],
  currentAttendantId = "att-1",
  currentColumnId = "column-1",
}) => {
  // State for dialogs
  const [isChangeAttendantDialogOpen, setIsChangeAttendantDialogOpen] =
    useState(false);
  const [isChangeColumnDialogOpen, setIsChangeColumnDialogOpen] =
    useState(false);
  const [selectedAttendantId, setSelectedAttendantId] =
    useState(currentAttendantId);
  const [selectedColumnId, setSelectedColumnId] = useState(currentColumnId);
  const [targetColumnId, setTargetColumnId] = useState(currentColumnId);
  const { user } = useAuth();

  // Truncate message if it's too long
  const truncatedMessage =
    lastMessage.length > 80
      ? `${lastMessage.substring(0, 80)}...`
      : lastMessage;

  // Function to get badge color based on tag color
  const getBadgeVariant = (color: string) => {
    switch (color) {
      case "red":
        return "destructive";
      case "blue":
        return "default";
      case "green":
        return "secondary";
      case "yellow":
        return "outline";
      default:
        return "default";
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on dropdown menu
    if ((e.target as HTMLElement).closest(".dropdown-trigger")) {
      e.stopPropagation();
      return;
    }
    onCardClick();
  };

  // Prevent event propagation for dropdown menu items
  const handleMenuItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleChangeAttendant = () => {
    onChangeAttendant(id, selectedAttendantId, selectedColumnId);
    setIsChangeAttendantDialogOpen(false);
  };

  const handleChangeColumn = () => {
    onChangeColumn(id, targetColumnId);
    setIsChangeColumnDialogOpen(false);
  };

  return (
    <>
      <Card
        className={`w-full max-w-[300px] p-4 cursor-pointer hover:shadow-md transition-all bg-white ${isDragging ? "opacity-50" : "opacity-100"} relative`}
        onClick={handleCardClick}
        draggable
      >
        {unreadCount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </div>
        )}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={contactAvatar} alt={contactName} />
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">{contactName}</h3>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>{timestamp}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dropdown-trigger">
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(!user?.permissions ||
                  user.permissions.find((p) => p.id === "perm-3")?.enabled) && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      handleMenuItemClick(e);
                      setIsChangeAttendantDialogOpen(true);
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Trocar de atendente
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={(e) => {
                    handleMenuItemClick(e);
                    setIsChangeColumnDialogOpen(true);
                  }}
                >
                  <MoveHorizontal className="h-4 w-4 mr-2" />
                  Trocar de coluna
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    handleMenuItemClick(e);
                    onCardClick();
                  }}
                >
                  Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMenuItemClick}>
                  Adicionar tags
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMenuItemClick}>
                  Arquivar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-3">{truncatedMessage}</p>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={getBadgeVariant(tag.color)}
                className="text-xs px-2 py-0.5"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Change Attendant Dialog */}
      <Dialog
        open={isChangeAttendantDialogOpen}
        onOpenChange={setIsChangeAttendantDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Trocar de Atendente</DialogTitle>
            <DialogDescription>
              Selecione o atendente e a coluna para transferir esta conversa.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="attendant" className="text-sm font-medium">
                Atendente
              </label>
              <Select
                value={selectedAttendantId}
                onValueChange={setSelectedAttendantId}
              >
                <SelectTrigger id="attendant">
                  <SelectValue placeholder="Selecione um atendente" />
                </SelectTrigger>
                <SelectContent>
                  {availableAttendants
                    .filter((attendant) => attendant.id !== currentAttendantId)
                    .map((attendant) => (
                      <SelectItem key={attendant.id} value={attendant.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={attendant.avatar}
                              alt={attendant.name}
                            />
                          </Avatar>
                          <span>{attendant.name}</span>
                          {!attendant.active && (
                            <span className="text-xs text-gray-500">
                              (Offline)
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="column" className="text-sm font-medium">
                Coluna de Destino
              </label>
              <Select
                value={selectedColumnId}
                onValueChange={setSelectedColumnId}
              >
                <SelectTrigger id="column">
                  <SelectValue placeholder="Selecione uma coluna" />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsChangeAttendantDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleChangeAttendant}
              disabled={!selectedAttendantId}
            >
              Transferir Conversa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Column Dialog */}
      <Dialog
        open={isChangeColumnDialogOpen}
        onOpenChange={setIsChangeColumnDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Trocar de Coluna</DialogTitle>
            <DialogDescription>
              Selecione a coluna para mover esta conversa.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="targetColumn" className="text-sm font-medium">
                Coluna de Destino
              </label>
              <Select value={targetColumnId} onValueChange={setTargetColumnId}>
                <SelectTrigger id="targetColumn">
                  <SelectValue placeholder="Selecione uma coluna" />
                </SelectTrigger>
                <SelectContent>
                  {availableColumns
                    .filter((column) => column.id !== currentColumnId)
                    .map((column) => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsChangeColumnDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleChangeColumn}
              disabled={!targetColumnId || targetColumnId === currentColumnId}
            >
              Mover Conversa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConversationCard;
