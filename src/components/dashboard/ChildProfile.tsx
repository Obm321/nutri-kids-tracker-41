import { Card } from "@/components/ui/card";
import { Settings, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ChildProfileProps {
  name: string;
  age: number;
  achievements: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ChildProfile = ({ 
  name, 
  age, 
  achievements, 
  onClick,
  onEdit,
  onDelete 
}: ChildProfileProps) => {
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete?.();
    setShowDeleteDialog(false);
    toast({
      title: "Success",
      description: "Child profile deleted successfully.",
    });
  };

  return (
    <>
      <Card 
        className="p-4 sm:p-6 animate-fadeIn cursor-pointer relative"
        onClick={onClick}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="absolute top-2 right-2 p-2 hover:bg-muted rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex items-center gap-3 sm:gap-4 mb-4">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-bold text-white">
              {name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">{name}</h2>
            <p className="text-sm sm:text-base text-muted-foreground">{age} years old</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#FCD34D] rounded-lg p-2 text-center">
            <span className="text-lg font-bold">A</span>
          </div>
          <div className="bg-[#4ADE80] rounded-lg p-2 text-center">
            <span className="text-lg font-bold">B</span>
          </div>
          <div className="bg-[#60A5FA] rounded-lg p-2 text-center">
            <span className="text-lg font-bold">C</span>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {achievements} achievements
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the child's profile
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};