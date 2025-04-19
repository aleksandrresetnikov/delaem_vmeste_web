"use client";
import React, {useState} from 'react';
import styles from "./MessageBox.module.css";
import {Button} from '@/components/ui/button';
import {ChevronRight} from "lucide-react";
import {sendMessage} from "@/api/chats";
import useChat from "@/hooks/useChat";

const MessageBox = () => {
  const [text, setText] = useState("");
  const chat = useChat()

  const handleSendMessage = async () => {
      const chatId = chat?.currentChat?.id
      if (chatId) await sendMessage(chatId, {text})
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