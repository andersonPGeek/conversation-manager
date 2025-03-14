import React, { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import ConversationCard from "./ConversationCard";
import { useAuth } from "./auth/AuthProvider";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Conversation {
  id: string;
  contactName: string;
  contactAvatar?: string;
  lastMessage: string;
  timestamp: string;
  tags: Tag[];
  unreadCount?: number;
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

interface KanbanColumnProps {
  id: string;
  title: string;
  conversations: Conversation[];
  onEditColumn?: (id: string) => void;
  onDeleteColumn?: (id: string) => void;
  onAddConversation?: (columnId: string, conversationId?: string) => void;
  onDrop?: (conversationId: string, columnId: string) => void;
  onChangeAttendant?: (
    conversationId: string,
    attendantId: string,
    columnId: string,
  ) => void;
  onChangeColumn?: (conversationId: string, columnId: string) => void;
  availableAttendants?: Attendant[];
  availableColumns?: Column[];
  currentAttendantId?: string;
}

const KanbanColumn = ({
  id = "column-1",
  title = "New Column",
  conversations = [
    {
      id: "conv-1",
      contactName: "John Doe",
      contactAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      lastMessage: "Hello, how are you doing today?",
      timestamp: "10:30 AM",
      tags: [{ id: "tag-1", name: "Urgent", color: "#EF4444" }],
    },
    {
      id: "conv-2",
      contactName: "Jane Smith",
      contactAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      lastMessage: "Can we schedule a meeting tomorrow?",
      timestamp: "Yesterday",
      tags: [{ id: "tag-2", name: "Follow-up", color: "#3B82F6" }],
    },
  ],
  onEditColumn = () => {},
  onDeleteColumn = () => {},
  onAddConversation = () => {},
  onDrop = () => {},
  onChangeAttendant = () => {},
  onChangeColumn = () => {},
  availableAttendants = [],
  availableColumns = [],
  currentAttendantId = "att-1",
}: KanbanColumnProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { user } = useAuth();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const conversationId = e.dataTransfer.getData("conversationId");
    if (conversationId) {
      onDrop(conversationId, id);
    }
  };

  return (
    <div
      className={`flex flex-col w-80 h-full bg-gray-100 rounded-md shadow-sm ${isDraggingOver ? "bg-gray-200" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-3 border-b bg-white rounded-t-md">
        <h3 className="font-medium text-gray-800 truncate">{title}</h3>
        <div className="flex items-center space-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(!user?.permissions ||
                user.permissions.find((p) => p.id === "perm-1")?.enabled) && (
                <DropdownMenuItem onClick={() => onEditColumn(id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Coluna
                </DropdownMenuItem>
              )}
              {(!user?.permissions ||
                user.permissions.find((p) => p.id === "perm-2")?.enabled) && (
                <DropdownMenuItem onClick={() => onDeleteColumn(id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Coluna
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Conversation Cards Container */}
      <div className="flex-1 p-2 space-y-3 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-md border-gray-300 text-gray-500 text-sm">
            Nenhuma conversa ainda
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("conversationId", conversation.id);
              }}
            >
              <ConversationCard
                id={conversation.id}
                contactName={conversation.contactName}
                contactAvatar={
                  conversation.contactAvatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.contactName}`
                }
                lastMessage={conversation.lastMessage}
                timestamp={conversation.timestamp}
                tags={conversation.tags}
                unreadCount={conversation.unreadCount}
                onCardClick={() => onAddConversation(id, conversation.id)}
                onChangeAttendant={onChangeAttendant}
                onChangeColumn={onChangeColumn}
                availableAttendants={availableAttendants}
                availableColumns={availableColumns}
                currentAttendantId={currentAttendantId}
                currentColumnId={id}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
