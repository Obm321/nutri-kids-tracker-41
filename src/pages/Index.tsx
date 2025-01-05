import { useState, useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AddChildDialog } from "@/components/dashboard/AddChildDialog";
import { AddChildColumn } from "@/components/dashboard/AddChildColumn";
import { ChildProfile } from "@/components/dashboard/ChildProfile";
import type { Child } from "@/lib/supabase";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddChildDialog, setShowAddChildDialog] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profile, error: profileError } = useProfile();

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      setIsAuthenticated(!!session);
      if (session) {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        fetchChildren(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session);
      setIsAuthenticated(!!session);
      if (session) {
        await fetchChildren(session.user.id);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('profile_id', profileId);

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        title: "Error",
        description: "Could not fetch children profiles.",
        variant: "destructive",
      });
    }
  };

  const handleAddChild = async (childData: {
    name: string;
    age: number;
    gender: string;
    height: string;
    weight: string;
  }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      const { data, error } = await supabase
        .from('children')
        .insert([
          {
            ...childData,
            profile_id: session.user.id,
            achievements: 0,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setChildren(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Child profile added successfully.",
      });
    } catch (error) {
      console.error('Error adding child:', error);
      toast({
        title: "Error",
        description: "Could not add child profile.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChild = async (childId: string) => {
    const updatedChildren = children.filter(child => child.id !== childId);
    setChildren(updatedChildren);
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

  return (
    <div className="min-h-screen bg-muted">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto p-4">
        {profileError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error loading profile: {profileError.message}
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {children.map((child) => (
            <ChildProfile
              key={child.id}
              id={child.id}
              name={child.name}
              age={child.age}
              gender={child.gender}
              height={child.height}
              weight={child.weight}
              achievements={child.achievements}
              onDelete={() => handleDeleteChild(child.id)}
            />
          ))}
          <AddChildColumn onClick={() => setShowAddChildDialog(true)} />
        </div>

        <AddChildDialog
          open={showAddChildDialog}
          onOpenChange={setShowAddChildDialog}
          onAddChild={handleAddChild}
        />
      </div>
    </div>
  );
};

export default Index;