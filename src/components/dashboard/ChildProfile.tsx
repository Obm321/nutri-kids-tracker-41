import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { AddChildDialog } from "./AddChildDialog";
import { ChildProfileHeader } from "./child-profile/ChildProfileHeader";
import { NutritionSummary } from "./NutritionSummary";
import { MealLogDialog } from "./MealLogDialog";
import { useQuery } from "@tanstack/react-query";
import { MealService } from "@/services/meals";

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
  const [showMealLog, setShowMealLog] = useState(false);
  const [childData, setChildData] = useState<any>(null);
  const today = new Date();

  const { data: mealsData } = useQuery({
    queryKey: ['meals', id, today],
    queryFn: () => id ? MealService.getMealsByChildAndDate(id, today) : Promise.resolve([]),
    enabled: !!id,
  });

  const handleCardClick = () => {
    if (id) {
      console.log("Navigating to child:", id);
      navigate(`/child/${id}`);
    }
  };

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      try {
        const { error } = await supabase
          .from('children')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Child profile deleted successfully.",
        });

        if (onDelete) onDelete();
        window.location.reload();
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

  const handleMealLog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMealLog(true);
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
        window.location.reload();
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

  return (
    <>
      <Card 
        className="p-4 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleCardClick}
      >
        <ChildProfileHeader
          name={name}
          age={age}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMealLog={handleMealLog}
        />
        <div className="mt-4">
          <NutritionSummary nutrition={mealsData ? {
            calories: mealsData.reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0),
            carbs: mealsData.reduce((sum: number, meal: any) => sum + (meal.carbs || 0), 0),
            protein: mealsData.reduce((sum: number, meal: any) => sum + (meal.protein || 0), 0),
            fat: mealsData.reduce((sum: number, meal: any) => sum + (meal.fat || 0), 0),
          } : {
            calories: 0,
            carbs: 0,
            protein: 0,
            fat: 0,
          }} />
        </div>
      </Card>

      <AddChildDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onAddChild={handleUpdateChild}
        initialData={childData}
        isEditing={true}
      />

      <MealLogDialog
        open={showMealLog}
        onOpenChange={setShowMealLog}
        selectedDate={today}
        mealType={null}
      />
    </>
  );
};