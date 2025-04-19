import axios, {type AxiosInstance} from 'axios';

type Model = 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo' | 'gpt-4o-mini'; // добавьте другие модели по необходимости
type ResponseFormat = 'text' | 'json_object';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GptResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_cost: number;
    completion_cost: number;
    total_cost: number;
  };

}

interface ChatCompletionOptions {
  model: Model;
  messages: Message[];
  response_format?: { type: ResponseFormat };
  temperature?: number;
  max_tokens?: number;
  useWalletBalance?: boolean;
}

export class GPTunnelService {
  private apiKey: string;
  private model: Model;
  private systemPrompt: string = '';
  private userPrompt: string = '';
  private responseType: ResponseFormat = 'text';
  private temperature: number = 0.7;
  private maxTokens: number = 1000;
  private axiosInstance: AxiosInstance;

  constructor(apiKey: string, model: Model) {
    this.apiKey = apiKey;
    this.model = model;

    this.axiosInstance = axios.create({
      baseURL: 'https://gptunnel.ru/v1',
      headers: {
        'Authorization': this.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  setSystemPrompt(prompt: string): this {
    this.systemPrompt = prompt;
    return this;
  }

  setUserPrompt(prompt: string): this {
    this.userPrompt = prompt;
    return this;
  }

  setResponseType(type: ResponseFormat): this {
    this.responseType = type;
    return this;
  }

  setTemperature(temperature: number): this {
    this.temperature = temperature;
    return this;
  }

  setMaxTokens(maxTokens: number): this {
    this.maxTokens = maxTokens;
    return this;
  }

  async ask(): Promise<GptResponse> {
    const messages: Message[] = [];

    if (this.systemPrompt) {
      messages.push({
        role: 'system',
        content: this.systemPrompt
      });
    }

    messages.push({
      role: 'user',
      content: this.userPrompt
    });

    const options: ChatCompletionOptions = {
      model: this.model,
      messages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      useWalletBalance: true
    };

    if (this.responseType === 'json_object') {
      options.response_format = {type: 'json_object'};
    }

    try {
      const response = await this.axiosInstance.post('/chat/completions', options);
      return response.data as GptResponse
    } catch (error) {
      console.error('Error calling ChatGPT API:', error);
      throw error;
    }
  }
}