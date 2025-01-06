import { Settings, Camera } from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    setShowDeleteConfirm(false);
    onDelete(e);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
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
              <button className="p-2 hover:bg-muted rounded-full">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border shadow-lg">
              <DropdownMenuItem onClick={onEdit}>
                Edit Profile
              </DropdownMenuItem>
              <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    onClick={handleDeleteClick}
                    className="text-destructive"
                  >
                    Remove Profile
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete {name}'s profile
                      and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleConfirmDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};