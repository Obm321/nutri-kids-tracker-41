import { Card } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

interface AddChildColumnProps {
  onClick: () => void;
}

export const AddChildColumn = ({ onClick }: AddChildColumnProps) => {
  return (
    <Card 
      className="p-4 sm:p-6 bg-gray-100 animate-fadeIn cursor-pointer flex items-center justify-center"
      onClick={onClick}
    >
      <UserPlus className="w-12 h-12 text-gray-400" />
    </Card>
  );
};