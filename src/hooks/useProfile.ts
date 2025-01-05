import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile> => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user);

      if (!user) throw new Error("Not authenticated");

      // First try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("Existing profile:", existingProfile);
      console.log("Fetch error:", fetchError);

      // If profile exists, return it
      if (existingProfile) return existingProfile;

      // If no profile exists, create one
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      console.log("New profile:", newProfile);
      console.log("Insert error:", insertError);

      if (insertError) throw insertError;
      return newProfile;
    },
  });
};