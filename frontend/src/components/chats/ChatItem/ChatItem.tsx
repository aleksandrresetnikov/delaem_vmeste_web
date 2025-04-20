import React from 'react';
import styles from "./ChatItem.module.css";
import useChat from "@/hooks/useChat";
import {ChatInListProps} from '@/context/chat.context';
import useModal from "@/hooks/useModal";
import {cn} from "@/lib/utils";
import useAuth from "@/hooks/useAuth";

const ChatItem = ({item}: { item: ChatInListProps }) => {
    const chat = useChat();
    const auth = useAuth();
    let data;

    if (chat) data = chat.parseChat(item, auth?.user?.id || -1);
    if (!data ) return;

    const handleClick = () => {
        chat?.selectChat(item.chatId)
    }
    return (
        <div className={cn(styles.item, item.chatId === chat?.selectedChat && styles.active)} onClick={handleClick}>
            <img alt={data.name} src={data.image} className={styles.avatar}/>
            <span className={styles.name}>{data.name}</span>
            <span className={styles.last}>{data.lastMessage}</span>
        </div>
    );
};

export default ChatItem;