import {
  GoogleGenerativeAI,
  GoogleGenerativeAIError,
} from "@google/generative-ai";
import z from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export async function generateText({
  apiKey,
  prompt,
  temperature,

  zodStructure,
}: {
  apiKey: string;
  prompt: string;
  temperature?: number;

  zodStructure: z.ZodTypeAny;
}) {
  const isOnServer = typeof window === "undefined";

  if (!isOnServer) {
    throw new Error("This function must be run on the server");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: temperature || 0.7,
      responseMimeType: "application/json",
    },
  });

  const jsonSchema = zodToJsonSchema(zodStructure) as Record<string, any>;

  const modelPrompt = `
  This is the prompt you need to run. ${prompt}. 
  Ensure the prompt is in the format of a JSON object with the following structure: 
  ${JSON.stringify(jsonSchema.properties)}.
  Do not add any other text to the response.
`;

  try {
    const result = (await model.generateContent([modelPrompt])).response.text();
    try {
      const parsed = JSON.parse(result);
      const schema = zodStructure.safeParse(parsed);
      if (!schema.success) {
        return {
          type: "error",
          message: "JSON Schema Validation Failed",
          data: schema.error,
        };
      } else {
        return {
          type: "success",
          message: "All Checks Passed",
          data: schema.data,
        };
      }
    } catch (error) {
      return {
        type: "error",
        message: "JSON Parsing Failed",
        data: error,
      };
    }
  } catch (error: any) {
    if ((error instanceof GoogleGenerativeAIError) as any) {
      if (error.reason === "API_KEY_INVALID") {
        return {
          type: "error",
          message: "API Key Invalid",
          data: error,
        };
      } else {
        return {
          type: "error",
          message: "Caught Error within Google Generative AI",
          data: error,
        };
      }
    } else {
      return {
        type: "error",
        message: "Caught Unknown Error",
        data: error,
      };
    }
  }
}
