import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { mealName } = await req.json()
    
    if (!mealName) {
      return new Response(
        JSON.stringify({ error: 'Meal name is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const SPOONACULAR_API_KEY = Deno.env.get('SPOONACULAR_API_KEY')
    if (!SPOONACULAR_API_KEY) {
      throw new Error('Spoonacular API key not found')
    }

    // Query Spoonacular API for nutritional information
    const response = await fetch(
      `https://api.spoonacular.com/recipes/guessNutrition?title=${encodeURIComponent(mealName)}`,
      {
        headers: {
          'x-api-key': SPOONACULAR_API_KEY
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch nutrition data')
    }

    const nutritionData = await response.json()
    
    return new Response(
      JSON.stringify({
        calories: nutritionData.calories?.value || 0,
        carbs: nutritionData.carbs?.value || 0,
        protein: nutritionData.protein?.value || 0,
        fat: nutritionData.fat?.value || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})