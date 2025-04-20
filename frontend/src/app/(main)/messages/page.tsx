"use client";
import React from 'react';
import styles from "./page.module.css";
import ChatsList from "@/widgets/ChatsList/ChatsList";
import ChatWindow from "@/widgets/ChatWindow/ChatWindow";
import MessageBox from '@/widgets/MessageBox/MessageBox';
import {ChevronLeft} from 'lucide-react';
import useChat from "@/hooks/useChat";
import {cn} from "@/lib/utils";

const Messages = () => {
  const isMobile = typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false;
  const chat = useChat();

  if (chat === undefined) return null

  return (
      <>
        <div className={cn(styles.grid,
            !chat.isChats && styles.hasNotChats)
        }>
          {/* Поиск */}

          {/* Список чатов */}
          {
              chat.isChats &&
              (chat.selectedChat === -1 || !isMobile) && (
                  <>
                    <div className={styles.search}>
                      <input className={styles.customInput} type="text" placeholder="Поиск"/>
                    </div>
                    <div className={styles.list}><ChatsList/></div>
                  </>
              )}

          {(chat.selectedChat !== -1 || !isMobile) && (
              <>
                {/* Главное окно чата */}
                {isMobile && <ChevronLeft onClick={() => chat.selectChat(-1)}
                                          className={styles.close_button}></ChevronLeft>}
                <div className={styles.chat}><ChatWindow/></div>

                {/* Поле для ввода сообщения */}
                <div className={styles.messageBox}><MessageBox/></div>
              </>
          )}
        </div>
      </>
  );
};

export default Messages;