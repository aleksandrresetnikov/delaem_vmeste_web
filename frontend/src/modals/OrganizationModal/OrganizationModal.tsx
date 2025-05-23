'use client'
import s from './OrganizationModal.module.css'
import React, {useState} from 'react';
import useModal from "@/hooks/useModal";
import {ExtendedOrganizationData, getOrganizationById} from "@/api/organizations";
import {Sheet, SheetContent, SheetHeader, SheetTitle,} from "@/components/ui/sheet"
import Image from 'next/image'
import InfoBadge from "@/components/organizations/InfoBadge/InfoBadge";
import ReviewsList from "@/widgets/ReviewsList/ReviewsList";
import {Button} from "@/components/ui/button";
import {useAsync} from "react-use";
import useChat from "@/hooks/useChat";
import {toast} from 'sonner';
import {selectChatOrganization} from "@/api/chats";
import LoadingWrapper from "@/components/chats/LoadingWrapper/LoadingWrapper";
import {checkRate, correctWordForm} from "@/helpers/organiztion.helpers";


const ShowContent = (data: ExtendedOrganizationData) => {
  const chat = useChat();
  const setOrganizationChat = async () => {
    const chatId = chat?.currentChat?.id;
    if (!chatId) return;

    try {
      await selectChatOrganization(chatId, data.id);
    } catch (e) {
      console.error(e);
      toast.error('Не удалось выбрать организацию');
    }
  }

  return (
      <>
        <div className={s.imageBlock}>
          <Image
              className={s.image}
              src={data?.imgUrl || '/icons/heart.png'}
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
                count={data.stats.closedChats}
                text={correctWordForm(data.stats.closedChats)}
            />
            <InfoBadge
                type={'rate'}
                text={checkRate(data.stats.averageRating)}
                count={data.stats.averageRating}
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
      useState<ExtendedOrganizationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const modal = useModal()
  const isOpen = modal?.isOpen('organization')

  const fetchOrganizationData = async (id?: number) => {
    if (id === undefined) return null
    setIsLoading(true)
    try {
      const {data} = await getOrganizationById(id)
      console.log(data, 'дата модалки')
      return data
    } catch (e) {
      console.log(e);
      return null
    } finally {
      setIsLoading(false)
    }
  }
  const Error = (id?: number) => {
    return (
        <div className={s.error}>
          <h4>Что то пошло не так</h4>
          <Button onClick={() => fetchOrganizationData(id)}>Повторить попытку</Button>
        </div>
    )
  }

  useAsync(async () => {
    if (isOpen) {
      const id = modal?.data?.organizationModal?.id
      const data = await fetchOrganizationData(id)
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
            isLoading
                ? <LoadingWrapper/>
                : organizationInfo !== null
                    ? ShowContent(organizationInfo)
                    : Error(modal?.data?.organizationModal?.id)

          }
        </SheetContent>
      </Sheet>
  );
};

export default OrganizationModal;