import s from './CardList.module.css'
import {OrganizationCardData} from "@/api/organizations";
import OrganizationCard from "@/components/organizations/OrganizationCard/OrganizationCard";
import React from "react";

const CardList = ({data}: { data: OrganizationCardData[] }) => {
  return (
      <div className={s.wrapper}>
        <div className={s.cardsGrid}>
          {
            data.map(card =>
                <OrganizationCard
                    key={card.id}
                    id={card.id}
                    rate={card.rate}
                    imageUrl={card.imgUrl}
                    title={card.name}
                    description={card.description}
                />
            )
          }
        </div>
      </div>
  )
}


export default CardList