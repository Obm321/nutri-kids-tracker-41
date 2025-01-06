import { calculateMealTypeNutrition } from "@/utils/nutritionCalculations";
import { NutritionSummary } from "./NutritionSummary";

interface MealCardProps {
  mealType: string;
  meals: any[];
  onMealLog: (type: string) => void;
}

export const MealCard = ({ mealType, meals, onMealLog }: MealCardProps) => {
  const meal = meals.find(m => m.type.toLowerCase() === mealType.toLowerCase());
  const nutrition = calculateMealTypeNutrition(meals, mealType);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{mealType}</h3>
          <span className="text-sm text-muted-foreground">{nutrition.calories}kcal</span>
        </div>
        <NutritionSummary nutrition={nutrition} />
      </div>
      <div 
        className="h-32 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors overflow-hidden"
        onClick={() => onMealLog(mealType.toLowerCase())}
      >
        {meal?.photo_url ? (
          <div className="w-full h-full relative">
            <img 
              src={meal.photo_url} 
              alt={meal.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="text-white font-medium">{meal.name}</span>
            </div>
          </div>
        ) : (
          <div className="bg-muted w-full h-full flex flex-col items-center justify-center">
            <span className="text-4xl mb-2">☺</span>
            <span className="text-muted-foreground">Please Record your diet information!</span>
          </div>
        )}
      </div>
    </div>
  );
};