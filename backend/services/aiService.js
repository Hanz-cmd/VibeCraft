const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Initialize Gemini
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

/**
 * Analyze a clothing image and return category, color, style
 */
async function analyzeClothing(imagePath) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      category: 'top',
      subcategory: 'unknown',
      colors: ['unknown'],
      style: 'casual',
      season: ['spring', 'summer', 'fall', 'winter'],
      occasions: ['casual']
    };
  }

  try {
    // Read image and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this clothing item and return a JSON object with:
              {
                "category": one of ["top","bottom","shoes","outerwear","accessory","dress"],
                "subcategory": specific type like "t-shirt","jeans","sneakers","blazer",
                "colors": array of main colors,
                "style": one of ["casual","formal","sporty","streetwear","bohemian","minimalist"],
                "season": array of suitable seasons ["spring","summer","fall","winter"],
                "occasions": array of suitable occasions ["work","casual","date","party","gym","outdoor"]
              }
              Return JSON only.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 300
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);
    return parsed;
    
    // Fallback if parsing fails
    return {
      category: 'top',
      subcategory: 'unknown',
      colors: ['unknown'],
      style: 'casual',
      season: ['spring', 'summer', 'fall', 'winter'],
      occasions: ['casual']
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    // Return default if AI fails
    return {
      category: 'top',
      subcategory: 'unknown',
      colors: ['unknown'],
      style: 'casual',
      season: ['spring', 'summer', 'fall', 'winter'],
      occasions: ['casual']
    };
  }
}

/**
 * Generate outfit combinations from wardrobe items
 */
async function generateOutfits(wardrobeItems, occasion = 'casual', weather = null) {
  if (!genAI) {
    return basicOutfitFallback(wardrobeItems);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const itemsSummary = wardrobeItems.map(item => ({
      id: item.id,
      category: item.category,
      subcategory: item.subcategory,
      colors: item.colors,
      style: item.style
    }));

    const weatherContext = weather 
      ? `The weather is ${weather.temp}°C and ${weather.condition}.` 
      : '';

    const prompt = `Given these wardrobe items:
${JSON.stringify(itemsSummary, null, 2)}

Create 3 outfit combinations for: ${occasion}
${weatherContext}

Return ONLY a JSON object with this structure:
{
  "outfits": [
    {
      "name": "creative outfit name",
      "itemIds": ["id1","id2"],
      "description": "why this works",
      "tip": "one styling tip"
    }
  ]
}
Return ONLY the JSON, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return Array.isArray(parsed.outfits) ? parsed.outfits : [];
    }

    return basicOutfitFallback(wardrobeItems);
  } catch (error) {
    console.error('Gemini outfit generation error:', error.message);
    return basicOutfitFallback(wardrobeItems);
  }
}

function basicOutfitFallback(wardrobeItems) {
  const tops = wardrobeItems.filter(i => i.category === 'top');
  const bottoms = wardrobeItems.filter(i => i.category === 'bottom');
  const shoes = wardrobeItems.filter(i => i.category === 'shoes');
  const outerwear = wardrobeItems.filter(i => i.category === 'outerwear');

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const outfits = [];

  for (let i = 0; i < 3; i++) {
    const items = [];
    if (tops.length) items.push(pick(tops).id);
    if (bottoms.length) items.push(pick(bottoms).id);
    if (shoes.length) items.push(pick(shoes).id);
    if (outerwear.length && Math.random() > 0.5) items.push(pick(outerwear).id);

    if (items.length === 0) return [];

    outfits.push({
      name: `Everyday Fit ${i + 1}`,
      itemIds: items,
      description: 'A balanced combo built from your available items.',
      tip: 'Try swapping colors for contrast.'
    });
  }

  return outfits;
}

module.exports = { analyzeClothing, generateOutfits };
