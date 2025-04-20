"use client";
import React, {useState} from 'react';
import styles from "./MessageBox.module.css";
import {Button} from '@/components/ui/button';
import {ChevronRight} from "lucide-react";
import {createChat, sendMessage} from "@/api/chats";
import useChat from "@/hooks/useChat";
import {toast} from 'sonner';

const MessageBox = () => {
  const [text, setText] = useState("");
  const chat = useChat()

  const handleSendMessage = async () => {
    const chatId = chat?.currentChat?.id;
    try {
      if (chatId) {
        // Если чат выбран
        await sendMessage(chatId, {content: {text}});
        await chat?.invalidateData();
      } else {
        // Если мы создаём новый
        const chatData = await createChat({prompt: text});
        if (!chatData.data) return;
        chat?.selectChat(chatData.data.id);
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Не удалось отправить сообщение! " + e.toString());
    }

    setText('')
  }

  return (
      <div className={styles.wrapper}>
        <input
            onChange={(e) => setText(e.target.value)}
            type={"text"}
            value={text}
            placeholder={"Введите текст"}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button variant={"default"} disabled={!text} onClick={handleSendMessage}>
          <ChevronRight/>
        </Button>
      </div>
  );
};

export default MessageBox;