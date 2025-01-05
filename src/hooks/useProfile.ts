import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile> => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user); // Debug log

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("Profile data:", data); // Debug log
      console.log("Profile error:", error); // Debug log

      if (error) throw error;
      return data;
    },
  });
};