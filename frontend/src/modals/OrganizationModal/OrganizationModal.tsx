'use client'
import s from './OrganizationModal.module.css'
import React, {useState} from 'react';
import useModal from "@/hooks/useModal";
import {getOrganizationById, OrganizationData} from "@/api/organizations";
import {Sheet, SheetContent, SheetHeader, SheetTitle,} from "@/components/ui/sheet"
import Image from 'next/image'
import InfoBadge from "@/components/organizations/InfoBadge/InfoBadge";
import ReviewsList from "@/widgets/ReviewsList/ReviewsList";
import {Button} from "@/components/ui/button";
import {useAsync} from "react-use";
import useChat from "@/hooks/useChat";
import { toast } from 'sonner';
import {selectChatOrganization} from "@/api/chats";

//функции помогаторы
export const correctWordForm = (count: number): string => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return "Доброе дело";
  } else if (
      count % 10 >= 2 &&
      count % 10 <= 4 &&
      (count % 100 < 10 || count % 100 >= 20)
  ) {
    return "Добрых дела";
  } else {
    return "Добрых дел";
  }
}
const checkRate = (rate: number): string => {
  if (0 <= rate && rate <= 2) return 'Организация сомнительная'
  else if (2 < rate && rate <= 3.5) return 'Организация нормальная'
  else if (3.5 < rate && rate <= 5) return 'Организация Хорошая'
  else return 'Организация сомнительная'
}


const ShowContent = (data: OrganizationData) => {
  const chat = useChat();
  const setOrganizationChat = async () => {
    const chatId = chat?.currentChat?.id;
    if(!chatId) return;

    try {
      await selectChatOrganization(chatId, data.id);
    } catch(e){
      console.error(e);
      toast.error('Не удалось выбрать организацию');
    }
  }

  return (
      <>
        <div className={s.imageBlock}>
          <Image
              className={s.image}
              src={data?.imageUrl || '/icons/heart.png'}
              width={400}
              height={400}
              alt={'Лого компании'}
          />
        </div>
        <div className={s.contentWrapper}>
          <SheetHeader>
            <SheetTitle>{data.name}</SheetTitle>
            <p>{data.description}</p>
          </SheetHeader>

          <div className={s.badgeWrapper}>
            <InfoBadge
                type={'likes'}
                count={data.closedChats}
                text={correctWordForm(data.rate)}
            />
            <InfoBadge
                type={'rate'}
                text={checkRate(data.rate)}
                count={data.rate}
            />

          </div>
          <Button className={s.call} onClick={setOrganizationChat}>Связаться</Button>

          <div className={s.reviewSection}>
            <div className={s.reviewHeader}>
              <h4>Отзывы</h4>
              <span>{data.reviews.length}</span>
            </div>
            <ReviewsList reviews={data.reviews}/>
          </div>
        </div>
      </>
  )
}

//основной блок
const OrganizationModal = () => {
  const [organizationInfo, setOrganizationInfo] =
      useState<OrganizationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const modal = useModal()
  const isOpen = modal?.isOpen('organization')
  const fetchOrganizationData = async (id?: string) => {
    if (id === undefined) return null
    try {
      const {data} = await getOrganizationById(id)
      console.log(data)
      return data
    } catch (e) {
      console.log(e);
      return null
    }
  }
  const Error = (id?: string) => {
    return (
        <div className={s.error}>
          <h4>Что то пошло не так</h4>
          <Button onClick={() => fetchOrganizationData(id)}>Повторить попытку</Button>
        </div>
    )
  }

  useAsync(async () => {
    if (isOpen) {
      const data = await fetchOrganizationData(modal?.data?.organizationModal?.id)
      setOrganizationInfo(data)
    }
  }, [isOpen]);

  const onClose = (state: boolean) => {
    modal?.onClose(state)
  }

  return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className={s.sheetWrapper}>
          <SheetTitle/>
          {
            organizationInfo !== null
                ? ShowContent(organizationInfo)
                : Error(modal?.data?.organizationModal?.id)
          }
        </SheetContent>
      </Sheet>
  );
};

export default OrganizationModal;