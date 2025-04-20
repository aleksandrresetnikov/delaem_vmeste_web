import React, {useEffect, useState} from 'react';
import styles from "./UserProfile.module.css";
import useChat from "@/hooks/useChat";
import {UIChatData} from "@/context/chat.context";
import useModal from "@/hooks/useModal";
import {Button} from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { closeChat } from '@/api/chats';
import {toast} from "sonner";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {
  PhoneCall, 
  Video, 
  Building2, 
  User as UserIcon, 
  MapPin, 
  Mail, 
  Cake,
  Briefcase,
  Link,
  Shield,
  Calendar,
  MessageSquare,
  Star
} from "lucide-react";
import Image from 'next/image'; // Добавлен импорт Image

type ProfileData = UIChatData & {
  role?: string;
  company?: {
    name: string;
    description?: string;
    imgUrl?: string;
    links?: Array<{id: number, link: string}>; // Добавлен тип для links
  };
  address?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  skills?: string;
  fullname?: string;
  username?: string;
  categories?: string[]; // Добавлен тип для categories
  createdAt?: string | Date; // Добавлен тип для createdAt
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
          // role: profileInfo.role,
          // company: profileInfo.company,
          // address: profileInfo.address,
          // phone: profileInfo.phone,
          // email: profileInfo.email,
          // birthDate: profileInfo.birthDate,
          // skills: profileInfo.skills,
          // fullname: profileInfo.fullname,
          // username: profileInfo.username,
          // categories: profileInfo.categories,
          // createdAt: profileInfo.createdAt
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
      // Данные организации/компании
      return (
        <div className="space-y-3">
          {/* Основная информация */}
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Название: {data.company?.name}</span>
          </div>

          {data.company?.description && (
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
              <span>Описание: {data.company.description}</span>
            </div>
          )}

          {data.company?.imgUrl && (
            <div className="flex items-center gap-2">
              <Image 
                src={data.company.imgUrl} 
                alt="Company logo" 
                width={20} 
                height={20} 
                className="h-5 w-5 text-muted-foreground"
              />
              <span>Логотип компании</span>
            </div>
          )}

          {/* Контактные данные */}
          <div className="pt-2 border-t">
            <h4 className="font-medium mb-2">Контактные данные:</h4>
            
            {data.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>Email: {data.email}</span>
              </div>
            )}

            {data.phone && (
              <div className="flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-muted-foreground" />
                <span>Телефон: {data.phone}</span>
              </div>
            )}

            {data.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>Адрес: {data.address}</span>
              </div>
            )}
          </div>

          {/* Ссылки компании */}
          {data.company?.links && data.company.links.length > 0 && (
            <div className="pt-2 border-t">
              <h4 className="font-medium mb-2">Ссылки:</h4>
              {data.company.links.map(link => (
                <div key={link.id} className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-muted-foreground" />
                  <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {link.link}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Данные обычного пользователя
    return (
      <div className="space-y-3">
        {/* Основная информация */}
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Имя: {data.fullname || data.name}</span>
        </div>

        {data.username && (
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-muted-foreground" />
            <span>Логин: {data.username}</span>
          </div>
        )}

        {data.role && (
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <span>Роль: {data.role}</span>
          </div>
        )}

        {/* Контактные данные */}
        <div className="pt-2 border-t">
          <h4 className="font-medium mb-2">Контактные данные:</h4>
          
          {data.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>Email: {data.email}</span>
            </div>
          )}

          {data.phone && (
            <div className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-muted-foreground" />
              <span>Телефон: {data.phone}</span>
            </div>
          )}

          {data.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>Адрес: {data.address}</span>
            </div>
          )}
        </div>

        {/* Дополнительная информация */}
        <div className="pt-2 border-t">
          <h4 className="font-medium mb-2">Дополнительно:</h4>
          
          {data.birthDate && (
            <div className="flex items-center gap-2">
              <Cake className="h-5 w-5 text-muted-foreground" />
              <span>Дата рождения: {new Date(data.birthDate).toLocaleDateString()}</span>
            </div>
          )}

          {data.skills && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <span>Навыки: {data.skills}</span>
            </div>
          )}

          {data.categories && data.categories.length > 0 && (
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-muted-foreground" />
              <span>Категории: {data.categories.join(', ')}</span>
            </div>
          )}

          {data.createdAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>Дата регистрации: {new Date(data.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
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
            <img alt={data.name} src={data.image} className="w-24 h-24 rounded-full"/>
            <h3 className="text-xl font-semibold">{data.name}</h3>
            <div className="w-full space-y-3">
              {renderUserInfo()}
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