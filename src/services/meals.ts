import { supabase } from "@/lib/supabase";
import { StorageService } from "./storage";

export const MealService = {
  async createMeal({
    childId,
    name,
    type,
    photoFile,
    dateTime,
  }: {
    childId: string;
    name: string;
    type: string;
    photoFile: File;
    dateTime: Date;
  }) {
    try {
      // First upload the photo
      const photoUrl = await StorageService.uploadFile('meal-photos', photoFile);

      // Then create the meal record
      const { data: meal, error: insertError } = await supabase
        .from('meals')
        .insert([
          {
            child_id: childId,
            name,
            type,
            photo_url: photoUrl,
            date: dateTime.toISOString(),
            calories: 0, // These will be updated later when we add nutrition calculation
            carbs: 0,
            protein: 0,
            fat: 0,
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting meal:', insertError);
        throw insertError;
      }

      return meal;
    } catch (error) {
      console.error('Error saving meal:', error);
      throw error;
    }
  },

  async getMealsByChildAndDate(childId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('child_id', childId)
      .gte('date', startOfDay.toISOString())
      .lte('date', endOfDay.toISOString())
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching meals:', error);
      throw error;
    }

    return data;
  }
};