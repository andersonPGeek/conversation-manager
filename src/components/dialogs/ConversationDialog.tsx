import React, { useState } from "react";
import { User, MessageSquare, Tag, Send, Plus } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOutgoing: boolean;
}

interface ConversationDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  conversation?: {
    id: string;
    contactName: string;
    contactAvatar: string;
    messages: Message[];
    tags: Tag[];
    columnId: string;
    unreadCount?: number;
  };
  availableTags?: Tag[];
  availableColumns?: { id: string; title: string }[];
  onSave?: (conversation: any) => void;
  onClose?: () => void;
  initialColumnId?: string;
  isNewConversation?: boolean;
}

const ConversationDialog: React.FC<ConversationDialogProps> = ({
  open = true,
  onOpenChange = () => {},
  isNewConversation = false,
  conversation = {
    id: "conv-1",
    contactName: "John Doe",
    contactAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    messages: [
      {
        id: "msg-1",
        content: "Olá! Como posso ajudar você hoje?",
        timestamp: "10:30",
        isOutgoing: false,
      },
      {
        id: "msg-2",
        content: "Gostaria de agendar uma reunião para a próxima semana.",
        timestamp: "10:32",
        isOutgoing: true,
      },
      {
        id: "msg-3",
        content:
          "Claro, estou disponível na terça-feira à tarde. Funciona para você?",
        timestamp: "10:35",
        isOutgoing: false,
      },
    ],
    tags: [
      { id: "tag-1", name: "Reunião", color: "#3B82F6" },
      { id: "tag-2", name: "Acompanhamento", color: "#10B981" },
    ],
    columnId: "col-1",
    unreadCount: 0,
  },
  availableTags = [
    { id: "tag-1", name: "Meeting", color: "#3B82F6" },
    { id: "tag-2", name: "Follow-up", color: "#10B981" },
    { id: "tag-3", name: "Urgent", color: "#EF4444" },
    { id: "tag-4", name: "Personal", color: "#8B5CF6" },
    { id: "tag-5", name: "Business", color: "#F59E0B" },
  ],
  availableColumns = [
    { id: "col-1", title: "New" },
    { id: "col-2", title: "In Progress" },
    { id: "col-3", title: "Completed" },
  ],
  onSave = () => {},
  onClose = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("messages");
  const [newMessage, setNewMessage] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>(conversation.tags);
  const [selectedColumn, setSelectedColumn] = useState(conversation.columnId);
  const [contactName, setContactName] = useState(conversation.contactName);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would add the message to the conversation
      // and potentially send it via an API
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleSaveConversation = () => {
    const updatedConversation = {
      ...conversation,
      contactName,
      tags: selectedTags,
      columnId: selectedColumn,
    };
    onSave(updatedConversation);
    onClose();
  };

  const handleAddTag = (tagId: string) => {
    const tagToAdd = availableTags.find((tag) => tag.id === tagId);
    if (tagToAdd && !selectedTags.some((tag) => tag.id === tagId)) {
      setSelectedTags([...selectedTags, tagToAdd]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isNewConversation ? "Nova Conversa" : "Detalhes da Conversa"}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="messages">
              <MessageSquare className="mr-2 h-4 w-4" />
              Mensagens
            </TabsTrigger>
            <TabsTrigger value="details">
              <User className="mr-2 h-4 w-4" />
              Detalhes
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="messages"
            className="flex-1 overflow-hidden flex flex-col"
          >
            <div className="flex items-center p-3 border-b">
              <Avatar className="h-10 w-10 mr-3">
                <img
                  src={conversation.contactAvatar}
                  alt={conversation.contactName}
                />
              </Avatar>
              <div>
                <h3 className="font-medium">{conversation.contactName}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-0.5 text-xs rounded-full"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {conversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOutgoing ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isOutgoing
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs mt-1 block opacity-70">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t mt-auto">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="details"
            className="space-y-4 overflow-y-auto p-2"
          >
            <div className="space-y-2">
              <label htmlFor="contact-name" className="text-sm font-medium">
                Nome do Contato
              </label>
              {isNewConversation ? (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      id="contact-name"
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Pesquisar contato..."
                      className="w-full p-2 border rounded-md pl-8"
                    />
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>
                  </div>
                  <div className="border rounded-md max-h-[150px] overflow-y-auto">
                    {[
                      {
                        id: "c1",
                        name: "Ana Silva",
                        avatar:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
                      },
                      {
                        id: "c2",
                        name: "Bruno Costa",
                        avatar:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Bruno",
                      },
                      {
                        id: "c3",
                        name: "Carla Mendes",
                        avatar:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Carla",
                      },
                      {
                        id: "c4",
                        name: "Daniel Oliveira",
                        avatar:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel",
                      },
                      {
                        id: "c5",
                        name: "Eduarda Santos",
                        avatar:
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=Eduarda",
                      },
                    ]
                      .filter((contact) =>
                        contact.name
                          .toLowerCase()
                          .includes(contactName.toLowerCase()),
                      )
                      .map((contact) => (
                        <div
                          key={contact.id}
                          className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setContactName(contact.name)}
                        >
                          <img
                            src={contact.avatar}
                            alt={contact.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span>{contact.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <input
                  id="contact-name"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Coluna</label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a coluna" />
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Etiquetas</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: `${tag.color}20`,
                      color: tag.color,
                    }}
                  >
                    {tag.name}
                    <button
                      onClick={() => handleRemoveTag(tag.id)}
                      className="ml-1 rounded-full hover:bg-gray-200 h-4 w-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <Select onValueChange={handleAddTag}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Plus className="h-3 w-3 mr-1" />
                    <span>Adicionar etiqueta</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {availableTags
                    .filter((tag) => !selectedTags.some((t) => t.id === tag.id))
                    .map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        <div className="flex items-center">
                          <span
                            className="h-3 w-3 rounded-full mr-2"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t pt-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSaveConversation}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationDialog;
