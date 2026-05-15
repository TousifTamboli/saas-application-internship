import api from './axios';
import type { ChatResponse } from '../types';

export const chatApi = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    const { data } = await api.post<ChatResponse>('/chat', { message });
    return data;
  },
};
