import { Calendar } from "./Calendar";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChildDashboardProps {
  child: {
    name: string;
    age: number;
    gender: string;
    height: string;
    weight: string;
  };
}

export const ChildDashboard = ({ child }: ChildDashboardProps) => {
  return (
    <div className="min-h-screen bg-muted">
      <Calendar />
      
      <div className="p-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-white">
              {child.name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{child.name}</h2>
            <p className="text-sm text-muted-foreground">
              {child.age} years • {child.height}cm • {child.weight}kg
            </p>
          </div>
        </div>
      </div>

      <main className="container px-4 py-6 space-y-6">
        {/* Nutrition Goals */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold mb-4">Today's Nutrition Goals</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Calories</span>
              <span>0 / 2000 kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Protein</span>
              <span>0 / 50 g</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Carbs</span>
              <span>0 / 250 g</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Fat</span>
              <span>0 / 70 g</span>
            </div>
          </div>
        </div>

        {/* Meal Sections */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4">Breakfast</h3>
            <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">No meals logged yet</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4">Lunch</h3>
            <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">No meals logged yet</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4">Dinner</h3>
            <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">No meals logged yet</span>
            </div>
          </div>
        </div>
      </main>

      <Button
        className="fixed bottom-6 right-6 rounded-full h-12 w-12 p-0 shadow-lg"
        onClick={() => {
          // TODO: Implement meal type selection
        }}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};