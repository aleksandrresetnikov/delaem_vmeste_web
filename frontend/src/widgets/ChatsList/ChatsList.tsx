"use client";
import React from 'react';
import styles from "./ChatsList.module.css";
import ChatItem from "@/components/chats/ChatItem/ChatItem";
import useChat from "@/hooks/useChat";
import LoadingWrapper from "@/components/chats/LoadingWrapper/LoadingWrapper";

const ChatsList = () => {
  const chat = useChat();

  return (
      <div className={styles.wrapper}>
        {
            chat?.listLoading && <LoadingWrapper/>
        }
        {chat?.chatList.map(item => (
            <ChatItem item={item} key={item.id}/>
        ))}
      </div>
  );
};

export default ChatsList;