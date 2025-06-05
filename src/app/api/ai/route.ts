import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("Received request body:", body);

  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
  });
  const svgString = body.image; // Assuming the image is sent as a base64 string

  const pngBuffer = await sharp(Buffer.from(svgString)).png().toBuffer();
  const base64Image = pngBuffer.toString("base64");
  const prompt = `You are an AI art evaluator. Analyze the following SVG sketch and provide a structured JSON object with the following attributes:

    1. Sketch Score (0-100): Overall quality and creativity score.
    2. Creativity (0-100): How imaginative and unique the design is.
    3. Complexity (0-100): How intricate and detailed the sketch is.

   Give the answer as an Array of integers in the format: [Sketch Score, Creativity, Complexity].
   It's very important that there should be no text in the response, only the array of integers.
    `;
  const contents = [
    {
      inlineData: {
        mimeType: "image/png",
        data: base64Image,
      },
    },
    { text: prompt },
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
    });

    if (response?.candidates && response.candidates[0]?.content) {
      return new Response(JSON.stringify(response.candidates[0].content), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(
        JSON.stringify({ error: "AI response is missing candidates." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error generating AI content:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate AI content." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
