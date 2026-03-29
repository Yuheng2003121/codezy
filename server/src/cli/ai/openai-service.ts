import { createOpenAI } from "@ai-sdk/openai";
import { openaiConfig } from "../config/openai.config.ts";
import { LanguageModel, ModelMessage, ToolSet, generateText, streamText } from "ai";

class AIService {
  private static instance: AIService;
  private _model: LanguageModel;

  private constructor() {
    if (!openaiConfig.apiKey) {
      throw new Error(
        "OPENAI_API_KEY is not defined. Please check your .env file.",
      );
    }
    if (!openaiConfig.baseURL) {
      throw new Error(
        "OPENAI_BASE_URL is not defined. Please check your .env file.",
      );
    }

    const openai = createOpenAI({
      baseURL: openaiConfig.baseURL,
      apiKey: openaiConfig.apiKey,
    });

    // We use .chat() to ensure compatibility with NVIDIA NIM (OpenAI-compatible)
    this._model = openai.chat("qwen/qwen3.5-122b-a10b");
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public get model() {
    return this._model;
  }

  /**
   * Send a message and get streaming response
   * @param {Array} messages
   * @param {Function} onChunk
   * @param {Object} tools
   * @param {Function} onToolCall
   * @returns {PromiseM<Object>}
   */
  async generateStreamingRes(
    messages: ModelMessage[],
    onChunk: (chunk: string) => void,
    tools?: ToolSet,
    onToolCall?: (toolCall: Object) => void,
  ) {
    try {
      const result = streamText({
        model: this._model,
        tools: tools,
        messages,
      });

      // let fullResponse = "";

      // for await (const chunk of result.textStream) {
      //   fullResponse += chunk;
      //   onChunk(chunk);
      // }

      // return fullResponse;
      return result;
    } catch (error) {
      console.error("Error generating text:", error);
      throw error;
    }
  }

  /**
   * Send a message and get streaming response
   * @param {Array} messages
   * @param {Object} tools
   * @returns {PromiseM<Object>}
   */
  async generateRes(
    messages: ModelMessage[],
    tools?: ToolSet,
  ) {
    try {
      const result = await generateText({
        model: this._model,
        messages,
        // 如果有 tools，记得传进去
        tools: tools,
      });

      // result 对象包含了 text, toolCalls, toolResults, usage 等所有信息
      return result;
    } catch (error) {
      console.error("Error generating text:", error);
      throw error;
    }
  }
}

export const aiService = AIService.getInstance();
export default AIService;
