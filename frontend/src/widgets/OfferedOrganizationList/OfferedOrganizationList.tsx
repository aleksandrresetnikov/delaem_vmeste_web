import s from './OfferedOrganizationList.module.css'
import React from 'react';
import OfferedOrganization from "@/components/chats/OfferedOrganization/OfferedOrganization";
import useChat from "@/hooks/useChat";

const OfferedOrganizationList= () => {
  const chat = useChat();
  const lastMsg = chat?.messages[chat?.messages.length - 1];
  if(!lastMsg || lastMsg.type !== "SELECT_ORGANIZATION") return;

    return (
        <div className={s.wrapper}>
          {
            lastMsg.content.list.map((item: number, i: number) => (
                <OfferedOrganization key={i} orgId={item.toString()} isBest={i === 0}/>
            ))
          }
        </div>
    );
};

export default OfferedOrganizationList;