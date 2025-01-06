import { Settings, Camera } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChildProfileHeaderProps {
  name: string;
  age: number;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onMealLog: (e: React.MouseEvent) => void;
}

export const ChildProfileHeader = ({
  name,
  age,
  onEdit,
  onDelete,
  onMealLog,
}: ChildProfileHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-[#4ADE80] flex items-center justify-center">
          <span className="text-xl font-bold text-white">
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm text-muted-foreground">{age} years old</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          className="p-2 hover:bg-muted rounded-full"
          onClick={onMealLog}
        >
          <Camera className="w-5 h-5 text-muted-foreground" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="p-2 hover:bg-muted rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              Remove Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};