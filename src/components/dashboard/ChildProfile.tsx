import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChildProfileProps {
  name: string;
  age: number;
  achievements: number;
}

export const ChildProfile = ({ name, age, achievements }: ChildProfileProps) => {
  const { toast } = useToast();

  const handleProgress = () => {
    toast({
      title: "Progress Tracking",
      description: "Viewing progress charts will be available soon.",
    });
  };

  const handleHistory = () => {
    toast({
      title: "Meal History",
      description: "Viewing meal history will be available soon.",
    });
  };

  const handleSettings = () => {
    toast({
      title: "Profile Settings",
      description: "Profile settings will be available soon.",
    });
  };

  return (
    <Card className="p-4 sm:p-6 animate-fadeIn">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary flex items-center justify-center">
          <span className="text-xl sm:text-2xl font-bold text-white">
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold">{name}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{age} years old</p>
        </div>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-warning-DEFAULT" />
          <span className="text-sm sm:text-base font-medium">{achievements} achievements</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
        <Button 
          variant="outline" 
          className="w-full text-sm sm:text-base"
          onClick={handleProgress}
        >
          Progress
        </Button>
        <Button 
          variant="outline" 
          className="w-full text-sm sm:text-base"
          onClick={handleHistory}
        >
          History
        </Button>
        <Button 
          variant="outline" 
          className="w-full text-sm sm:text-base"
          onClick={handleSettings}
        >
          Settings
        </Button>
      </div>
    </Card>
  );
};