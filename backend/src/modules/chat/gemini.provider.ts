import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerativeModel } from "@google/generative-ai";
import { AIProvider, Message, StreamCallbacks } from "./ai.provider";

export class GeminiProvider extends AIProvider {
    private genAI: GoogleGenerativeAI;
    private models: Record<string, GenerativeModel>;
    private activeModelName: string = "gemini-2.5-flash";

    constructor(apiKey: string) {
        super();
        this.genAI = new GoogleGenerativeAI(apiKey);

        // Initialize all available free-tier models
        this.models = {
            "gemini-2.5-flash": this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" }),
            "gemini-2.5-pro": this.genAI.getGenerativeModel({ model: "gemini-2.5-pro" }),
            "gemini-2.5-flash-lite": this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" }),
            "gemini-1.0-pro": this.genAI.getGenerativeModel({ model: "gemini-1.0-pro" }),
        };
    }

    // Method to switch the main chat model dynamically
    public setActiveModel(modelName: "gemini-2.5-flash" | "gemini-2.5-pro" | "gemini-2.5-flash-lite" | "gemini-1.0-pro") {
        if (this.models[modelName]) {
            this.activeModelName = modelName;
        }
    }

    // Helper to fetch the correct model instance, applying system instructions if needed
    private getActiveChatModel(systemInstruction?: string): GenerativeModel {
        if (systemInstruction) {
            // System instructions require creating a specific instance for the call
            return this.genAI.getGenerativeModel({ 
                model: this.activeModelName, 
                systemInstruction 
            });
        }
        return this.models[this.activeModelName];
    }

    private convertMessages(messages: Message[]) {
        const systemMessage = messages.find(m => m.role === "system");
        const chatMessages = messages.filter(m => m.role !== "system");

        if (chatMessages.length === 0) {
            return { history: [], latestMessage: "", systemInstruction: systemMessage?.content };
        }

        const history = chatMessages.slice(0, -1).map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        const latestMessage = chatMessages[chatMessages.length - 1].content;

        return { history, latestMessage, systemInstruction: systemMessage?.content };
    }

    async generateResponse(messages: Message[]): Promise<string> {
        const { history, latestMessage, systemInstruction } = this.convertMessages(messages);
        
        const model = this.getActiveChatModel(systemInstruction);
        const chat = model.startChat({ history });
        const result = await chat.sendMessage(latestMessage);
        
        return result.response.text();
    }

    async streamResponse(messages: Message[], callbacks: StreamCallbacks, signal?: AbortSignal): Promise<void> {
        try {
            const { history, latestMessage, systemInstruction } = this.convertMessages(messages);
            
            const model = this.getActiveChatModel(systemInstruction);
            const chat = model.startChat({ history });
            const result = await chat.sendMessageStream(latestMessage);

            let fullContent = "";
            for await (const chunk of result.stream) {
                if (signal?.aborted) return;
                const text = chunk.text();
                if (text) {
                    fullContent += text;
                    callbacks.onToken(text);
                }
            }
            callbacks.onComplete(fullContent);
        } catch (error: any) {
            callbacks.onError(error);
        }
    }

    async generateTitle(firstMessage: string): Promise<string> {
        // Hardcoded to Flash-Lite: Saves quota and is incredibly fast for simple text manipulation
        const prompt = `Generate a short, concise title (max 5 words) for a chat conversation based on this message: "${firstMessage}". Return only the title text without quotes.`;
        const result = await this.models["gemini-2.5-flash-lite"].generateContent(prompt);
        return result.response.text().trim().replace(/["']/g, "");
    }

    async speechToText(audioBuffer: Buffer): Promise<string> {
        try {
            // Hardcoded to Flash: Ideal balance for multimodal audio processing
            const result = await this.models["gemini-2.5-flash"].generateContent([
                {
                    inlineData: {
                        mimeType: "audio/wav",
                        data: audioBuffer.toString("base64"),
                    },
                },
                { text: "Precisely transcribe this audio into text. Return only the transcription." },
            ]);
            return result.response.text();
        } catch (error) {
            console.error("Gemini STT Error:", error);
            throw new Error("Failed to transcribe audio with Gemini");
        }
    }

    async textToSpeech(text: string): Promise<Buffer> {
        return Buffer.alloc(0);
    }
}