import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ChildProfile } from "@/components/dashboard/ChildProfile";
import { Calendar } from "@/components/dashboard/Calendar";
import { AddChildDialog } from "@/components/dashboard/AddChildDialog";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const { toast } = useToast();

  const handleChildClick = () => {
    toast({
      title: "Coming Soon",
      description: "Child dashboard will be implemented in the next phase.",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-6 sm:p-4">
        <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <Calendar />
      <DashboardHeader />
      <main className="container px-4 py-4 sm:py-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ChildProfile
            name="Alex"
            age={8}
            achievements={5}
            onClick={handleChildClick}
          />
          <Card 
            className="p-4 sm:p-6 bg-gray-100 animate-fadeIn cursor-pointer flex flex-col items-center justify-center gap-2"
            onClick={() => setIsAddChildOpen(true)}
          >
            <UserPlus className="w-12 h-12 text-gray-400" />
            <span className="text-gray-500">Add Child</span>
          </Card>
        </div>
      </main>
      <AddChildDialog 
        open={isAddChildOpen}
        onOpenChange={setIsAddChildOpen}
      />
    </div>
  );
};

export default Index;