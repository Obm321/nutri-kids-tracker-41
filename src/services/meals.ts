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
      console.log('Starting meal creation process...', { childId, name, type, dateTime });
      
      // First upload the photo
      console.log('Uploading photo...');
      const photoUrl = await StorageService.uploadFile('meal-photos', photoFile);
      console.log('Photo uploaded successfully:', photoUrl);

      // Then create the meal record
      console.log('Creating meal record in database...');
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

      console.log('Meal created successfully:', meal);
      return meal;
    } catch (error) {
      console.error('Error in createMeal:', error);
      throw error;
    }
  },

  async getMealsByChildAndDate(childId: string, date: Date) {
    console.log('Fetching meals for child:', childId, 'date:', date);
    
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

    console.log('Fetched meals:', data);
    return data;
  }
};