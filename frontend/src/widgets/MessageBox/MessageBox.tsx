"use client";
import React, {useRef, useState} from 'react';
import styles from "./MessageBox.module.css";
import {Button} from '@/components/ui/button';
import {ChevronRight, Paperclip} from "lucide-react";
import {createChat, sendMessage} from "@/api/chats";
import useChat from "@/hooks/useChat";
import {toast} from 'sonner';
import axios from '@/lib/axios';

const MessageBox = () => {
  const [text, setText] = useState("");
  const chat = useChat();
  const $file = useRef(null);

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

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`/chat/message/file/${chat?.currentChat?.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Важно для загрузки файлов
        },
      });
      if (response.status !== 201) throw new Error('Upload failed');
      $file.current.files = null;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
      <div className={styles.wrapper}>
        <input type="file" ref={$file} style={{position:"absolute", zIndex: -999}} onChange={handleChange} />
        <Button variant={"ghost"} onClick={() => $file.current.click()}>
          <Paperclip/>
        </Button>
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