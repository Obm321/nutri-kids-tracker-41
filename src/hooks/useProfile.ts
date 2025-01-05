import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile> => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error("Authentication error");
      }

      if (!session) {
        console.error("No active session");
        throw new Error("Not authenticated");
      }

      console.log("Fetching profile for user:", session.user.id);

      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw profileError;
        }

        if (!profile) {
          console.error("Profile not found");
          throw new Error("Profile not found");
        }

        return profile;
      } catch (error) {
        console.error("Profile operation failed:", error);
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};