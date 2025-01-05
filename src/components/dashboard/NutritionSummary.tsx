import { NutritionTotals } from "@/utils/nutritionCalculations";

interface NutritionSummaryProps {
  nutrition: NutritionTotals;
  showTotal?: boolean;
}

export const NutritionSummary = ({ nutrition, showTotal = false }: NutritionSummaryProps) => {
  if (showTotal) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg mb-2">total intake {nutrition.calories} / 2851kcal</h3>
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
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-[#FCD34D]">C {Math.round(nutrition.carbs)}g</span>
      <span className="text-[#4ADE80]">P {Math.round(nutrition.protein)}g</span>
      <span className="text-[#60A5FA]">F {Math.round(nutrition.fat)}g</span>
    </div>
  );
};