import React, { useState } from "react";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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

interface TagManagementDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  tags?: Tag[];
  onCreateTag?: (tag: Omit<Tag, "id">) => void;
  onUpdateTag?: (tag: Tag) => void;
  onDeleteTag?: (id: string) => void;
}

const TagManagementDialog: React.FC<TagManagementDialogProps> = ({
  open = true,
  onOpenChange = () => {},
  tags = [
    { id: "tag1", name: "Urgent", color: "#EF4444" },
    { id: "tag2", name: "Follow-up", color: "#3B82F6" },
    { id: "tag3", name: "Meeting", color: "#10B981" },
    { id: "tag4", name: "Personal", color: "#F59E0B" },
  ],
  onCreateTag = () => {},
  onUpdateTag = () => {},
  onDeleteTag = () => {},
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3B82F6");

  const colorOptions = [
    { value: "#EF4444", label: "Red" },
    { value: "#F59E0B", label: "Orange" },
    { value: "#EAB308", label: "Yellow" },
    { value: "#10B981", label: "Green" },
    { value: "#3B82F6", label: "Blue" },
    { value: "#8B5CF6", label: "Purple" },
    { value: "#EC4899", label: "Pink" },
    { value: "#6B7280", label: "Gray" },
  ];

  const resetForm = () => {
    setIsCreating(false);
    setEditingTag(null);
    setNewTagName("");
    setNewTagColor("#3B82F6");
  };

  // Handle dialog close
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      onCreateTag({
        name: newTagName.trim(),
        color: newTagColor,
      });
      resetForm();
    }
  };

  const handleUpdateTag = () => {
    if (editingTag && newTagName.trim()) {
      onUpdateTag({
        id: editingTag.id,
        name: newTagName.trim(),
        color: newTagColor,
      });
      resetForm();
    }
  };

  const startEditing = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
    setIsCreating(false);
  };

  const handleDeleteTag = (id: string) => {
    onDeleteTag(id);
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingTag(null);
    setNewTagName("");
    setNewTagColor("#3B82F6");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-white">
        <DialogHeader>
          <DialogTitle>Gerenciar Etiquetas</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-4">
          {/* Tag List */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Suas Etiquetas</div>
            <div className="border rounded-md p-1 max-h-[200px] overflow-y-auto">
              {tags.length === 0 ? (
                <div className="text-sm text-gray-500 p-3 text-center">
                  Nenhuma etiqueta criada ainda
                </div>
              ) : (
                <div className="space-y-1">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="text-sm">{tag.name}</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => startEditing(tag)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteTag(tag.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Create/Edit Form */}
          <div className="border rounded-md p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">
                {isCreating
                  ? "Criar Nova Etiqueta"
                  : editingTag
                    ? "Editar Etiqueta"
                    : "Ações de Etiqueta"}
              </h3>
              {(isCreating || editingTag) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={resetForm}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isCreating || editingTag ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="tagName">Nome da Etiqueta</Label>
                  <Input
                    id="tagName"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Digite o nome da etiqueta"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="tagColor">Cor da Etiqueta</Label>
                  <Select value={newTagColor} onValueChange={setNewTagColor}>
                    <SelectTrigger id="tagColor" className="w-full">
                      <SelectValue placeholder="Selecione uma cor" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color.value }}
                            />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={editingTag ? handleUpdateTag : handleCreateTag}
                    disabled={!newTagName.trim()}
                  >
                    {editingTag ? "Atualizar Etiqueta" : "Criar Etiqueta"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={startCreating}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Nova Etiqueta
              </Button>
            )}
          </div>
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

export default TagManagementDialog;
