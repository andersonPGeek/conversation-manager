import React, { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Conversation {
  id: string;
  contactName: string;
  lastMessage: string;
  timestamp: string;
  tags: Array<{ id: string; name: string; color: string }>;
  unreadCount?: number;
}

interface KanbanColumnProps {
  id: string;
  title: string;
  conversations: Conversation[];
  onEditColumn?: (id: string) => void;
  onDeleteColumn?: (id: string) => void;
  onAddConversation?: (columnId: string, conversationId?: string) => void;
  onDrop?: (conversationId: string, columnId: string) => void;
}

const KanbanColumn = ({
  id = "column-1",
  title = "New Column",
  conversations = [
    {
      id: "conv-1",
      contactName: "John Doe",
      lastMessage: "Hello, how are you doing today?",
      timestamp: "10:30 AM",
      tags: [{ id: "tag-1", name: "Urgent", color: "#EF4444" }],
    },
    {
      id: "conv-2",
      contactName: "Jane Smith",
      lastMessage: "Can we schedule a meeting tomorrow?",
      timestamp: "Yesterday",
      tags: [{ id: "tag-2", name: "Follow-up", color: "#3B82F6" }],
    },
  ],
  onEditColumn = () => {},
  onDeleteColumn = () => {},
  onAddConversation = () => {},
  onDrop = () => {},
}: KanbanColumnProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddConversation(id)}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditColumn(id)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Coluna
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteColumn(id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Coluna
              </DropdownMenuItem>
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
              className="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-pointer relative"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("conversationId", conversation.id);
              }}
              onClick={() => {
                // Abre o diálogo de conversa com o ID da conversa
                onAddConversation(id, conversation.id);
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">
                  {conversation.contactName}
                </h4>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">
                    {conversation.timestamp}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <div className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {conversation.lastMessage}
              </p>
              <div className="flex flex-wrap gap-1">
                {conversation.tags.map((tag) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
