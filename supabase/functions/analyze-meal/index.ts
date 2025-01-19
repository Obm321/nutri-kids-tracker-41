import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageData, name } = await req.json()
    
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

    console.log('Processing image for meal analysis...')

    // Convert base64 to blob
    const base64Data = imageData.split(',')[1]
    const byteString = atob(base64Data)
    const arrayBuffer = new ArrayBuffer(byteString.length)
    const uint8Array = new Uint8Array(arrayBuffer)
    
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i)
    }
    
    const blob = new Blob([uint8Array], { type: 'image/jpeg' })

    // Create form data with the blob
    const formData = new FormData()
    formData.append('file', blob, 'meal.jpg')

    console.log('Calling Spoonacular API...')

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
      console.error('Spoonacular API error:', await response.text())
      throw new Error('Failed to analyze image')
    }

    const analysisData = await response.json()
    console.log('Received analysis data:', analysisData)
    
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
    console.error('Error in analyze-meal function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})