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

      // First try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching profile:", fetchError);
        throw fetchError;
      }

      if (existingProfile) {
        console.log("Found existing profile:", existingProfile);
        return existingProfile;
      }

      console.log("No profile found, creating new profile");

      // Create new profile if none exists
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating profile:", createError);
        throw createError;
      }

      console.log("Created new profile:", newProfile);
      return newProfile;
    },
    retry: 1,
  });
};