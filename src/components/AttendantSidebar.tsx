import React from "react";
import { User, Settings, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";

interface Attendant {
  id: string;
  name: string;
  avatar: string;
  active: boolean;
}

interface AttendantSidebarProps {
  attendants: Attendant[];
  activeAttendant: string;
  onSelectAttendant: (id: string) => void;
  onAddAttendant: () => void;
  onOpenSettings: () => void;
}

const AttendantSidebar: React.FC<AttendantSidebarProps> = ({
  attendants = [
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
  activeAttendant = "att-1",
  onSelectAttendant = () => {},
  onAddAttendant = () => {},
  onOpenSettings = () => {},
}) => {
  return (
    <div className="w-20 bg-indigo-800 h-full flex flex-col items-center py-4">
      <div className="mb-8">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.9451 10.9451C20.9451 16.5232 16.5232 20.9451 10.9451 20.9451C5.36692 20.9451 0.945068 16.5232 0.945068 10.9451C0.945068 5.36692 5.36692 0.945068 10.9451 0.945068C16.5232 0.945068 20.9451 5.36692 20.9451 10.9451Z"
              fill="#673AB7"
            />
            <path
              d="M10.9451 15.6372C13.0252 15.6372 14.7092 13.9532 14.7092 11.8731C14.7092 9.79297 13.0252 8.10901 10.9451 8.10901C8.86497 8.10901 7.18102 9.79297 7.18102 11.8731C7.18102 13.9532 8.86497 15.6372 10.9451 15.6372Z"
              fill="white"
            />
            <path
              d="M10.9451 17.1812C7.93696 17.1812 5.49902 14.7433 5.49902 11.7351C5.49902 8.72696 7.93696 6.28906 10.9451 6.28906C13.9532 6.28906 16.3911 8.72696 16.3911 11.7351C16.3911 14.7433 13.9532 17.1812 10.9451 17.1812ZM10.9451 7.83302C8.78699 7.83302 7.04298 9.57703 7.04298 11.7351C7.04298 13.8932 8.78699 15.6372 10.9451 15.6372C13.1032 15.6372 14.8472 13.8932 14.8472 11.7351C14.8472 9.57703 13.1032 7.83302 10.9451 7.83302Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col items-center space-y-4 overflow-y-auto">
        {attendants.map((attendant) => (
          <button
            key={attendant.id}
            className={`w-12 h-12 rounded-full flex items-center justify-center relative ${activeAttendant === attendant.id ? "ring-2 ring-white" : ""}`}
            onClick={() => onSelectAttendant(attendant.id)}
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={attendant.avatar} alt={attendant.name} />
            </Avatar>
            {attendant.active && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-indigo-800"></span>
            )}
          </button>
        ))}

        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-indigo-700 hover:bg-indigo-600 text-white"
          onClick={onAddAttendant}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <div className="mt-auto">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full text-indigo-200 hover:bg-indigo-700 hover:text-white"
          onClick={onOpenSettings}
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default AttendantSidebar;
