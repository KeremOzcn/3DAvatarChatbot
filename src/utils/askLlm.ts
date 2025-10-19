import { Chat } from "@/features/chat/chat";

/**
 * Asks the LLM a question with a given context
 * @param systemPrompt - The system prompt/instruction
 * @param userPrompt - The user's question/context
 * @param chat - Optional chat instance for more advanced interactions
 * @returns The LLM's response
 */
export async function askLLM(
  systemPrompt: string,
  userPrompt: string,
  chat: Chat | null,
): Promise<string> {
  try {
    // If chat instance is provided, use it for more context-aware responses
    if (chat && chat.getChatCompletion) {
      const messages = [
        { role: "system" as const, content: systemPrompt },
        { role: "user" as const, content: userPrompt },
      ];
      
      const response = await chat.getChatCompletion(messages);
      return response || "Error: No response from LLM";
    }

    // Fallback: Simple response
    return `Processed: ${userPrompt.substring(0, 100)}...`;
  } catch (error) {
    console.error("Error in askLLM:", error);
    return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}
