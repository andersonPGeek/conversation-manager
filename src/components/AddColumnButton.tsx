import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface AddColumnButtonProps {
  onAddColumn?: (columnName: string) => void;
}

const AddColumnButton = ({ onAddColumn = () => {} }: AddColumnButtonProps) => {
  const [open, setOpen] = useState(false);
  const [columnName, setColumnName] = useState("");

  const handleAddColumn = () => {
    if (columnName.trim()) {
      onAddColumn(columnName);
      setColumnName("");
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-w-[80px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Plus className="h-8 w-8 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">
              Adicionar Coluna
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">Adicionar Nova Coluna</h3>
              <p className="text-sm text-gray-500">
                Crie uma nova coluna para organizar suas conversas.
              </p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome da Coluna
              </label>
              <input
                id="name"
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Digite o nome da coluna"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddColumn}>Criar Coluna</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddColumnButton;
