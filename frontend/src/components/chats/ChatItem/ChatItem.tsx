import React from 'react';
import styles from "./ChatItem.module.css";
import useChat from "@/hooks/useChat";
import {ChatInListProps} from '@/context/chat.context';
import useModal from "@/hooks/useModal";

const ChatItem = ({item}: { item: ChatInListProps }) => {
    const chat = useChat();
    let data;

    if (chat) data = chat.parseChat(item);
    if (!data ) return;

    const handleClick = () => {
        chat?.selectChat(item.chatId)
    }
    return (
        <div className={styles.item} onClick={handleClick}>
            <img alt={data.name} src={data.image} className={styles.avatar}/>
            <span className={styles.name}>{data.name}</span>
            <span className={styles.last}>{data.lastMessage}</span>
        </div>
    );
};

export default ChatItem;