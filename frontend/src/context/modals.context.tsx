"use client";
import React, {createContext, ReactNode, useState} from 'react';
import {OrganizationCardData} from "@/api/organizations";

export type ModalsList =
    "none"
    | "organization"
    | "rate";

interface RateModalData{
  chatId: number
}

//возможные данные в модалках
interface ModalData {
  //OrganizationModal
  organizationModal?: {id: number}
  rateModal?: RateModalData
}

interface ModalsProviderType {
  currentModal: ModalsList;
  switchModal: (modal: ModalsList, data?: ModalData) => void;
  closeAll: () => void;
  isOpen: (modal: ModalsList) => boolean;
  isData: () => boolean
  onClose: (opened: boolean) => void;
  data?: ModalData | null
}

const ModalsContext = createContext<ModalsProviderType | undefined>(undefined);

interface ModalsProviedProps {
  children: ReactNode;
}

export const ModalsProvier = ({children}: ModalsProviedProps) => {
  const [currentModal, setModal] = useState<ModalsList>("none");
  const [data, setData] = useState<ModalData | null>(null)

  // Сменить модалку
  const switchModal = (modal: ModalsList, data?: ModalData) => {
    setModal(modal);
    if (data) {
      setData(data)
    }
  }

  // Закрыть все
  const closeAll = () => {
    setModal("none");
    setData(null)
  }

  // Открыта ли модалка
  const isOpen = (modal: ModalsList) => {
    return currentModal === modal;
  }

  // Есть ли данные
  const isData = () => {
    return data !== undefined || data != null
  }

  // При закрытии модалки
  const onClose = (opened: boolean) => {
    if (!opened) {
      setModal("none");
      setData(null)
    }
  }

  // Результат - контекст
  return (
      <ModalsContext.Provider value={{onClose, isOpen, currentModal, switchModal, closeAll, isData, data}}>
        {children}
      </ModalsContext.Provider>
  );
};

export default ModalsContext;