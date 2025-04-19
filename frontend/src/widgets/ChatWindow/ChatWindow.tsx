"use client";
import React from 'react';
import styles from "./ChatWindow.module.css";
import Bubble from "@/components/chats/Bubble/Bubble";
import Status from "@/components/chats/Status/Status";
import UserProfile from "@/components/chats/UserProfile/UserProfile";
import useChat from "@/hooks/useChat";
import {IMessage} from '@/api/chats';
import useAuth from "@/hooks/useAuth";
import LoadingWrapper from "@/components/chats/LoadingWrapper/LoadingWrapper";

const ChatWindow = () => {
  const chat = useChat();
  const auth = useAuth();

  const renderMessage = (item: IMessage) => {
    if (!auth?.user?.id) return;

    if (item.type === "DEFAULT") {
      return (
          <Bubble
              time={item.createdOn.toString()}
              byMe={item.userId === auth.user.id && !item.content.ai}>
            {item.content.text}
          </Bubble>
      )
    }

    return (<Status loader={item.type === "STATUS_LOADING"}>{item.content.text}</Status>)
  }

  return (
      <div className={styles.wrapper}>
        {/* Профиль организации/юзера */}
        {
            chat?.currentChat && <div className={styles.profile}><UserProfile/></div>
        }

        {
            chat?.chatLoading && <LoadingWrapper/>
        }

        {
            chat?.messages && chat?.messages.map(item => renderMessage(item))
        }
      </div>
  );
};

export default ChatWindow;