import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export const DashboardHeader = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      queryClient.clear();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-4 sm:p-6 bg-white border-b animate-fadeIn">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Track your children's nutrition</p>
      </div>
      <Button 
        variant="outline" 
        onClick={handleLogout}
        className="bg-red-500 text-white hover:bg-red-600"
      >
        Logout
      </Button>
    </div>
  );
};