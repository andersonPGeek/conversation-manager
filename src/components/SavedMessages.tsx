import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export interface SavedMessage {
  id: string;
  key: string;
  message: string;
}

interface SavedMessagesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (messages: SavedMessage[]) => void;
  savedMessages: SavedMessage[];
}

const SavedMessages: React.FC<SavedMessagesProps> = ({
  open,
  onOpenChange,
  onSave,
  savedMessages = [],
}) => {
  const [messages, setMessages] = useState<SavedMessage[]>(savedMessages);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<SavedMessage>({
    id: "",
    key: "",
    message: "",
  });
  const [errors, setErrors] = useState({ key: "", message: "" });

  useEffect(() => {
    setMessages(savedMessages);
  }, [savedMessages]);

  const handleAddMessage = () => {
    setIsEditing(false);
    setCurrentMessage({ id: `msg-${Date.now()}`, key: "", message: "" });
    setErrors({ key: "", message: "" });
  };

  const handleEditMessage = (message: SavedMessage) => {
    setIsEditing(true);
    setCurrentMessage({ ...message });
    setErrors({ key: "", message: "" });
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta mensagem rápida?")) {
      const updatedMessages = messages.filter((msg) => msg.id !== id);
      setMessages(updatedMessages);
      onSave(updatedMessages);
    }
  };

  const validateForm = () => {
    const newErrors = { key: "", message: "" };
    let isValid = true;

    if (!currentMessage.key.trim()) {
      newErrors.key = "A chave é obrigatória";
      isValid = false;
    } else if (!/^[a-zA-Z0-9]+$/.test(currentMessage.key)) {
      newErrors.key = "A chave deve conter apenas letras e números";
      isValid = false;
    } else if (
      !isEditing &&
      messages.some((msg) => msg.key === currentMessage.key)
    ) {
      newErrors.key = "Esta chave já está em uso";
      isValid = false;
    }

    if (!currentMessage.message.trim()) {
      newErrors.message = "A mensagem é obrigatória";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveMessage = () => {
    if (!validateForm()) return;

    let updatedMessages: SavedMessage[];

    if (isEditing) {
      updatedMessages = messages.map((msg) =>
        msg.id === currentMessage.id ? currentMessage : msg,
      );
    } else {
      updatedMessages = [...messages, currentMessage];
    }

    setMessages(updatedMessages);
    setCurrentMessage({ id: "", key: "", message: "" });
    onSave(updatedMessages);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Mensagens Rápidas</DialogTitle>
          <DialogDescription>
            Configure mensagens rápidas para agilizar o atendimento. Use
            "/chave" para acessá-las durante a conversa.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4 max-h-[400px] overflow-y-auto">
          {currentMessage.id ? (
            <div className="space-y-4 border p-4 rounded-md bg-gray-50">
              <h3 className="font-medium">
                {isEditing ? "Editar Mensagem Rápida" : "Nova Mensagem Rápida"}
              </h3>
              <div className="space-y-2">
                <Label htmlFor="key">Chave</Label>
                <Input
                  id="key"
                  value={currentMessage.key}
                  onChange={(e) =>
                    setCurrentMessage({
                      ...currentMessage,
                      key: e.target.value,
                    })
                  }
                  placeholder="Ex: saudacao"
                />
                {errors.key && (
                  <p className="text-sm text-red-500">{errors.key}</p>
                )}
                <p className="text-xs text-gray-500">
                  Digite "/" seguido desta chave para acessar a mensagem
                  rapidamente.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  value={currentMessage.message}
                  onChange={(e) =>
                    setCurrentMessage({
                      ...currentMessage,
                      message: e.target.value,
                    })
                  }
                  placeholder="Digite a mensagem que será inserida"
                  rows={4}
                />
                {errors.message && (
                  <p className="text-sm text-red-500">{errors.message}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentMessage({ id: "", key: "", message: "" })
                  }
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveMessage}>
                  {isEditing ? "Atualizar" : "Adicionar"}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleAddMessage}
              className="w-full flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Adicionar Mensagem Rápida
            </Button>
          )}

          {messages.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chave</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell className="font-medium">/{msg.key}</TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {msg.message}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditMessage(msg)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteMessage(msg.id)}
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
          ) : (
            !currentMessage.id && (
              <div className="text-center p-4 text-gray-500">
                Nenhuma mensagem rápida configurada.
              </div>
            )
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavedMessages;
