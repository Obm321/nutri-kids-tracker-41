import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");

      console.log("Fetching profile for user:", user.id);

      // Attempt to create/update profile first to handle race conditions
      const { data: profile, error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (upsertError) {
        console.error("Error upserting profile:", upsertError);
        
        // If upsert fails, try to fetch existing profile
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profiles")
          .select()
          .eq("id", user.id)
          .single();

        if (fetchError) {
          console.error("Error fetching profile:", fetchError);
          throw fetchError;
        }

        return existingProfile;
      }

      console.log("Profile upserted successfully:", profile);
      return profile;
    },
    retry: 1,
  });
};