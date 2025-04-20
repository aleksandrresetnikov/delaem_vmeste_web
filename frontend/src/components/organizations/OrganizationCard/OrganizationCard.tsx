"use client";
import React, {FC} from 'react';
import s from "./OrganizationCard.module.css";
import {OrganizationCardData} from "@/api/organizations";
import useModal from "@/hooks/useModal";
import InfoBadge from "@/components/organizations/InfoBadge/InfoBadge";
import {Button} from "@/components/ui/button";
import {correctWordForm} from "@/modals/OrganizationModal/OrganizationModal";

const OrganizationCard: FC<OrganizationCardData> = ({id, imageUrl, rate, title, description}) => {
  const modal = useModal()
  if (!modal) return

  const handleOpenModal = () => {
    modal.switchModal('organization', {organizationModal: {id}})
  }

  return (
      <div className={s.card} title="Подробнее" onClick={handleOpenModal}>
        <div className={s.imageBlock}>
          <img className={s.image} width={200} height={200} alt={title} src={imageUrl || '/icons/heart.png'}/>
            {
                rate > 0 && <InfoBadge className={s.infoBadge} type='likes' count={rate} text={correctWordForm(rate)}/>
            }
        </div>

        <div className={s.text}>
          <h3>{title}</h3>
          <p className={s.description}>{description}</p>
        </div>

        <div className={s.featureBlock}>
          <div className={s.btnBlock}>
            <Button variant='secondary'>Подробнее</Button>
            <Button>Связаться</Button>
          </div>
        </div>
      </div>
  );
};

export default OrganizationCard;