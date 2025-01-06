import { useQuery } from "@tanstack/react-query";
import { MealService } from "@/services/meals";

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
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache the data
  });

  const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
  const completedMeals = mealsData?.filter(meal => 
    mealTypes.includes(meal.type.toLowerCase())
  ).length || 0;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Daily Achievements</span>
        <span className="text-sm font-medium">{completedMeals}/{mealTypes.length}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 mt-2">
        <div
          className="bg-primary rounded-full h-2 transition-all duration-300"
          style={{
            width: `${(completedMeals / mealTypes.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};