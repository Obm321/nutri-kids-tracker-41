import { useQuery } from "@tanstack/react-query";
import { MealService } from "@/services/meals";
import { calculateDailyNutrition } from "@/utils/nutritionCalculations";

interface ChildProfileAchievementsProps {
  childId: string;
}

export const ChildProfileAchievements = ({ childId }: ChildProfileAchievementsProps) => {
  const { data: mealsData } = useQuery({
    queryKey: ['meals', childId, new Date()],
    queryFn: () => MealService.getMealsByChildAndDate(childId, new Date()),
    enabled: !!childId,
  });

  const nutrition = calculateDailyNutrition(mealsData || []);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#FCD34D] rounded-lg p-2 text-center">
          <span className="text-sm font-medium">C</span>
          <span className="block text-lg font-bold">{Math.round(nutrition.carbs)}g</span>
        </div>
        <div className="bg-[#4ADE80] rounded-lg p-2 text-center">
          <span className="text-sm font-medium">P</span>
          <span className="block text-lg font-bold">{Math.round(nutrition.protein)}g</span>
        </div>
        <div className="bg-[#60A5FA] rounded-lg p-2 text-center">
          <span className="text-sm font-medium">F</span>
          <span className="block text-lg font-bold">{Math.round(nutrition.fat)}g</span>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        {Math.round(nutrition.calories)} kcal today
      </div>
    </>
  );
};