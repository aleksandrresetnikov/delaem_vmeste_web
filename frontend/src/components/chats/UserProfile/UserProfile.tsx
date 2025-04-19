import React, {useEffect, useState} from 'react';
import styles from "./UserProfile.module.css";
import {PhoneCall, Video} from "lucide-react";
import useChat from "@/hooks/useChat";
import {UIChatData} from "@/context/chat.context";
import useModal from "@/hooks/useModal";
import {Button} from "@/components/ui/button";

const UserProfile = () => {
    // const chat = useChat();
    const [data, setData] = useState<UIChatData | boolean>(false);

    // useEffect(() => {
    //   if (!chat) return;
    //   if (chat.currentChat) setData(chat.getCurrentProfileInfo());
    // }, [chat?.currentChat]);
    //
    // if (!chat) return null;
    //
    // if (typeof data === "boolean") return null;
    const modal = useModal()
    const handleAddRate = () => {
        modal?.switchModal('rate')
    }
    return (
        // <div className={styles.item}>
        //   <img alt={data.name} src={data.image} className={styles.avatar}/>
        //   <span className={styles.name}>{data.name}</span>
        //   <span className={styles.last}>{data.lastMessage}</span>
        //   <div className={styles.buttons}>
        //     <PhoneCall/>
        //     <Video/>
        //   </div>
        // </div>
        <div className={styles.item}>
            <img alt={'data.name'} src={'data.image'} className={styles.avatar}/>
            <span className={styles.name}>{'data.name'}</span>
            <span className={styles.last}>{'data.lastMessage'}</span>
            <Button className={styles.addRate} onClick={handleAddRate}>Оставить отзыв</Button>
            <div className={styles.buttons}>
                <PhoneCall/>
                <Video/>
            </div>
        </div>
    );
};

export default UserProfile;