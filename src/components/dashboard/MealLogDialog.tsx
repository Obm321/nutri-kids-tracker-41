import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { MealService } from "@/services/meals";
import { MealPhotoInput } from "./meal-log/MealPhotoInput";

interface MealLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealType: string | null;
  selectedDate: Date;
}

export const MealLogDialog = ({ 
  open, 
  onOpenChange, 
  mealType,
  selectedDate 
}: MealLogDialogProps) => {
  const [mealName, setMealName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mealDateTime, setMealDateTime] = useState<string>("");
  
  const { toast } = useToast();
  const { id: childId } = useParams();
  const queryClient = useQueryClient();

  // Update mealDateTime whenever selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const localDate = new Date(selectedDate);
      // Set the time to the current time
      const now = new Date();
      localDate.setHours(now.getHours());
      localDate.setMinutes(now.getMinutes());
      setMealDateTime(localDate.toISOString().slice(0, 16));
    }
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mealName || !selectedFile || !childId || !mealType || !mealDateTime) {
      toast({
        title: "Missing Information",
        description: "Please provide all required information.",
        variant: "destructive",
      });
      return;
    }

    try {
      await MealService.createMeal({
        childId,
        name: mealName,
        type: mealType,
        photoFile: selectedFile,
        dateTime: new Date(mealDateTime),
      });

      toast({
        title: "Success",
        description: `${mealName} has been logged.`,
      });

      // Invalidate both the specific date query and the general meals query
      queryClient.invalidateQueries({ queryKey: ['meals', childId] });
      queryClient.invalidateQueries({ queryKey: ['meals', childId, selectedDate] });

      setMealName("");
      setSelectedFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving meal:', error);
      toast({
        title: "Error",
        description: "Failed to save meal information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log {mealType} Meal</DialogTitle>
          <DialogDescription>
            Add details about your meal including a photo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meal-name">Meal Name</Label>
            <Input
              id="meal-name"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="Enter meal name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="meal-datetime">Date and Time</Label>
            <Input
              id="meal-datetime"
              type="datetime-local"
              value={mealDateTime}
              onChange={(e) => setMealDateTime(e.target.value)}
            />
          </div>

          <MealPhotoInput onPhotoSelect={setSelectedFile} />
          
          <Button type="submit" className="w-full">
            Save Meal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};