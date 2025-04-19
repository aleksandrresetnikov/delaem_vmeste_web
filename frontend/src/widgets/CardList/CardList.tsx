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
                    imageUrl={card.imageUrl}
                    title={card.title}
                    description={card.description}
                />
            )
          }

          <OrganizationCard
              key={"a"}
              id={"b"}
              imageUrl={"v"}
              title={"title"}
              description={"desc"}
          />
          <OrganizationCard
              key={"a"}
              id={"b"}
              imageUrl={"v"}
              title={"title"}
              description={"desc"}
          />
          <OrganizationCard
              key={"a"}
              id={"b"}
              imageUrl={"v"}
              title={"title"}
              description={"desc"}
          />
          <OrganizationCard
              key={"a"}
              id={"b"}
              imageUrl={"v"}
              title={"title"}
              description={"desc"}
          />
          <OrganizationCard
              key={"a"}
              id={"b"}
              imageUrl={"v"}
              title={"title"}
              description={"desc"}
          />
          <OrganizationCard
              key={"a"}
              id={"b"}
              imageUrl={"v"}
              title={"title"}
              description={"desc"}
          />

          <OrganizationCard
              key={"a"}
              id={"b"}
              imageUrl={"v"}
              title={"title"}
              description={"desc"}
          />
        </div>
      </div>
  )
}


export default CardList