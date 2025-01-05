import { Button } from "@/components/ui/button";
import { MealLogDialog } from "./MealLogDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export const DashboardHeader = () => {
  const [showMealLog, setShowMealLog] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleMealLog = () => {
    setSelectedMealType("meal");
    setShowMealLog(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Clear all React Query cache
      queryClient.clear();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-4 sm:p-6 bg-white border-b animate-fadeIn">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Parent Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Track your child's nutrition</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" className="items-center gap-2" onClick={handleMealLog}>
          Log Meal
        </Button>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </Button>
      </div>
      <MealLogDialog 
        open={showMealLog}
        onOpenChange={setShowMealLog}
        mealType={selectedMealType}
        selectedDate={new Date()} // Adding the missing selectedDate prop
      />
    </div>
  );
};