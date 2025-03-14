import React, { useState } from "react";
import { sanitizeInput } from "../../utils/security";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ColumnDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isEditing?: boolean;
  initialColumnName?: string;
  initialTitle?: string;
  columnId?: string;
  onSave?: (columnName: string, columnId?: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const ColumnDialog: React.FC<ColumnDialogProps> = ({
  open = true,
  onOpenChange = () => {},
  isEditing = false,
  initialColumnName = "",
  columnId = "",
  onSave = () => {},
}) => {
  const [columnName, setColumnName] = useState(initialColumnName || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (columnName.trim()) {
      setIsSubmitting(true);
      // Sanitize input before saving
      const sanitizedColumnName = sanitizeInput(columnName);
      // Simulate API call
      setTimeout(() => {
        onSave(sanitizedColumnName, isEditing ? columnId : undefined);
        setIsSubmitting(false);
        onOpenChange(false);
      }, 500);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when dialog closes
      setColumnName(initialColumnName || "");
      if (onClose) {
        onClose();
      }
    }
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Coluna" : "Criar Nova Coluna"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Atualize o nome da coluna abaixo."
                : "Adicione uma nova coluna para organizar suas conversas."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="columnName" className="text-right">
                Nome
              </Label>
              <Input
                id="columnName"
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                placeholder="Digite o nome da coluna"
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!columnName.trim() || isSubmitting}>
              {isSubmitting
                ? "Salvando..."
                : isEditing
                  ? "Salvar Alterações"
                  : "Criar Coluna"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnDialog;
