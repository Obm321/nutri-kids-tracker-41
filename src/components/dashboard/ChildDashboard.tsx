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
      <div className="sticky top-0 z-10">
        <Calendar onDateSelect={setSelectedDate} selectedDate={selectedDate} />
      </div>

      <div className="p-4 bg-white border-b">
        <div className="container mx-auto">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
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
      </div>

      <main className="container px-4 py-6 space-y-6">
        {/* Nutrition Goals */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Today's Nutrition Goals</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-5 w-5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Daily nutritional goals based on age and activity level</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
          {mealTypes.map((mealType) => (
            <div key={mealType} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">{mealType}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-5 w-5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Nutritional information for {mealType.toLowerCase()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div 
                className="h-32 bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleMealLog(mealType.toLowerCase())}
              >
                <span className="text-muted-foreground">No meals logged yet</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 rounded-full h-12 w-12 p-0 shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {mealTypes.map((type) => (
            <DropdownMenuItem key={type} onClick={() => handleMealLog(type.toLowerCase())}>
              Add {type}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

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