import { Button } from "@/components/ui/button";
import { PlusCircle, Camera } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

export const DashboardHeader = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleLogMeal = () => {
    // In a real app, this would open the camera/image upload
    toast({
      title: "Meal Logging",
      description: "Camera functionality will be implemented in the next phase.",
    });
  };

  const handleAddChild = () => {
    toast({
      title: "Add Child",
      description: "Child profile creation will be implemented in the next phase.",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 bg-white border-b animate-fadeIn gap-4 sm:gap-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Track your child's nutrition</p>
      </div>
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1 sm:flex-initial items-center gap-2"
          onClick={handleLogMeal}
        >
          <Camera className="w-4 h-4" />
          {!isMobile && "Log Meal"}
        </Button>
        <Button 
          className="flex-1 sm:flex-initial items-center gap-2"
          onClick={handleAddChild}
        >
          <PlusCircle className="w-4 h-4" />
          {!isMobile && "Add Child"}
        </Button>
      </div>
    </div>
  );
};