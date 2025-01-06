import { Calendar } from "./Calendar";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealLogDialog } from "./MealLogDialog";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { MealService } from "@/services/meals";
import { calculateDailyNutrition } from "@/utils/nutritionCalculations";
import { NutritionSummary } from "./NutritionSummary";
import { MealCard } from "./MealCard";

export const ChildDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMealLog, setShowMealLog] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [showMealTypeMenu, setShowMealTypeMenu] = useState(false);

  const { data: childData, isLoading: childLoading, error: childError } = useQuery({
    queryKey: ["child", id],
    queryFn: async () => {
      if (!id) {
        navigate('/');
        throw new Error("No child ID provided");
      }
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        throw new Error("Child not found");
      }
      return data;
    },
    retry: false,
  });

  const { data: mealsData, isLoading: mealsLoading } = useQuery({
    queryKey: ['meals', id, selectedDate],
    queryFn: () => MealService.getMealsByChildAndDate(id!, selectedDate),
    enabled: !!id,
  });

  useEffect(() => {
    if (childError) {
      console.error("Error fetching child:", childError);
      toast({
        title: "Error",
        description: "Child not found. Redirecting to dashboard...",
        variant: "destructive",
      });
      setTimeout(() => navigate('/'), 2000);
    }
  }, [childError, navigate, toast]);

  const handleMealLog = (type?: string) => {
    setSelectedMealType(type || null);
    setShowMealLog(true);
    setShowMealTypeMenu(false);
  };

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Breakfast snack", "Afternoon snack", "Midnight snack"];

  const handleAddMealColumn = () => {
    setShowMealTypeMenu(true);
  };

  const dailyNutrition = calculateDailyNutrition(mealsData || []);

  if (childLoading) {
    return <div className="min-h-screen bg-muted flex items-center justify-center">Loading...</div>;
  }

  if (childError || !childData) {
    return <div className="min-h-screen bg-muted flex items-center justify-center">Child not found</div>;
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">{childData.name}'s Dashboard</h1>
        </div>
        <Calendar onDateSelect={setSelectedDate} selectedDate={selectedDate} />
      </div>

      <main className="container px-4 py-6 space-y-6">
        <NutritionSummary nutrition={dailyNutrition} showTotal />

        {mealTypes.map((mealType) => (
          <MealCard
            key={mealType}
            mealType={mealType}
            meals={mealsData || []}
            onMealLog={handleMealLog}
          />
        ))}
      </main>

      <Button
        className="fixed bottom-6 right-6 rounded-full h-12 w-12 p-0 shadow-lg bg-secondary hover:bg-secondary/90"
        onClick={handleAddMealColumn}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {showMealTypeMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-80 space-y-2">
            {mealTypes.map((type) => (
              <Button
                key={type}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => handleMealLog(type.toLowerCase())}
              >
                {type}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-destructive"
              onClick={() => setShowMealTypeMenu(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {showMealLog && (
        <MealLogDialog
          open={showMealLog}
          onOpenChange={setShowMealLog}
          mealType={selectedMealType}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};