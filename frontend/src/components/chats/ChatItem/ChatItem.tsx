import React from 'react';
import styles from "./ChatItem.module.css";
import useChat from "@/hooks/useChat";
import {ChatInListProps} from '@/context/chat.context';

const ChatItem = ({item}: { item: ChatInListProps }) => {
  const chat = useChat();
  let data;

  if (chat) data = chat.parseChat(item);

  return (
      <div className={styles.item} onClick={() => chat?.selectChat(item.chatId)}>
        <img alt={data.name} src={data.image} className={styles.avatar}/>
        <span className={styles.name}>{data.name}</span>
        <span className={styles.last}>{data.lastMessage}</span>
      </div>
  );
};

export default ChatItem;