import { Calendar } from "./Calendar";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealLogDialog } from "./MealLogDialog";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const ChildDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMealLog, setShowMealLog] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [showMealTypeMenu, setShowMealTypeMenu] = useState(false);

  const { data: childData, isLoading, error } = useQuery({
    queryKey: ["child", id],
    queryFn: async () => {
      if (!id) {
        navigate('/');
        throw new Error("No child ID provided");
      }
      console.log("Fetching child data for ID:", id);
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("id", id)
        .maybeSingle(); // Using maybeSingle() instead of single()

      if (error) throw error;
      if (!data) {
        throw new Error("Child not found");
      }
      console.log("Child data:", data);
      return data;
    },
    retry: false, // Don't retry if child not found
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching child:", error);
      toast({
        title: "Error",
        description: "Child not found. Redirecting to dashboard...",
        variant: "destructive",
      });
      // Redirect after a short delay so user can see the message
      setTimeout(() => navigate('/'), 2000);
    }
  }, [error, navigate, toast]);

  const handleMealLog = (type?: string) => {
    setSelectedMealType(type || null);
    setShowMealLog(true);
    setShowMealTypeMenu(false);
  };

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Breakfast snack", "Afternoon snack", "Midnight snack"];

  const handleAddMealColumn = () => {
    setShowMealTypeMenu(true);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-muted flex items-center justify-center">Loading...</div>;
  }

  if (error || !childData) {
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
        />
      )}
    </div>
  );
};
