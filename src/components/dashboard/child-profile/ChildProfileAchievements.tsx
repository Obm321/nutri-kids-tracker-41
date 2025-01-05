import { useQuery } from "@tanstack/react-query";
import { MealService } from "@/services/meals";
import { calculateDailyNutrition } from "@/utils/nutritionCalculations";

interface ChildProfileAchievementsProps {
  childId: string;
}

export const ChildProfileAchievements = ({ childId }: ChildProfileAchievementsProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: mealsData } = useQuery({
    queryKey: ['meals', childId, today],
    queryFn: () => MealService.getMealsByChildAndDate(childId, today),
    enabled: !!childId,
  });

  const nutrition = calculateDailyNutrition(mealsData || []);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#FCD34D] rounded-lg p-2 text-center">
          <span className="text-sm font-medium">C</span>
          <span className="block text-lg font-bold">{Math.round(nutrition.carbs)}/463g</span>
        </div>
        <div className="bg-[#4ADE80] rounded-lg p-2 text-center">
          <span className="text-sm font-medium">P</span>
          <span className="block text-lg font-bold">{Math.round(nutrition.protein)}/143g</span>
        </div>
        <div className="bg-[#60A5FA] rounded-lg p-2 text-center">
          <span className="text-sm font-medium">F</span>
          <span className="block text-lg font-bold">{Math.round(nutrition.fat)}/86g</span>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        {Math.round(nutrition.calories)}/2851 kcal today
      </div>
    </>
  );
};