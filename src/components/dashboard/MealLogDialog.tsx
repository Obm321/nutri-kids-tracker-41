import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  selectedDate,
}: MealLogDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Meal {mealType ? `for ${mealType}` : ''}</DialogTitle>
        </DialogHeader>
        <MealPhotoInput 
          mealType={mealType} 
          selectedDate={selectedDate}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};