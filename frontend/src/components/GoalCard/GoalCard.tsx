import s from './GoalCard.module.css'
import React, {FC} from 'react';
import Image from 'next/image'
import {IGoalCard} from "@/mocks/Goals.mock";

const GoalCard: FC<IGoalCard> = ({title, imageUrl, description}) => {
  return (
      <div className={s.goalCard}>
        <h3>
          {title}
        </h3>
        <p>
          {description}
        </p>

        <div className={s.imageContainer}>
          <Image
              className={s.image}
              src={`${imageUrl}`}
              width={200}
              height={200}
              alt={'Картинка цели'}
          />
        </div>

      </div>
  );
};

export default GoalCard;