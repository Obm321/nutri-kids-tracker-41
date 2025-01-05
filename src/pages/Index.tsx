import { useState, useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
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
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session);
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-muted">
      <DashboardHeader />
      <div className="max-w-7xl mx-auto p-4">
        {profileError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error loading profile: {profileError.message}
          </div>
        )}
        {/* Parent dashboard content will go here */}
      </div>
    </div>
  );
};

export default Index;
