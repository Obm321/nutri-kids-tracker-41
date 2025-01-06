import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import { NutritionSummary } from "./NutritionSummary";
import { calculateMealTypeNutrition } from "@/utils/nutritionCalculations";
import type { Meal } from "@/lib/supabase";

interface MealCardProps {
  mealType: string;
  meals: Meal[];
  onMealLog: (type: string) => void;
}

export const MealCard = ({ mealType, meals, onMealLog }: MealCardProps) => {
  const mealsOfType = meals.filter(meal => 
    meal.type.toLowerCase() === mealType.toLowerCase()
  );
  const nutrition = calculateMealTypeNutrition(meals, mealType);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{mealType}</h3>
        {mealsOfType.length === 0 ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => onMealLog(mealType.toLowerCase())}
          >
            <Plus className="h-4 w-4 mr-1" />
            Log meal
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => onMealLog(mealType.toLowerCase())}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit meal
          </Button>
        )}
      </div>

      {mealsOfType.map((meal) => (
        <div key={meal.id} className="mb-4">
          <div className="flex items-center gap-4 mb-2">
            {meal.photo_url && (
              <img
                src={meal.photo_url}
                alt={meal.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div>
              <h4 className="font-medium">{meal.name}</h4>
              <NutritionSummary nutrition={nutrition} />
            </div>
          </div>
        </div>
      ))}

      {mealsOfType.length === 0 && (
        <p className="text-sm text-muted-foreground">No meals logged yet</p>
      )}
    </Card>
  );
};