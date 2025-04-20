import s from './CardList.module.css'
import {OrganizationData} from "@/api/organizations";
import OrganizationCard from "@/components/organizations/OrganizationCard/OrganizationCard";
import React from "react";

const CardList = ({data}: { data: OrganizationData[] }) => {
  return (
      <div className={s.wrapper}>
        <div className={s.cardsGrid}>
          {
            data.map(card =>
                <OrganizationCard
                    key={card.id}
                    id={card.id}
                    imgUrl={card.imgUrl}
                    description={card.description}
                    name={card.name}
                    stats={card.stats}
                    ownerId={card.ownerId}
                />
            )
          }
        </div>
      </div>
  )
}


export default CardList