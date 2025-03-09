import React from "react";
import { Badge } from "./ui/badge";

interface TagBadgeProps {
  id: string;
  name: string;
  color: string;
  onRemove?: (id: string) => void;
  clickable?: boolean;
}

const TagBadge: React.FC<TagBadgeProps> = ({
  id,
  name,
  color,
  onRemove,
  clickable = false,
}) => {
  // Function to get badge variant based on color
  const getBadgeVariant = (color: string) => {
    switch (color) {
      case "red":
      case "#EF4444":
        return "destructive";
      case "blue":
      case "#3B82F6":
        return "default";
      case "green":
      case "#10B981":
        return "secondary";
      case "yellow":
      case "#F59E0B":
      case "orange":
      case "#EAB308":
        return "outline";
      default:
        return "default";
    }
  };

  // Custom style for colors that don't map to variants
  const getCustomStyle = (color: string) => {
    if (color.startsWith("#") || color.startsWith("rgb")) {
      return {
        backgroundColor: `${color}20`,
        color: color,
        borderColor: color,
      };
    }
    return {};
  };

  return (
    <Badge
      variant={getBadgeVariant(color)}
      className={`text-xs px-2 py-0.5 ${clickable ? "cursor-pointer" : ""} ${onRemove ? "pr-1" : ""}`}
      style={getCustomStyle(color)}
    >
      {name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="ml-1 rounded-full hover:bg-gray-200 h-4 w-4 inline-flex items-center justify-center"
        >
          ×
        </button>
      )}
    </Badge>
  );
};

export default TagBadge;
