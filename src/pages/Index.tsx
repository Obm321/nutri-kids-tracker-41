import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ChildProfile } from "@/components/dashboard/ChildProfile";
import { Calendar } from "@/components/dashboard/Calendar";
import { AddChildDialog } from "@/components/dashboard/AddChildDialog";
import { AddChildColumn } from "@/components/dashboard/AddChildColumn";
import { useToast } from "@/hooks/use-toast";

interface ChildData {
  id: string;
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  achievements: number;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [children, setChildren] = useState<ChildData[]>([]);
  const [editingChild, setEditingChild] = useState<ChildData | null>(null);
  const { toast } = useToast();

  const handleAddChild = (childData: Omit<ChildData, "id" | "achievements">) => {
    const newChild = {
      ...childData,
      id: Date.now().toString(),
      achievements: 0,
    };
    setChildren([...children, newChild]);
  };

  const handleEditChild = (childData: ChildData) => {
    setChildren(children.map(child => 
      child.id === childData.id ? childData : child
    ));
    setEditingChild(null);
  };

  const handleDeleteChild = (childId: string) => {
    setChildren(children.filter(child => child.id !== childId));
  };

  const handleChildClick = () => {
    // This will be implemented later for specific child dashboard
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
          {children.map((child) => (
            <ChildProfile
              key={child.id}
              name={child.name}
              age={parseInt(child.age)}
              achievements={child.achievements}
              onClick={handleChildClick}
              onEdit={() => setEditingChild(child)}
              onDelete={() => handleDeleteChild(child.id)}
            />
          ))}
          <AddChildColumn onClick={() => setIsAddChildOpen(true)} />
        </div>
      </main>
      <AddChildDialog 
        open={isAddChildOpen}
        onOpenChange={setIsAddChildOpen}
        onAddChild={handleAddChild}
      />
      {editingChild && (
        <AddChildDialog
          open={!!editingChild}
          onOpenChange={() => setEditingChild(null)}
          onAddChild={(childData) => handleEditChild({ ...childData, id: editingChild.id, achievements: editingChild.achievements })}
        />
      )}
    </div>
  );
};

export default Index;