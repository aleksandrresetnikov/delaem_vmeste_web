"use client";
import React from 'react';
import styles from "./ChatsList.module.css";
import ChatItem from "@/components/chats/ChatItem/ChatItem";
import useChat from "@/hooks/useChat";
import LoadingWrapper from "@/components/chats/LoadingWrapper/LoadingWrapper";
import {Button} from "@/components/ui/button";

const ChatsList = () => {
  const chat = useChat();

  if (chat?.listLoading) return (
      <div className={styles.wrapper}>
        <LoadingWrapper/>
      </div>
  )

  return (
      <div className={styles.wrapper}>
        <Button variant={"link"} onClick={() => chat?.selectChat(-1)}>Создать заявку</Button>
        {chat?.chatList.map(item => (
            <ChatItem item={item} key={item.id}/>
        ))}
      </div>
  );
};

export default ChatsList;