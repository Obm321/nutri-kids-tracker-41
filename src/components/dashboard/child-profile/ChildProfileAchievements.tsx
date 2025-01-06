import { useQuery } from "@tanstack/react-query";
import { MealService } from "@/services/meals";
import { calculateDailyNutrition } from "@/utils/nutritionCalculations";

interface ChildProfileAchievementsProps {
  childId: string;
  selectedDate?: Date;
}

export const ChildProfileAchievements = ({ childId, selectedDate }: ChildProfileAchievementsProps) => {
  const queryDate = selectedDate || new Date();
  queryDate.setHours(0, 0, 0, 0);

  const { data: mealsData } = useQuery({
    queryKey: ['meals', childId, queryDate.toISOString()],
    queryFn: () => MealService.getMealsByChildAndDate(childId, queryDate),
    enabled: !!childId,
  });

  const nutrition = calculateDailyNutrition(mealsData || []);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg mb-2">total intake {nutrition.calories}/2851kcal</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span>Carbohydrate</span>
            <span>{Math.round(nutrition.carbs)}/463g</span>
          </div>
          <div className="h-2 bg-gray-200 rounded">
            <div 
              className="h-full bg-[#FCD34D] rounded" 
              style={{ width: `${Math.min((nutrition.carbs / 463) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span>Protein</span>
            <span>{Math.round(nutrition.protein)}/143g</span>
          </div>
          <div className="h-2 bg-gray-200 rounded">
            <div 
              className="h-full bg-[#4ADE80] rounded" 
              style={{ width: `${Math.min((nutrition.protein / 143) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span>Fat</span>
            <span>{Math.round(nutrition.fat)}/86g</span>
          </div>
          <div className="h-2 bg-gray-200 rounded">
            <div 
              className="h-full bg-[#60A5FA] rounded" 
              style={{ width: `${Math.min((nutrition.fat / 86) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};