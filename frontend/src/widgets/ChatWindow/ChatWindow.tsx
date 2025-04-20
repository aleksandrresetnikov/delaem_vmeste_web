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

const ChatWindow = () => {
  const chat = useChat();
  const auth = useAuth();
  const $window = useRef(null);
  const $w2 = useRef(null);

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

          {/* Нет выбранного чата */}
          {
            // chat?.selectedChat === -1 && chat?.isChats && <div className={styles.hint}>
            //     <h4>Выберите, с кем хотите связаться</h4>
            // </div>
          }

          {/* Выбранный чат закрыт */}
          {
            // chat?.currentChat?.isClosed && <div className={styles.hint}>
            //     <h4>Выберите, с кем хотите связаться</h4>
            // </div>
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

          {/*  <Bubble*/}
          {/*      time={new Date().toString()}*/}
          {/*      byMe={true}>*/}
          {/*    {'item.content.text'}*/}
          {/*  </Bubble>*/}
          {/*  <Bubble*/}
          {/*      time={new Date().toString()}*/}
          {/*      byMe={false}>*/}
          {/*    {'item.content.text'}*/}
          {/*  </Bubble><Bubble*/}
          {/*    time={new Date().toString()}*/}
          {/*    byMe={true}>*/}
          {/*  {'item.content.text'}*/}
          {/*</Bubble>*/}

        </div>
      </div>
  );
};

export default ChatWindow;