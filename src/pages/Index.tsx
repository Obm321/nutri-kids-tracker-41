import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { NutritionCard } from "@/components/dashboard/NutritionCard";
import { ChildProfile } from "@/components/dashboard/ChildProfile";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-4">
        <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <DashboardHeader />
      <main className="container py-6 space-y-6">
        <ChildProfile
          name="Alex"
          age={8}
          achievements={5}
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <NutritionCard
            title="Calories"
            value={1200}
            unit="kcal"
            color="text-primary"
          />
          <NutritionCard
            title="Protein"
            value={45}
            unit="g"
            color="text-secondary"
          />
          <NutritionCard
            title="Carbs"
            value={150}
            unit="g"
            color="text-warning-DEFAULT"
          />
          <NutritionCard
            title="Fats"
            value={40}
            unit="g"
            color="text-success"
          />
        </div>
      </main>
    </div>
  );
};

export default Index;