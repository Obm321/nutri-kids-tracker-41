import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import FoodQuest from "./FoodQuest";

export const ChildEducation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-muted">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/child/${id}`)}
            className="mr-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Food Hero Education</h1>
        </div>
      </div>

      <main className="container mx-auto py-6">
        <FoodQuest />
      </main>
    </div>
  );
};