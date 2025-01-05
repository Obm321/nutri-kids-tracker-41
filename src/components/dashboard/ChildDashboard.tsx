import { Calendar } from "./Calendar";
import { Plus, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MealLogDialog } from "./MealLogDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMealLog, setShowMealLog] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

  const handleMealLog = (type?: string) => {
    setSelectedMealType(type || null);
    setShowMealLog(true);
  };

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

  return (
    <div className="min-h-screen bg-muted">
      <div className="sticky top-0 z-10 bg-background">
        <Calendar onDateSelect={setSelectedDate} selectedDate={selectedDate} />
      </div>

      <main className="container px-4 py-6 space-y-6">
        {/* Nutrition Summary */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg mb-2">total intake 0 / 2851kcal</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Carbohydrate</span>
                <span>0/463g</span>
              </div>
              <div className="h-2 bg-gray-200 rounded">
                <div className="h-full bg-[#FCD34D] rounded" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Protein</span>
                <span>0/143g</span>
              </div>
              <div className="h-2 bg-gray-200 rounded">
                <div className="h-full bg-[#4ADE80] rounded" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Fat</span>
                <span>0/86g</span>
              </div>
              <div className="h-2 bg-gray-200 rounded">
                <div className="h-full bg-[#60A5FA] rounded" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Meal Sections */}
        {mealTypes.map((mealType) => (
          <div key={mealType} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{mealType}</h3>
                <span className="text-sm text-muted-foreground">0kcal</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#FCD34D]">C 0g</span>
                <span className="text-[#4ADE80]">P 0g</span>
                <span className="text-[#60A5FA]">F 0g</span>
              </div>
            </div>
            <div 
              className="h-32 bg-muted rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
              onClick={() => handleMealLog(mealType.toLowerCase())}
            >
              <span className="text-4xl mb-2">☺</span>
              <span className="text-muted-foreground">Please Record your diet information!</span>
            </div>
          </div>
        ))}
      </main>

      <Button
        className="fixed bottom-6 right-6 rounded-full h-12 w-12 p-0 shadow-lg bg-secondary hover:bg-secondary/90"
        onClick={() => handleMealLog()}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {showMealLog && (
        <MealLogDialog
          open={showMealLog}
          onOpenChange={setShowMealLog}
          mealType={selectedMealType}
        />
      )}
    </div>
  );
};