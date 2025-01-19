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
    const { imageData } = await req.json()
    
    if (!imageData) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const SPOONACULAR_API_KEY = Deno.env.get('SPOONACULAR_API_KEY')
    if (!SPOONACULAR_API_KEY) {
      throw new Error('Spoonacular API key not found')
    }

    // Create form data with the base64 image
    const formData = new FormData()
    const blob = await fetch(imageData).then(res => res.blob())
    formData.append('file', blob)

    // Query Spoonacular API for nutritional information using image analysis
    const response = await fetch(
      'https://api.spoonacular.com/food/images/analyze',
      {
        method: 'POST',
        headers: {
          'x-api-key': SPOONACULAR_API_KEY
        },
        body: formData
      }
    )

    if (!response.ok) {
      throw new Error('Failed to analyze image')
    }

    const analysisData = await response.json()
    
    // Extract nutrition information from the response
    const nutrition = analysisData.nutrition || {}
    
    return new Response(
      JSON.stringify({
        calories: nutrition.calories || 0,
        carbs: nutrition.carbs || 0,
        protein: nutrition.protein || 0,
        fat: nutrition.fat || 0
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