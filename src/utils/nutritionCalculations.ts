export interface NutritionTotals {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export const calculateDailyNutrition = (meals: any[]): NutritionTotals => {
  return meals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    carbs: acc.carbs + (Number(meal.carbs) || 0),
    protein: acc.protein + (Number(meal.protein) || 0),
    fat: acc.fat + (Number(meal.fat) || 0),
  }), {
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
  });
};

export const calculateMealTypeNutrition = (meals: any[], type: string): NutritionTotals => {
  const mealOfType = meals.filter(meal => meal.type.toLowerCase() === type.toLowerCase());
  return calculateDailyNutrition(mealOfType);
};