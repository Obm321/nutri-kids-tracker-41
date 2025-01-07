import { supabase } from "@/lib/supabase";

export const getChildData = async (childId: string) => {
  try {
    // Get child details
    const { data: childData, error: childError } = await supabase
      .from("children")
      .select("*")
      .eq("id", childId)
      .maybeSingle();

    if (childError) {
      console.error("Error fetching child:", childError);
      throw childError;
    }

    // Get child's meals
    const { data: mealsData, error: mealsError } = await supabase
      .from("meals")
      .select("*")
      .eq("child_id", childId);

    if (mealsError) {
      console.error("Error fetching meals:", mealsError);
      throw mealsError;
    }

    // Format data as a dictionary
    const dataDictionary = {
      child: childData || null,
      meals: mealsData || [],
      statistics: {
        totalMeals: mealsData?.length || 0,
        mealTypes: mealsData?.reduce((acc: Record<string, number>, meal) => {
          acc[meal.type] = (acc[meal.type] || 0) + 1;
          return acc;
        }, {}),
      }
    };

    return dataDictionary;
  } catch (error) {
    console.error("Error in getChildData:", error);
    throw error;
  }
};

// Example usage:
// const childData = await getChildData("5");
// console.log(childData.child); // Child details
// console.log(childData.meals); // Array of meals
// console.log(childData.statistics); // Computed statistics