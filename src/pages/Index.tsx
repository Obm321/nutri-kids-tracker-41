import { useState, useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ChildProfile } from "@/components/dashboard/ChildProfile";
import { Calendar } from "@/components/dashboard/Calendar";
import { AddChildDialog } from "@/components/dashboard/AddChildDialog";
import { AddChildColumn } from "@/components/dashboard/AddChildColumn";
import { ChildDashboard } from "@/components/dashboard/ChildDashboard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import type { Child } from "@/lib/supabase";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        fetchChildren();
      } else {
        setChildren([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session) {
        await fetchChildren();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) return;

      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('profile_id', profile.user.id);

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch children profiles",
        variant: "destructive",
      });
    }
  };

  const handleAddChild = async (childData: Omit<Child, "id" | "profile_id" | "created_at" | "achievements">) => {
    try {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) return;

      const { data, error } = await supabase
        .from('children')
        .insert([
          {
            ...childData,
            profile_id: profile.user.id,
            achievements: 0,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setChildren([...children, data]);
      toast({
        title: "Success",
        description: "Child profile created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create child profile",
        variant: "destructive",
      });
    }
  };

  const handleEditChild = async (childData: Child) => {
    try {
      const { error } = await supabase
        .from('children')
        .update(childData)
        .eq('id', childData.id);

      if (error) throw error;

      const updatedChildren = children.map(child => 
        child.id === childData.id ? childData : child
      );
      setChildren(updatedChildren);
      setEditingChild(null);
      toast({
        title: "Success",
        description: "Child profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update child profile",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChild = async (childId: string) => {
    try {
      const { error } = await supabase
        .from('children')
        .delete()
        .eq('id', childId);

      if (error) throw error;

      const updatedChildren = children.filter(child => child.id !== childId);
      setChildren(updatedChildren);
      toast({
        title: "Success",
        description: "Child profile deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete child profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted px-4 py-6 sm:p-4">
        <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  if (selectedChild) {
    return (
      <ChildDashboard 
        child={{
          name: selectedChild.name,
          age: selectedChild.age,
          gender: selectedChild.gender,
          height: selectedChild.height,
          weight: selectedChild.weight,
        }}
      />
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
              id={child.id}
              name={child.name}
              age={child.age}
              achievements={child.achievements}
              onClick={() => setSelectedChild(child)}
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
          onAddChild={(childData) => handleEditChild({ ...childData, id: editingChild.id, profile_id: editingChild.profile_id, achievements: editingChild.achievements, created_at: editingChild.created_at })}
        />
      )}
    </div>
  );
};

export default Index;