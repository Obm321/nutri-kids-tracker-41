import { Card } from "@/components/ui/card";
import { Settings, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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
import { createClient } from '@supabase/supabase-js';
import { AddChildDialog } from "./AddChildDialog";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ChildProfileProps {
  name: string;
  age: number;
  achievements: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  id?: string;
  gender?: string;
  height?: string;
  weight?: string;
}

export const ChildProfile = ({ 
  name, 
  age, 
  achievements,
  gender,
  height,
  weight,
  onClick,
  onEdit,
  onDelete,
  id 
}: ChildProfileProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [childData, setChildData] = useState<any>(null);

  const handleEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      try {
        const { data, error } = await supabase
          .from('children')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setChildData(data);
        setShowEditDialog(true);
      } catch (error) {
        console.error('Error fetching child data:', error);
        toast({
          title: "Error",
          description: "Could not fetch child data. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (id) {
      try {
        const { error } = await supabase
          .from('children')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        onDelete?.();
        setShowDeleteDialog(false);
        toast({
          title: "Success",
          description: "Child profile deleted successfully.",
        });
      } catch (error) {
        console.error('Error deleting child:', error);
        toast({
          title: "Error",
          description: "Could not delete child profile. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateChild = async (updatedData: any) => {
    if (id) {
      try {
        const { error } = await supabase
          .from('children')
          .update(updatedData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Child profile updated successfully.",
        });
        setShowEditDialog(false);
        window.location.reload(); // Refresh to show updated data
      } catch (error) {
        console.error('Error updating child:', error);
        toast({
          title: "Error",
          description: "Could not update child profile. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCardClick = () => {
    if (id) {
      navigate(`/child/${id}`);
    }
  };

  return (
    <>
      <Card 
        className="p-4 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleCardClick}
      >
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
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
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

        <div className="text-center text-sm text-muted-foreground">
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

      {showEditDialog && childData && (
        <AddChildDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onAddChild={handleUpdateChild}
          initialData={childData}
          isEditing={true}
        />
      )}
    </>
  );
};