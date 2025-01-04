import { Button } from "@/components/ui/button";
import { PlusCircle, Camera } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between p-6 bg-white border-b animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Track your child's nutrition</p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Log Meal
        </Button>
        <Button className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Child
        </Button>
      </div>
    </div>
  );
};