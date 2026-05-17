export type LLMMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};
