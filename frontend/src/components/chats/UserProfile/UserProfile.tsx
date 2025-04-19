import React, {useEffect, useState} from 'react';
import styles from "./UserProfile.module.css";
import {PhoneCall, Video} from "lucide-react";
import useChat from "@/hooks/useChat";
import {UIChatData} from "@/context/chat.context";

const UserProfile = () => {
  const chat = useChat();
  const [data, setData] = useState<UIChatData | boolean>(false);

  if (!chat) return null;

  useEffect(() => {
    if (chat.currentChat) setData(chat.getCurrentProfileInfo());
  }, [chat.currentChat]);

  if (typeof data === "boolean") return null;

  return (
      <div className={styles.item}>
        <img alt={data.name} src={data.image} className={styles.avatar}/>
        <span className={styles.name}>{data.name}</span>
        <span className={styles.last}>{data.lastMessage}</span>
        <div className={styles.buttons}>
          <PhoneCall/>
          <Video/>
        </div>
      </div>
  );
};

export default UserProfile;