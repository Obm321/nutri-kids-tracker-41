import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

interface ChildProfileProps {
  name: string;
  age: number;
  achievements: number;
}

export const ChildProfile = ({ name, age, achievements }: ChildProfileProps) => {
  return (
    <Card className="p-6 animate-fadeIn">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {name.charAt(0)}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-muted-foreground">{age} years old</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Award className="w-5 h-5 text-warning-DEFAULT" />
          <span className="font-medium">{achievements} achievements</span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <Button variant="outline" className="w-full">View Progress</Button>
        <Button variant="outline" className="w-full">Meal History</Button>
        <Button variant="outline" className="w-full">Settings</Button>
      </div>
    </Card>
  );
};