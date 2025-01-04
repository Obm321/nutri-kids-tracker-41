import { Button } from "@/components/ui/button";
import { MealLogDialog } from "./MealLogDialog";

export const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between p-4 sm:p-6 bg-white border-b animate-fadeIn">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Track your child's nutrition</p>
      </div>
      <MealLogDialog />
    </div>
  );
};