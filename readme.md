Here's the updated README content:

---

# AI Text Generation Package

This package provides a simple way to generate AI-powered text responses using the Google Generative AI API. It integrates Zod for schema validation, ensuring that the generated text adheres to a specific JSON structure.

## Installation

```bash
npm install ai-package
```

## Usage

### Importing the Package

```typescript
import {
  GoogleGenerativeAI,
  GoogleGenerativeAIError,
} from "@google/generative-ai";
import z from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { generateText } from "ai-package";
```

### Example: Generating AI Text

```typescript
import z from "zod";
import { generateText } from "ai-package";

const apiKey = "your-api-key";
const prompt = "Describe the weather today";
const temperature = 0.7;

const weatherSchema = z.object({
  temperature: z.number(),
  condition: z.string(),
});

async function main() {
  try {
    const response = await generateText({
      apiKey,
      prompt,
      temperature,
      zodStructure: weatherSchema,
    });

    if (response.type === "success") {
      console.log("Generated Text:", response.data);
    } else {
      console.error("Error:", response.message);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
}

main();
```

### Function Signature

```typescript
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
});
```

### Parameters

- `apiKey`: Your Google Generative AI API key.
- `prompt`: The prompt to provide to the AI model.
- `temperature`: (Optional) A number between 0 and 1 that controls the creativity of the generated text.
- `zodStructure`: A Zod schema that defines the expected structure of the generated text.

### Error Handling

The function is designed to handle various types of errors:

- **JSON Schema Validation Failed**: If the generated text doesn't match the expected JSON structure.
- **JSON Parsing Failed**: If the generated text cannot be parsed as JSON.
- **API Key Invalid**: If the provided API key is invalid.
- **Unknown Errors**: For any unexpected errors.

### Server-Side Only

This function is designed to run on the server side only. Attempting to run it on the client side will result in an error.

## API Key

You can get an API key for free from [Google AI Studio](https://aistudio.google.com/app/apikey). The key is free as of 18/08/2024.

## Repository

You can find the source code and contribute to the project on GitHub:

[GitHub Repository](https://github.com/Arinji2/ai-package)

## About Me

I'm new to creating libraries and would love to hear any feedback or criticism regarding this package. I initially made this package for my own projects that need basic AI functionality, but I'm happy to share it with the community.

Feel free to reach out or explore more about my work on my website:

[My Website](https://www.arinji.com)

## License

This project is licensed under the MIT License.

---
