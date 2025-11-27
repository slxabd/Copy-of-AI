import { GoogleGenAI } from "@google/genai";

// Ensure API key is present
const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-build' });

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Converts a base64 string to the format expected by the SDK if needed,
 * or handles standard base64 stripping.
 */
const prepareImagePart = (base64String: string) => {
  // Remove data URL prefix if present (e.g., "data:image/png;base64,")
  const match = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (match) {
    return {
      mimeType: match[1],
      data: match[2],
    };
  }
  // Assume it's raw base64 png if no header
  return {
    mimeType: 'image/png',
    data: base64String,
  };
};

/**
 * Generate a clothing item image from a text prompt.
 */
export const generateClothingImage = async (prompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  const fullPrompt = `Professional fashion photography of ${prompt}, isolated on a plain white background, flat lay, high resolution, detailed texture.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [{ text: fullPrompt }],
      },
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Error generating clothes:", error);
    throw error;
  }
};

/**
 * Generate the "Try On" result using person and clothes images.
 */
export const generateTryOn = async (personBase64: string, clothesBase64: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  const personPart = prepareImagePart(personBase64);
  const clothesPart = prepareImagePart(clothesBase64);

  const prompt = "Generate a photorealistic full-body image of the person in the first image wearing the clothing shown in the second image. Maintain the person's exact facial features, body shape, and pose. The clothing should fit naturally. High quality fashion photography, 4k resolution.";

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          { inlineData: personPart },
          { inlineData: clothesPart },
          { text: prompt },
        ],
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Failed to generate try-on image.");
  } catch (error) {
    console.error("Error generating try-on:", error);
    throw error;
  }
};