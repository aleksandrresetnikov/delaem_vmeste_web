import React, {useEffect, useState} from 'react';
import styles from "./UserProfile.module.css";
import {PhoneCall, Video} from "lucide-react";
import useChat from "@/hooks/useChat";
import {UIChatData} from "@/context/chat.context";
import useModal from "@/hooks/useModal";
import {Button} from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { closeChat } from '@/api/chats';
import {toast} from "sonner";

const UserProfile = () => {
  const chat = useChat();
  const auth = useAuth();
  const modal = useModal();
  const [data, setData] = useState<UIChatData | boolean>(false);

  const refreshChatInfo = () => {
    if (chat && chat.currentChat) setData(chat.getCurrentProfileInfo());
  }

  useEffect(() => {
    if (!chat) return;
    refreshChatInfo();
  }, [chat?.currentChat]);

  if (!chat) return null;

  if (typeof data === "boolean") return null;


  const handleAddRate = () => {
    modal?.switchModal('rate')
  }

  const handleCloseChat = async () => {
    if(!chat.currentChat?.id) return;

    try {
      await closeChat(chat.currentChat?.id);
      await chat.invalidateData();
      refreshChatInfo();
    } catch(e){
      console.error(e);
      toast.error('Не удалось закрыть чат!');
    }
  }

  return (
      <div className={styles.item}>
        <img alt={'data.name'} src={data.image} className={styles.avatar}/>
        <span className={styles.name}>{data.name}</span>
        <span className={styles.last}>{data.lastMessage}</span>
        {!chat.currentChat?.isClosed && chat.currentChat?.users[0].id === auth?.user?.id && <Button className={styles.addRate} onClick={handleCloseChat}>Закрыть чат</Button>}
        {chat.currentChat?.isClosed && !chat.currentChat.reviews && <Button className={styles.addRate} onClick={handleAddRate}>Оставить отзыв</Button>}
        <div className={styles.buttons}>
          <PhoneCall/>
          <Video/>
        </div>
      </div>
  );
};

export default UserProfile;