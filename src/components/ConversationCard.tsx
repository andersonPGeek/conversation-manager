import React from "react";
import { Card } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Clock, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface ConversationCardProps {
  id?: string;
  contactName?: string;
  contactAvatar?: string;
  lastMessage?: string;
  timestamp?: string;
  tags?: Tag[];
  onCardClick?: () => void;
  isDragging?: boolean;
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
  onCardClick = () => {},
  isDragging = false,
}) => {
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

  return (
    <Card
      className={`w-full max-w-[300px] p-4 cursor-pointer hover:shadow-md transition-all bg-white ${isDragging ? "opacity-50" : "opacity-100"}`}
      onClick={onCardClick}
      draggable
    >
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
          {/* Aqui poderia ser adicionado o contador de mensagens não lidas */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Add Tags</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
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
  );
};

export default ConversationCard;
