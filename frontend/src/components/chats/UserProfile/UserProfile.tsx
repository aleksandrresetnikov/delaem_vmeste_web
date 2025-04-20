import React, {useEffect, useState} from 'react';
import styles from "./UserProfile.module.css";
import {PhoneCall, Video, Building2, User as UserIcon, MapPin, Mail, Cake} from "lucide-react";
import useChat from "@/hooks/useChat";
import {UIChatData} from "@/context/chat.context";
import useModal from "@/hooks/useModal";
import {Button} from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { closeChat } from '@/api/chats';
import {toast} from "sonner";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";

type ProfileData = UIChatData & {
  role?: string;
  company?: {
    name: string;
    description?: string;
    imgUrl?: string;
  };
  address?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  skills?: string;
};

const UserProfile = () => {
  const chat = useChat();
  const auth = useAuth();
  const modal = useModal();
  const [data, setData] = useState<ProfileData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const refreshChatInfo = () => {
    if (chat && chat.currentChat && auth?.user?.id) {
      const profileInfo = chat.getCurrentProfileInfo(auth.user.id);
      if (profileInfo && typeof profileInfo !== 'boolean') {
        setData({
          ...profileInfo,
          role: profileInfo.role,
          company: profileInfo.company,
          address: profileInfo.address,
          phone: profileInfo.phone,
          email: profileInfo.email,
          birthDate: profileInfo.birthDate,
          skills: profileInfo.skills
        });
      }
    }
  }

  useEffect(() => {
    if (!chat) return;
    refreshChatInfo();
  }, [chat?.currentChat]);

  if (!chat) return null;
  if (!data) return null;

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

  const openProfileModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProfileOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileOpen(false);
  };

  const renderUserInfo = () => {
    if (data.role === 'ADMIN' || data.company) {
      // Рендерим информацию о компании/организации
      return (
        <>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <span>{data.company?.name}</span>
          </div>
          {data.company?.description && (
            <div className="text-sm text-muted-foreground">
              {data.company.description}
            </div>
          )}
        </>
      );
    }

    // Рендерим информацию о обычном пользователе
    return (
      <>
        {data.address && (
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span>{data.address}</span>
          </div>
        )}
        {data.phone && (
          <div className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-muted-foreground" />
            <span>{data.phone}</span>
          </div>
        )}
        {data.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <span>{data.email}</span>
          </div>
        )}
        {data.birthDate && (
          <div className="flex items-center gap-2">
            <Cake className="h-5 w-5 text-muted-foreground" />
            <span>{new Date(data.birthDate).toLocaleDateString()}</span>
          </div>
        )}
        {data.skills && (
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-muted-foreground" />
            <span>Навыки: {data.skills}</span>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className={styles.item}>
        <div onClick={openProfileModal} style={{cursor: 'pointer', display: 'contents'}}>
          <img alt={data.name} src={data.image} className={styles.avatar}/>
          <span className={styles.name}>{data.name}</span>
        </div>
        <span className={styles.last}>{data.lastMessage}</span>
        {!chat.currentChat?.isClosed && chat.currentChat?.users[0].id === auth?.user?.id && (
          <Button className={styles.addRate} onClick={handleCloseChat}>Закрыть чат</Button>
        )}
        {chat.currentChat?.isClosed && chat.currentChat.reviews?.length === 0 && (
          <Button className={styles.addRate} onClick={handleAddRate}>Оставить отзыв</Button>
        )}
        <div className={styles.buttons}>
          <PhoneCall/>
          <Video/>
        </div>
      </div>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {data.company ? 'Профиль организации' : 'Профиль пользователя'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
          
            <h3 className="text-xl font-semibold">{data.name}</h3>
            <img alt={data.name} src={data.image} className={styles.avatar}/>
            <div className="w-full space-y-3">
              {renderUserInfo()}
              
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Последнее сообщение:</span>
                  <span>{data.lastMessage}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={closeProfileModal}>Закрыть</Button>
              <Button>
                <PhoneCall className="mr-2 h-4 w-4" />
                Позвонить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfile;