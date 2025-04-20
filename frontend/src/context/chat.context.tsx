"use client";
import React, {createContext, ReactNode, useCallback, useMemo, useState} from 'react';
import {
  createChat,
  CreateChatData,
  fetchChats,
  getChatById,
  getChatMessages,
  IChatInfo,
  IMessage,
  sendMessage,
  SendMessageData
} from '@/api/chats';
import {Chat, Company, Message} from "../../../backend/generated/prisma";
import {useMutation, useQuery, useQueryClient} from 'react-query';

interface ChatContextType {
  listLoading: boolean;
  chatLoading: boolean;
  selectedChat: number;
  selectChat: (id: number) => void;
  chatList: ChatInListProps[];
  isChats: boolean,
  currentChat: IChatInfo | null;
  messages: IMessage[];
  createNewChat: (data: CreateChatData) => Promise<void>;
  fetchChatInfo: (chatId: number) => Promise<void>;
  sendNewMessage: (chatId: number, data: SendMessageData) => Promise<void>;
  parseChat: (data: ChatInListProps) => UIChatData;
  getCurrentProfileInfo: () => UIChatData | boolean;
  invalidateData: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export interface ChatProviderProps {
  children: ReactNode;
}

export interface ExtendedMessageType extends Message {
  content: {
    text?: string;
    ai?: boolean;
  }
}

export interface ExtendedChatType extends Chat {
  company: Company;
  messages: ExtendedMessageType[];
}

export interface ChatInListProps {
  chatId: number;
  chat: ExtendedChatType;
  id: number;
  userId: number;
}

export interface UIChatData {
  image: string;
  name: string;
  lastMessage: string;
}

export const ChatProvider = ({children}: ChatProviderProps) => {
  const queryClient = useQueryClient();
  const [selectedChat, setSelectedChat] = React.useState<number>(-1);

  const [searchQuery, setSearchQuery] = React.useState<string>('');
  // Запрос для списка чатов
  const {
    data: chatList = [],
    isLoading: listLoading,
    refetch: refetchChats
  } = useQuery<ChatInListProps[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      const response = await fetchChats();
      return response;
    },
    refetchInterval: 6000,
    staleTime: 5000
  });

  // Запрос для информации о текущем чате
  const {
    data: currentChat = null,
    isLoading: chatInfoLoading,
    refetch: refetchCurrentChat
  } = useQuery<IChatInfo | null>({
    queryKey: ['chat', selectedChat],
    queryFn: async () => {
      if (selectedChat <= 0) return null;
      const response = await getChatById(selectedChat);
      return response.data; // Предполагаем, что response.data содержит IChatInfo
    },
    enabled: selectedChat > 0,
    refetchInterval: selectedChat > 0 ? 30000 : false
  });

  // Запрос для сообщений текущего чата
  const {
    data: messages = [],
    isLoading: messagesLoading,
    refetch: refetchMessages
  } = useQuery<IMessage[]>({
    queryKey: ['messages', selectedChat],
    queryFn: async () => {
      if (selectedChat <= 0) return [];
      const response = await getChatMessages(selectedChat);
      return response;
    },
    enabled: selectedChat > 0,
    refetchInterval: selectedChat > 0 ? 2000 : false
  });

  // Мутация для создания нового чата
  const createChatMutation = useMutation({
    mutationFn: createChat,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['chats']});
    }
  });

  // Мутация для отправки сообщения
  const sendMessageMutation = useMutation({
    mutationFn: ({chatId, data}: { chatId: number, data: SendMessageData }) => sendMessage(chatId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['messages', variables.chatId]});
    }
  });

  const selectChat = useCallback((id: number) => {
    setSelectedChat(id);
  }, []);

  // Перезагрузить все динамические данные
  const invalidateData = async () => {
    setTimeout(async () => await queryClient.refetchQueries({queryKey: ['chats', 'messages']}), 150);
  }

  const parseChat = (data: ChatInListProps) => {
    console.log(data);

    const username = data.chat.companyId === null ? "Новый чат" : data.chat.company?.name || "Неизвестный чат";
    const msg = data.chat.messages[0]?.content?.text || "";

    return {
      image: data.chat.company?.imgUrl || "https://placehold.co/128x128",
      name: username,
      lastMessage: msg.substring(0, 12) + "...",
    }
  }

  // Получить инфо о профиле
  const getCurrentProfileInfo = () => {
    if (!currentChat) return false;

    const username = !currentChat.company ? "Новый чат" : currentChat.company?.name || "Неизвестный чат";
    const msg = currentChat.messages[0]?.content?.text || "";

    return {
      image: currentChat.company?.imgUrl || "https://placehold.co/128x128",
      name: username,
      lastMessage: msg.substring(0, 12) + "...",
    }
  }

  const createNewChat = useCallback(async (data: CreateChatData) => {
    try {
      await createChatMutation.mutateAsync(data);
    } catch (error) {
      console.error('Failed to create chat:', error);
      throw error;
    }
  }, [createChatMutation]);

  const fetchChatInfo = useCallback(async (chatId: number) => {
    try {
      await refetchCurrentChat();
    } catch (error) {
      console.error('Failed to fetch chat info:', error);
      throw error;
    }
  }, [refetchCurrentChat]);

  const sendNewMessage = useCallback(async (chatId: number, data: SendMessageData) => {
    try {
      await sendMessageMutation.mutateAsync({chatId, data});
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }, [sendMessageMutation]);



  const isChats = useMemo(() => chatList && chatList.length > 0, [chatList]);


  const value = {
    listLoading,
    chatLoading: chatInfoLoading || messagesLoading,
    selectedChat,
    selectChat,
    chatList,
    isChats,
    currentChat,
    messages,
    setSearchQuery,
    createNewChat,
    fetchChatInfo,
    sendNewMessage,
    parseChat,
    getCurrentProfileInfo,
    invalidateData
  };

  return (
      <ChatContext.Provider value={value}>
        {children}
      </ChatContext.Provider>
  );
};

export default ChatContext;