"use client";
import React, {useRef} from 'react';
import styles from "./ChatWindow.module.css";
import Bubble from "@/components/chats/Bubble/Bubble";
import Status from "@/components/chats/Status/Status";
import UserProfile from "@/components/chats/UserProfile/UserProfile";
import useChat from "@/hooks/useChat";
import {IMessage} from '@/api/chats';
import useAuth from "@/hooks/useAuth";
import LoadingWrapper from "@/components/chats/LoadingWrapper/LoadingWrapper";
import {useInterval} from "react-use";
import OfferedOrganizationList from "@/widgets/OfferedOrganizationList/OfferedOrganizationList";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const ChatWindow = () => {
  const chat = useChat();
  const auth = useAuth();
  const router = useRouter();
  const $window = useRef(null);
  const $w2 = useRef(null);

  const renderMessage = (item: IMessage) => {
    if (!auth?.user?.id) return;

    if (item.type === "DEFAULT") {
      if(item.content.text){
        return (
            <Bubble
                time={item.createdOn.toString()}
                byMe={item.userId === auth.user.id && !item.content.ai}
                byAi={item.content.ai || false}>
              {item.content.text}
            </Bubble>
        )
      } else if(item.content.link){
        return (
            <Bubble
                time={item.createdOn.toString()}
                byMe={item.userId === auth.user.id && !item.content.ai}
                byAi={item.content.ai || false}>
              <Button variant={"link"} onClick={() => item.content.link && router.push(item.content.link)}>Отправлен файл</Button>
            </Bubble>
        )
      }
    }
    return (<Status loader={item.type === "STATUS_LOADING"}>{item.content.text}</Status>)
  }

  useInterval(() => {
    if (!$window.current) return;
    // @ts-ignore
    if ($window.current.scrollHeight - 500 - $window.current.scrollTop < 200) {
      // @ts-ignore
      $window.current.scrollTop = $window.current.scrollHeight;
    }
  }, 500);

  return (
      <div className={styles.scroll} ref={$window}>
        <div className={styles.wrapper} ref={$w2}>

          {/* Нет чатов вообще */}
          {
              !chat?.isChats || chat?.selectedChat === -1 &&
              (<div className={styles.hint}>
                <h4>Опишите проблему</h4>
                <p>Мы подберем подходящее решение для Вас</p>
              </div>)
          }

          {/* Профиль организации/юзера */}
          {
              chat?.currentChat &&
              <div className={styles.profile}><UserProfile/></div>
          }

          {
              chat?.chatLoading && <LoadingWrapper/>
          }

          {
              chat?.messages && chat?.messages.map(item => renderMessage(item))
          }

          {
              !chat?.currentChat?.company?.id &&
              chat?.messages[chat?.messages.length - 1] &&
              chat?.messages[chat?.messages.length - 1].type === "SELECT_ORGANIZATION" &&
              <OfferedOrganizationList/>
          }
        </div>
      </div>
  );
};

export default ChatWindow;