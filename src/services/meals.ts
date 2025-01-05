import { supabase } from "@/lib/supabase";
import { StorageService } from "./storage";

export const MealService = {
  async createMeal({
    childId,
    name,
    type,
    photoFile,
  }: {
    childId: string;
    name: string;
    type: string;
    photoFile: File;
  }) {
    try {
      const photoUrl = await StorageService.uploadFile('meal-photos', photoFile);

      const { error: insertError } = await supabase
        .from('meals')
        .insert([
          {
            child_id: childId,
            name,
            type,
            photo_url: photoUrl,
            date: new Date().toISOString(),
            carbs: 0,
            protein: 0,
            fat: 0,
            calories: 0,
          }
        ]);

      if (insertError) throw insertError;

      return { success: true };
    } catch (error) {
      console.error('Error saving meal:', error);
      throw error;
    }
  }
};