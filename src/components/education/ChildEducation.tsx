import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FoodQuest from "./FoodQuest";

export const ChildEducation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#F0F8FF]">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/child/${id}`)}
            className="mr-2 text-[#4B0082] hover:bg-[#E6E6FA]"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-[#32CD32]">Food Hero Education</h1>
        </div>
      </div>

      <main>
        <FoodQuest />
      </main>
    </div>
  );
};