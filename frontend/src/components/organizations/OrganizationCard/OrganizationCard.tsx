"use client";
import React, {FC} from 'react';
import s from "./OrganizationCard.module.css";
import {OrganizationData} from "@/api/organizations";
import useModal from "@/hooks/useModal";
import InfoBadge from "@/components/organizations/InfoBadge/InfoBadge";
import {Button} from "@/components/ui/button";
import {checkRate, correctWordForm} from "@/helpers/organiztion.helpers";

const OrganizationCard: FC<OrganizationData> = ({id, name, stats, imgUrl, description}) => {
  const modal = useModal()
  if (!modal) return

  const handleOpenModal = () => {
    modal.switchModal('organization', {organizationModal: {id}})
  }

  return (
      <div className={s.card} title="Подробнее" onClick={handleOpenModal}>
        <div className={s.imageBlock}>
          <img className={s.image} width={200} height={200} alt={name} src={imgUrl || '/icons/heart.png'}/>
          <div className={s.badgeContainer}>
            {
                stats.closedChats > 0 &&
                <InfoBadge className={s.infoBadge} type='likes' count={stats.closedChats}
                           text={correctWordForm(stats.closedChats)}/>
            }
            {
                stats.averageRating > 0 &&
                <InfoBadge className={s.infoBadge} type='rate' count={stats.averageRating}
                           text={checkRate(stats.averageRating)}/>
            }
          </div>
        </div>

        <div className={s.text}>
          <h3>{name}</h3>
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