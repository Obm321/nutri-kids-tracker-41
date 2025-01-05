import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile> => {
      // Wait for auth state to be initialized
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error("Authentication error");
      }

      if (!session) {
        console.error("No active session");
        throw new Error("Not authenticated");
      }

      console.log("Authenticated user:", session.user.id);

      try {
        // Try to fetch existing profile first
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profiles")
          .select()
          .eq("id", session.user.id)
          .single();

        if (fetchError) {
          console.error("Error fetching profile:", fetchError);
          throw fetchError;
        }

        if (existingProfile) {
          console.log("Found existing profile:", existingProfile);
          return existingProfile;
        }

        // If no profile exists, create one
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .upsert({
            id: session.user.id,
            email: session.user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating profile:", createError);
          throw createError;
        }

        console.log("Created new profile:", newProfile);
        return newProfile;
      } catch (error) {
        console.error("Profile operation failed:", error);
        throw error;
      }
    },
    retry: false, // Don't retry on failure
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};