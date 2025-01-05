import { Button } from "@/components/ui/button";
import { MealLogDialog } from "./MealLogDialog";
import { useState } from "react";

export const DashboardHeader = () => {
  const [showMealLog, setShowMealLog] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

  const handleMealLog = () => {
    setSelectedMealType("meal");
    setShowMealLog(true);
  };

  return (
    <div className="flex items-center justify-between p-4 sm:p-6 bg-white border-b animate-fadeIn">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Track your child's nutrition</p>
      </div>
      <Button variant="outline" className="flex-1 sm:flex-initial items-center gap-2" onClick={handleMealLog}>
        Log Meal
      </Button>
      <MealLogDialog 
        open={showMealLog}
        onOpenChange={setShowMealLog}
        mealType={selectedMealType}
      />
    </div>
  );
};