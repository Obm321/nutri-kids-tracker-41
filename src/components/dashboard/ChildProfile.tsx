import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChildProfileProps {
  name: string;
  age: number;
  achievements: number;
  onClick?: () => void;
}

export const ChildProfile = ({ name, age, achievements, onClick }: ChildProfileProps) => {
  const { toast } = useToast();

  const handleSettings = () => {
    toast({
      title: "Profile Settings",
      description: "Profile settings will be available soon.",
    });
  };

  return (
    <Card 
      className="p-4 sm:p-6 animate-fadeIn cursor-pointer relative"
      onClick={onClick}
    >
      <button 
        className="absolute top-2 right-2 p-2 hover:bg-muted rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          handleSettings();
        }}
      >
        <Settings className="w-5 h-5 text-muted-foreground" />
      </button>
      
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary flex items-center justify-center">
          <span className="text-xl sm:text-2xl font-bold text-white">
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold">{name}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{age} years old</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#FCD34D] rounded-lg p-2 text-center">
          <span className="text-lg font-bold">C</span>
          <div className="text-sm">0g</div>
        </div>
        <div className="bg-[#4ADE80] rounded-lg p-2 text-center">
          <span className="text-lg font-bold">P</span>
          <div className="text-sm">0g</div>
        </div>
        <div className="bg-[#60A5FA] rounded-lg p-2 text-center">
          <span className="text-lg font-bold">F</span>
          <div className="text-sm">0g</div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        {achievements} achievements
      </div>
    </Card>
  );
};