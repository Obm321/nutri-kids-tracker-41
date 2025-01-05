import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile> => {
      // First check if we have an authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error("Authentication error:", authError);
        throw new Error("Not authenticated");
      }

      console.log("Authenticated user:", user.id);

      try {
        // Try to fetch existing profile first
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profiles")
          .select()
          .eq("id", user.id)
          .single();

        if (existingProfile) {
          console.log("Found existing profile:", existingProfile);
          return existingProfile;
        }

        // If no profile exists, create one
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,
              email: user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          ])
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
    retry: 1,
  });
};